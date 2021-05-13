package com.quantil.webrtc.signal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/7 14:15
 */
@Slf4j
//@Configuration
public class WebSocketSessionEvent {

//    @Autowired
//    private SimpMessagingTemplate simpMessagingTemplate;
//
//    @EventListener
//    public void onConnectEvent(SessionConnectEvent event) {
//        log.info("SessionConnectEvent: --------------");
////        simpMessagingTemplate.convertAndSend("signal", "hello");
//    }
//    @EventListener
//    public void onConnectedEvent(SessionConnectedEvent event) {
//        log.info("SessionConnectedEvent: --------------");
////        simpMessagingTemplate.convertAndSend("/message/signal", "hello");
//    }
//
//    @EventListener
//    public void sessionDisconnectEvent(SessionDisconnectEvent event) {
//        String sessionId=event.getSessionId();
//        log.info("sessionDisconnectEvent: --------------");
//        System.out.println(sessionId);
//    }
//
//
//    @EventListener
//    public void sessionSubscribeEvent(SessionSubscribeEvent event) {
//        log.info("sessionSubscribeEvent: --------------");
//    }
//
//    @EventListener
//    public void sessionUnsubscribeEvent(SessionUnsubscribeEvent event) {
//        log.info("sessionUnsubscribeEvent: --------------");
//    }
}
