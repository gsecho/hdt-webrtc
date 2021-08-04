package com.quantil.webrtc.signal;

import com.alibaba.fastjson.JSONObject;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.utils.ToolUtils;
import com.quantil.webrtc.signal.bean.*;
import com.quantil.webrtc.signal.constants.WebSocketConstants;
import com.quantil.webrtc.signal.utils.StunHttpService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ConcurrentMap;

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

    public boolean connectMeetingRoomHandler(String roomIdString, RtcMeetingItem meetingItem, WebSocketUserPrincipal userPrincipal) {
        MeetingRoom meetingRoom = roomMap.get(roomIdString);
        if (meetingRoom == null) {// room创建
            meetingRoom = new MeetingRoom();// 新建meetingRoom信息
            meetingRoom.setRtcMeetingItem(meetingItem);
        }
        List<MeetingMember> roomMembers = meetingRoom.getMembers();
        // id重复
        boolean duplicate = roomMembers.stream().anyMatch( item -> item != null && item.getUserPrincipal().getUserId() == userPrincipal.getUserId());
        if(duplicate){
            log.warn("id duplicate:{}", userPrincipal.getUserId());
            return false;
        }
        // 人数超过限制
        if(roomMembers.size() >= meetingRoom.getRtcMeetingItem().getMaxMember()){
            return false;
        }
        // 查找null的位置
        int emptyIndex = roomMembers.indexOf(null);

        MeetingMember member = new MeetingMember();
        member.setUserPrincipal(userPrincipal);
        if(-1 == emptyIndex){
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
     *  1. 从map中获取对应的room信息，没有则新建
     *  2. room中的用户信息, 没有新建，有则删除替换
     * @param simpMessageHeaderAccessor
     * @param stompHeaderAccessor
     * @return
     */
    public boolean connectHandler(SimpMessageHeaderAccessor simpMessageHeaderAccessor, StompHeaderAccessor stompHeaderAccessor){
        String roomIdString = stompHeaderAccessor.getNativeHeader(WebSocketConstants.ROOM_ID).get(0);
        String password = stompHeaderAccessor.getNativeHeader(WebSocketConstants.PASSWORD).get(0);
        String clientId = stompHeaderAccessor.getNativeHeader(WebSocketConstants.CLIENT_ID).get(0);
        String userName = clientId.split("-")[1];
        RtcMeetingItem meetingItem = rtcMeetingItemDao.selectByPrimaryKey(Long.valueOf(roomIdString));
        if (meetingItem.getPassword().equals(password)) {
            WebSocketUserPrincipal userPrincipal = new WebSocketUserPrincipal();
            userPrincipal.setUsername(userName);
            userPrincipal.setName(clientId);// 这里使用客户端随机的id
            userPrincipal.setRoomId(roomIdString);

            stompHeaderAccessor.setUser(userPrincipal);
            simpMessageHeaderAccessor.setUser(userPrincipal);
            return connectMeetingRoomHandler(roomIdString, meetingItem, userPrincipal);
        }else{
            throw new RuntimeException();// 这样 stomp客户端才会收到连接失败消息
        }
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
        int i = ToolUtils.indexOf(meetingRoom.getMembers(), member -> (member != null) && (member.getUserPrincipal().getUserId().equals(userPrincipal.getUserId())));
        if(i != -1){
            meetingRoom.getMembers().set(i, null);
        }
        // 判断room是不是已经没人了,没人则删除
        boolean b = meetingRoom.getMembers().stream().allMatch(member -> member == null);
        if (b) {
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
    public void mediaStatusHandler(WebSocketUserPrincipal userPrincipal, WebSocketRequestGenerator<JSONObject> request) {
        log.info("{}", request.getContent());
        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        meetingRoom.getMembers().forEach(member->{
            if (userPrincipal == member.getUserPrincipal()) {
                JSONObject object = request.getContent();
                Boolean video = object.getBoolean("video");
                if (video != null) {
                    member.setVideo(video);
                }
                Boolean audio = object.getBoolean("audio");
                if (audio != null) {
                    member.setAudio(audio);
                }
            }
        });
    }
    public void candidateEndHandler(WebSocketUserPrincipal userPrincipal, WebSocketRequestGenerator<CandidateContent> request){
        log.info("{}", request.getContent());
        CandidateContent candidateContent = JSONObject.parseObject(JSONObject.toJSONString(request.getContent()), CandidateContent.class);
        if (candidateContent == null){
            log.error("---error---");
            return;
        }
        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        boolean isAudio = candidateContent.getMediaType().equals("audio");
        MeetingMember fromMember = ToolUtils.findElement(meetingRoom.getMembers(),member -> member.getUserPrincipal().getUserId().equals(request.getFrom()));
        if (fromMember == null) {
            return;
        }

        MeetingMember toMember = ToolUtils.findElement(meetingRoom.getMembers(),member -> member.getUserPrincipal().getUserId().equals(request.getTo()));
        if (toMember == null) {
            return;
        }

        // 请求stun得到代理端口
        StunData stunData = new StunData();
        stunData.setIp1(fromMember.getUserPrincipal().getIp());
        stunData.setPort1(31981);// 不关心端口，随便写的
        stunData.setIp2(toMember.getUserPrincipal().getIp());
        stunData.setPort2(31982);
        stunData.setUser(meetingRoom.getRtcMeetingItem().getCreateBy());
        StunData stunDataRes = stunHttpService.post(stunData);
        /**
         * from 发送的candidate，组装再发出去
         */
        ConcurrentMap<String, CandidateContent> froMap = isAudio ? fromMember.getAudioMap() : fromMember.getVideoMap();
        CandidateContent from2PeerContent = froMap.get(request.getTo());
        CandidateDetail from2PeerCandidateDetail = new CandidateDetail(from2PeerContent.getCandidate().getCandidate());
        from2PeerCandidateDetail.setIp(stunDataRes.getIp1());
        from2PeerCandidateDetail.setPort(stunDataRes.getPort1().toString());
        from2PeerContent.getCandidate().setCandidate(from2PeerCandidateDetail.toString());
        Object payload1 = formatMessageRes(request.getFrom(), request.getTo(), WebSocketConstants.CMD_CANDIDATE, from2PeerContent);
        simpMessagingTemplate.convertAndSendToUser(request.getTo(), WebSocketConstants.USER_CHANNEL, payload1);
        froMap.remove(request.getTo());
        /**
         * to 发送的candidate，组装再发出去
         */
        ConcurrentMap<String, CandidateContent> toMap = isAudio ? toMember.getAudioMap() : toMember.getVideoMap();
        CandidateContent to2PeerContent =  toMap.get(request.getFrom());
        CandidateDetail to2PeerCandidateDetail = new CandidateDetail(to2PeerContent.getCandidate().getCandidate());
        to2PeerCandidateDetail.setIp(stunDataRes.getIp2());
        to2PeerCandidateDetail.setPort(stunDataRes.getPort2().toString());
        to2PeerContent.getCandidate().setCandidate(to2PeerCandidateDetail.toString());
        Object payload2 = formatMessageRes(request.getTo(), request.getFrom(), WebSocketConstants.CMD_CANDIDATE, to2PeerContent);
        simpMessagingTemplate.convertAndSendToUser(request.getFrom(), WebSocketConstants.USER_CHANNEL, payload2);
        toMap.remove(request.getFrom());
    }

    public void candidateHandler(WebSocketUserPrincipal userPrincipal, WebSocketRequestGenerator<CandidateContent> request){
//        因为转换的时候只转成map // TODO 这个有空时候研究下（MappingFastJsonMessageConverter）
        log.info("{}", request.getContent());
        CandidateContent candidateContent = JSONObject.parseObject(JSONObject.toJSONString(request.getContent()), CandidateContent.class);
        if (candidateContent == null){
            log.error("---error---");
            return;
        }
        boolean isAudio = candidateContent.getMediaType().equals("audio");
        CandidateDetail myCandidateDetail = new CandidateDetail(candidateContent.getCandidate().getCandidate());
        if (!myCandidateDetail.getProtocol().equals(WebSocketConstants.UDP_PROTOCOL)) {
            return;
        }

        MeetingRoom meetingRoom = roomMap.get(userPrincipal.getRoomId());
        MeetingMember fromMember = ToolUtils.findElement(meetingRoom.getMembers(),member -> member.getUserPrincipal().getUserId().equals(request.getFrom()));
        if (fromMember == null) {
            return;
        }
        // audio or video map
        ConcurrentMap<String, CandidateContent> map = isAudio ? fromMember.getAudioMap() : fromMember.getVideoMap();
        CandidateContent content =  map.get(request.getTo());

        if(content == null) {
            map.put(request.getTo(), candidateContent);// 只有首次才存储
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
