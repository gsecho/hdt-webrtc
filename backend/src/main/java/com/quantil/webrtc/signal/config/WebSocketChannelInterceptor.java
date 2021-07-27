package com.quantil.webrtc.signal.config;

import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.signal.MeetingRoomService;
import com.quantil.webrtc.signal.bean.WebSocketUserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.function.Predicate;


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

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompCommand cmd = stompHeaderAccessor.getCommand();
        log.debug("--------- cmd:{}", cmd);
        /**
         * connect的时候会校验token, 其他阶段只判断是否有principal
         */
        if(null == cmd){
            if(stompHeaderAccessor.isHeartbeat()){
                WebSocketUserPrincipal user = (WebSocketUserPrincipal)stompHeaderAccessor.getUser();
                if (user.getEnable()) {// 被禁止的认证，不应答心跳包 -- 是为了处理用户重复连接同一个roomId的问题
                    return message;
                }
            }
        }else if(StompCommand.CONNECT.equals(cmd)){
            if (meetingRoomService.connectHandler(stompHeaderAccessor, stompHeaderAccessor)) {
                return message;
            }
        }else if(StompCommand.DISCONNECT.equals(cmd)){
            meetingRoomService.disconnectHandler(stompHeaderAccessor);
            return message;
        }else{
            Principal principal = stompHeaderAccessor.getUser();
            if (principal != null) {// 已经经过校验
                return message;
            }
        }
        return null;
    }


}
