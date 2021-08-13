package com.quantil.webrtc.signal.config;

import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.signal.MeetingRoomService;
import com.quantil.webrtc.signal.bean.WebSocketUserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.List;


/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/28 10:54
 */
@Slf4j
@Component
public class WebSocketChannelInterceptor implements ChannelInterceptor {

    @Autowired
    RtcMeetingItemDao rtcMeetingItemDao;
    @Autowired
    MeetingRoomService meetingRoomService;

    /**
     * 备注: 使用throw new RuntimeException() 这样stomp客户端才会收到连接失败/断开消息
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompCommand cmd = stompHeaderAccessor.getCommand();
        WebSocketUserPrincipal user = (WebSocketUserPrincipal)stompHeaderAccessor.getUser();
        /**
         * connect的时候会校验token, 其他阶段只判断是否有principal
         */
        if(null == cmd){
            if ((user == null) || (user!=null && !user.getEnable())) {
                log.info("client disable id:{}", user.getUserId());
                throw new RuntimeException("disconnect link");
            }else if(stompHeaderAccessor.isHeartbeat()){
                log.debug("heart beat id:{}", user.getUserId());
                return message;
            }else{
                log.debug("--------- cmd: null ,but not heart beat signal");
            }
        }else{
            if(StompCommand.CONNECT.equals(cmd)){
                if (meetingRoomService.connectHandler(stompHeaderAccessor, stompHeaderAccessor)) {
                    return message;
                }
            }else if(StompCommand.DISCONNECT.equals(cmd)){
                if(user != null){
                    log.debug("--------- cmd:{}, id:{}, enable:{}", cmd, user.getUserId(), user.getEnable());
                    meetingRoomService.disconnectHandler(stompHeaderAccessor);
                }
                return message;
            }else if(StompCommand.SUBSCRIBE.equals(cmd)) {
                if ((user == null) || (user!=null && !user.getEnable())) {
                    log.info("client disable id:{}", user.getUserId());
                    throw new RuntimeException("disconnect link");
                }
                log.debug("--------- cmd:{}, id:{}, enable:{}", cmd, user.getUserId(), user.getEnable());
                return message;
            }else {
                if ((user == null) || (user!=null && !user.getEnable())) {
                    log.info("client disable id:{}", user.getUserId());
                    throw new RuntimeException("disconnect link");
                }else{
                    List<String> dstList = stompHeaderAccessor.toNativeHeaderMap().get("destination");
                    log.info("--------- cmd:{}, id:{}, enable:{}, destination:{}", cmd, user.getUserId(), user.getEnable(), StringUtils.join(dstList, ","));
                    return message;
                }
            }
        }
        return null;
    }

}
