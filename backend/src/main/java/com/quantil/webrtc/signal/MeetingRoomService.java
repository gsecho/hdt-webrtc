package com.quantil.webrtc.signal;

import com.alibaba.fastjson.JSONObject;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.signal.bean.*;
import com.quantil.webrtc.signal.constants.WebSocketConstants;
import com.quantil.webrtc.signal.utils.StunHttpService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.xpath.operations.Bool;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/29 14:23
 */
@Slf4j
@Service
public class MeetingRoomService {

    ConcurrentHashMap<String, MeetingRoom> roomMap = new ConcurrentHashMap();//<roomId, ...> 所有的连接信息管理
    ConcurrentLinkedQueue<WebSocketUserPrincipal> deleteQueue = new ConcurrentLinkedQueue();// 同一个用户多次连接同一个room，则需要删除

    @Autowired
    private StunHttpService stunHttpService;
    @Autowired
    private RtcMeetingItemDao rtcMeetingItemDao;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public WebSocketResponse formatMessageRes(String from, String to, String type, Object content){
        WebSocketResponse webSocketResponse = new WebSocketResponse();
        webSocketResponse.setFrom(from);
        webSocketResponse.setTo(to);
        webSocketResponse.setType(type);
        webSocketResponse.setContent(content);
        return webSocketResponse;
    }
    public boolean connectMeetingRoomHandler(String roomIdString, RtcMeetingItem meetingItem, WebSocketUserPrincipal userPrincipal,
                                             Boolean videoBool, Boolean audioBool) {
        MeetingRoom meetingRoom = roomMap.get(roomIdString);
        if (meetingRoom == null) {// room创建
            meetingRoom = new MeetingRoom();// 新建meetingRoom信息
            meetingRoom.setRtcMeetingItem(meetingItem);
        }
        List<MeetingMember> roomMembers = meetingRoom.getMembers();
        Integer emptyIndex = null;
        for (int i = 0; i < roomMembers.size(); i++) {
            MeetingMember meetingMember = roomMembers.get(i);
            if (meetingMember == null) {
                if(emptyIndex == null){
                    emptyIndex = i;
                }
                continue;
            }
            if (meetingMember.getUserPrincipal().getUsername().equals(userPrincipal.getUsername())) { // 重复则替换
                meetingMember.getUserPrincipal().setEnable(false);// 先设置为disable
                deleteQueue.add(meetingMember.getUserPrincipal());

                userPrincipal.setIndex(i);
                meetingMember.setUserPrincipal(userPrincipal);  // 替换新的
                return true;
            }
        }

        if(roomMembers.size() >= meetingRoom.getRtcMeetingItem().getMaxMember()){
            return false;
        }
        MeetingMember member = new MeetingMember(videoBool, audioBool);
        member.setUserPrincipal(userPrincipal);
        if(emptyIndex == null){
            userPrincipal.setIndex(roomMembers.size());
            roomMembers.add(member);
        }else{
            userPrincipal.setIndex(emptyIndex);
            roomMembers.set(emptyIndex, member);
        }
        roomMap.put(roomIdString, meetingRoom);
        return true;
    }
    /**
     * websocket连接处理，携带参数token，roomId，password，还有randomId
     *  1. token校验，room校验
     *  2. 从map中获取对应的room信息，没有则新建
     *  3. room中的用户信息, 没有新建，有则删除替换
     * @param simpMessageHeaderAccessor
     * @param stompHeaderAccessor
     * @return
     */
    public boolean connectHandler(SimpMessageHeaderAccessor simpMessageHeaderAccessor, StompHeaderAccessor stompHeaderAccessor){
        String token = stompHeaderAccessor.getNativeHeader(WebSocketConstants.TOKEN).get(0);
        if (StringUtils.isNotBlank(token)) {
            String userName = JwtUtils.verifyAndGetUsername(token);
            if(StringUtils.isBlank(userName)) {
                throw new RuntimeException();// 这样stomp客户端才能快速收到连接失败消息
            }else{
                String roomIdString = stompHeaderAccessor.getNativeHeader(WebSocketConstants.ROOM_ID).get(0);
                String password = stompHeaderAccessor.getNativeHeader(WebSocketConstants.PASSWORD).get(0);
                String clientId = stompHeaderAccessor.getNativeHeader(WebSocketConstants.CLIENT_ID).get(0);
                Boolean videoBoolean = Boolean.valueOf(stompHeaderAccessor.getNativeHeader(WebSocketConstants.MEDIA_VIDEO).get(0));
                Boolean audioBoolean = Boolean.valueOf(stompHeaderAccessor.getNativeHeader(WebSocketConstants.MEDIA_AUDIO).get(0));
                RtcMeetingItem meetingItem = rtcMeetingItemDao.selectByPrimaryKey(Long.valueOf(roomIdString));
                if (meetingItem.getPassword().equals(password)) {
                    WebSocketUserPrincipal userPrincipal = new WebSocketUserPrincipal();
                    userPrincipal.setUsername(userName);
                    userPrincipal.setName(clientId);// 这里使用客户端随机的id
                    userPrincipal.setRoomId(roomIdString);

                    stompHeaderAccessor.setUser(userPrincipal);
                    simpMessageHeaderAccessor.setUser(userPrincipal);
                    return connectMeetingRoomHandler(roomIdString, meetingItem, userPrincipal, videoBoolean, audioBoolean);
                }else{
                    throw new RuntimeException();// 这样 stomp客户端才会收到连接失败消息
                }
            }
        }
        return false;
    }

    /**
     *  上次 roomMap 中缓存的信息
     * @param stompHeaderAccessor
     * @return
     */
    public void disconnectHandler(StompHeaderAccessor stompHeaderAccessor){
        WebSocketUserPrincipal userPrincipal = (WebSocketUserPrincipal)stompHeaderAccessor.getUser();
        if(userPrincipal == null){
            return;
        }
        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        if (meetingRoom == null) {
            return;
        }
        for (int i = 0; i < meetingRoom.getMembers().size(); i++) {
            MeetingMember member = meetingRoom.getMembers().get(i);
            if ((member != null) && (member.getUserPrincipal().getUserId().equals(userPrincipal.getUserId()) )) {
                meetingRoom.getMembers().set(i, null);
                break;
            }
        }
        // 判断room是不是已经没人了
        boolean emptyRoomFlag = true;
        for (int i = 0; i < meetingRoom.getMembers().size(); i++) {
            MeetingMember member = meetingRoom.getMembers().get(i);
            if(member != null){
                emptyRoomFlag = false;
            }
        }
        if (emptyRoomFlag) {
            roomMap.remove(userPrincipal.getRoomId());
        }

    }
    public void sessionConnectEvent(){
        WebSocketUserPrincipal dstPrincipal = deleteQueue.poll();
        if(dstPrincipal != null){
            Object payload = formatMessageRes(WebSocketConstants.SERVER_ID, dstPrincipal.getUserId(), WebSocketConstants.CMD_CLOSE, dstPrincipal.getUsername());
            simpMessagingTemplate.convertAndSendToUser(dstPrincipal.getName(), WebSocketConstants.USER_CHANNEL, payload);
        }
    }

    public void sessionDisconnectEvent(WebSocketUserPrincipal userPrincipal){
        if (userPrincipal == null) {
            return;
        }
        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        if (meetingRoom == null) {
            return;
        }
        List<MeetingMember> members = meetingRoom.getMembers();
        for (MeetingMember member : members) {
            if(member == null){
                continue;
            }
            WebSocketUserPrincipal dstPrincipal = member.getUserPrincipal();
            MeetingMemberClientRes meetingMemberClientRes = new MeetingMemberClientRes();
            meetingMemberClientRes.setId(userPrincipal.getUserId());
            meetingMemberClientRes.setUsername(userPrincipal.getUsername());
            meetingMemberClientRes.setOnline(false);
            Object payload = formatMessageRes(WebSocketConstants.SERVER_ID, dstPrincipal.getUserId(), WebSocketConstants.CMD_LEAVE, meetingMemberClientRes);
            simpMessagingTemplate.convertAndSendToUser(dstPrincipal.getName(), WebSocketConstants.USER_CHANNEL, payload);
        }

    }
    public void candidateHandler(WebSocketUserPrincipal userPrincipal, WebSocketRequestGenerator<CandidateMessage> request){
//        因为转换的时候只转成map // TODO 这个有空时候研究下（MappingFastJsonMessageConverter）
        log.info("{}", request.getContent());
        CandidateMessage candidateMessage = JSONObject.parseObject(JSONObject.toJSONString(request.getContent()), CandidateMessage.class);
        String[] array = candidateMessage.getCandidate().split("\\s+");
        CandidateBody candidateBody = new CandidateBody(array);
        if (!array[WebSocketConstants.CANDIDATE_PROTOCOL].equalsIgnoreCase(WebSocketConstants.UDP_PROTOCOL)) {
            return;
        }

        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        MeetingMember fromMember=null;
        MeetingMember toMember=null;
        for (MeetingMember member : meetingRoom.getMembers()) {
            if (member.getUserPrincipal().getUserId().equals(request.getFrom())) {
                fromMember = member;
            }else if (member.getUserPrincipal().getUserId().equals(request.getTo())) {
                toMember = member;
            }
        }

        if((fromMember !=null) && (toMember != null)){
            // 接收者中有发送者的candidate ？
            // 没有  -- 存入 --> 发送者有接收者的Candidate 有？
            // 有 --> 分别发送给两个客户端
            CandidateBody candidateBody1 = fromMember.getMap().get(request.getTo());
            if(null == candidateBody1){
                candidateBody1 = candidateBody;
                fromMember.getMap().put(request.getTo(), candidateBody1);
                CandidateBody candidateBody2 = toMember.getMap().get(request.getFrom());
                if(null != candidateBody2){
                    StunData stunData = new StunData();
                    stunData.setIp1(fromMember.getUserPrincipal().getIp());
                    stunData.setPort1(candidateBody2.getPort());
                    stunData.setIp2(toMember.getUserPrincipal().getIp());
                    stunData.setPort2(candidateBody1.getPort());
                    stunData.setUser(meetingRoom.getRtcMeetingItem().getCreateBy());
                    StunData stunDataRes = stunHttpService.post(stunData);
                    // 应答给发送方
                    WebSocketRequestGenerator<CandidateMessage> resFrom = new WebSocketRequestGenerator<>();
                    resFrom.setFrom(request.getTo());
                    resFrom.setTo(request.getFrom());
                    resFrom.setType(WebSocketConstants.CMD_CANDIDATE);
                    CandidateMessage candidateMessageResFrom = new CandidateMessage();
                    BeanUtils.copyProperties(candidateMessage, candidateMessageResFrom);
                    array[WebSocketConstants.CANDIDATE_IP] = stunDataRes.getIp1();
                    array[WebSocketConstants.CANDIDATE_PORT] = stunDataRes.getPort1().toString();
                    array[WebSocketConstants.CANDIDATE_UFRAG_VALUE] = candidateBody2.getUfragValue();
                    String res1 = StringUtils.join(array, " ");
                    candidateMessageResFrom.setCandidate(res1);
                    resFrom.setContent(candidateMessageResFrom);
                    simpMessagingTemplate.convertAndSendToUser(request.getFrom(), WebSocketConstants.USER_CHANNEL, resFrom);
                    // 应答给接收方
                    WebSocketRequestGenerator<CandidateMessage> resTo = new WebSocketRequestGenerator<>();
                    resTo.setFrom(request.getFrom());
                    resTo.setTo(request.getTo());
                    resTo.setType(WebSocketConstants.CMD_CANDIDATE);
                    CandidateMessage candidateMessageResTo = new CandidateMessage();
                    BeanUtils.copyProperties(candidateMessage, candidateMessageResTo);
                    array[WebSocketConstants.CANDIDATE_IP] = stunDataRes.getIp2();
                    array[WebSocketConstants.CANDIDATE_PORT] = stunDataRes.getPort2().toString();
                    array[WebSocketConstants.CANDIDATE_UFRAG_VALUE] = candidateBody1.getUfragValue();
                    String res2 = StringUtils.join(array, " ");
                    candidateMessageResTo.setCandidate(res2);
                    resTo.setContent(candidateMessageResTo);
                    simpMessagingTemplate.convertAndSendToUser(request.getTo(), WebSocketConstants.USER_CHANNEL, resTo);
                }
            }
        }
    }

    public void meetingRoomInfoHandler(WebSocketUserPrincipal userPrincipal){
        // 请求者的信息
        MeetingMemberClientRes userMember = new MeetingMemberClientRes();
        userMember.setId(userPrincipal.getUserId());
        userMember.setUsername(userPrincipal.getUsername());

        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        // 过来数据，只给必须的 -- 重新构建返回数据
        // 如果有多个同名的userName，都会收到消息，客户端收到消息做判断处理
        MeetingRoomClientRes meetingRoomClientRes = new MeetingRoomClientRes();
        meetingRoomClientRes.setRoomId(meetingRoom.getRtcMeetingItem().getId());
        meetingRoomClientRes.setMaxMembers(meetingRoom.getRtcMeetingItem().getMaxMember());
//        meetingRoomClientRes.setSpeaker();
        List<MeetingMember> meetingMemberList = meetingRoom.getMembers();
        for(MeetingMember meetingMember: meetingMemberList){
            if(meetingMember == null){
                continue;
            }
            MeetingMemberClientRes meetingMemberClientRes = new MeetingMemberClientRes();
            meetingMemberClientRes.setId(meetingMember.getUserPrincipal().getUserId());
            meetingMemberClientRes.setUsername(meetingMember.getUserPrincipal().getUsername());
            meetingMemberClientRes.setOnline(meetingMember.getOnline());
            meetingMemberClientRes.setVideo(meetingMember.getVideo());
            meetingMemberClientRes.setAudio(meetingMember.getAudio());
            meetingRoomClientRes.getMembers().add(meetingMemberClientRes);
            // 通知其他小伙伴，有人上线了
            if(userPrincipal != meetingMember.getUserPrincipal()){
                Object payload = formatMessageRes(WebSocketConstants.SERVER_ID, meetingMemberClientRes.getId(), WebSocketConstants.CMD_ENTER, userMember);
                simpMessagingTemplate.convertAndSendToUser(meetingMemberClientRes.getId(), WebSocketConstants.USER_CHANNEL, payload);
            }
        }
        Object payload = formatMessageRes(WebSocketConstants.SERVER_ID, userPrincipal.getUserId(), WebSocketConstants.CURRENT_MEETING, meetingRoomClientRes);
        simpMessagingTemplate.convertAndSendToUser(userPrincipal.getName(), WebSocketConstants.USER_CHANNEL, payload);
    }

    public MeetingRoom getRoomInfo(String id){
        return roomMap.get(id);
    }
}
