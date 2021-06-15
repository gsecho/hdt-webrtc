package com.quantil.webrtc.signal;

import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.signal.bean.*;
import com.quantil.webrtc.signal.constants.WebSocketConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.util.HashMap;


/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/27 14:38
 */
@Slf4j
@RestController
public class WebSocketController {

    @Autowired
    private RtcMeetingItemDao meetingItemDao;
    @Autowired
    private MeetingRoomService meetingRoomService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping(WebSocketConstants.TEST_CHANNEL) // @MessageMapping 和 @RequestMapping 功能类似，浏览器向服务器发起消息，映射到该地址。
//    @SendTo("/user/hello") // 如果服务器接受到了消息，就会对订阅了 @SendTo 括号中的地址的浏览器发送消息。
    @SendToUser(value = WebSocketConstants.USER_CHANNEL, broadcast = false) //发给自己
    public String hello(MeetingMember message) throws Exception {
//        log.info(message.toString());
//        Thread.sleep(3000);
        return "hello";
    }


    /**
     * 客户端请求room信息(同时附带上自己的客户端ip)
     * @param principal
     */
    @MessageMapping(WebSocketConstants.CURRENT_MEETING)
    public void reqCurrentMeeting(WebSocketUserPrincipal principal, WebSocketRequestGenerator<String> request){
        String ip = request.getContent();
        principal.setIp(ip);
        meetingRoomService.meetingRoomInfoHandler(principal);
    }

    @MessageMapping(WebSocketConstants.CMD_OFFER)
    public void transmitOffer(WebSocketUserPrincipal principal, WebSocketRequestGenerator<HashMap> request){
        // 转发offer请求
        request.setType(WebSocketConstants.CMD_OFFER);
        simpMessagingTemplate.convertAndSendToUser(request.getTo(), WebSocketConstants.USER_CHANNEL, request);
    }
    @MessageMapping(WebSocketConstants.CMD_ANSWER)
    public void transmitAnswer(WebSocketUserPrincipal principal, WebSocketRequestGenerator<String> request){
        // 转发answer请求
        request.setType(WebSocketConstants.CMD_ANSWER);
        simpMessagingTemplate.convertAndSendToUser(request.getTo(), WebSocketConstants.USER_CHANNEL, request);
    }
    @MessageMapping({WebSocketConstants.CMD_CANDIDATE})
    public void transmitCandidate(WebSocketUserPrincipal principal, WebSocketRequestGenerator<CandidateMessage> request){
        // 转发candidate请求
        request.setType(WebSocketConstants.CMD_CANDIDATE);
        simpMessagingTemplate.convertAndSendToUser(request.getTo(), WebSocketConstants.USER_CHANNEL, request);
        // 再次处理内容，是否需要修改
        meetingRoomService.candidateHandler(principal, request);
}

    /**
     * 断开事件
     * @param event
     */
    @EventListener
    public void sessionDisconnectEvent(SessionDisconnectEvent event) {
        WebSocketUserPrincipal principal = (WebSocketUserPrincipal)event.getUser();
        meetingRoomService.sessionDisconnectEvent(principal);
    }
    @EventListener
    public void onConnectedEvent(SessionConnectedEvent event) {
        // StompCommand-connect ---> SessionConnectEvent ---> SessionConnectedEvent
        // 从需要关闭的队列中，发送关闭消息到客户端
        meetingRoomService.sessionConnectEvent();
    }

    /**
     * @MessageMapping 这个注解里面的throw会进入这里
     * @param e
     */
    @MessageExceptionHandler
    public void handleException(Exception e) {
        log.error("{}", e.getMessage());
    }
}
