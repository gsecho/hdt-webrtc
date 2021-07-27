package com.quantil.webrtc.signal;

import com.quantil.webrtc.core.exception.RestApiException;
import com.quantil.webrtc.core.utils.SetterUtils;
import com.quantil.webrtc.signal.bean.*;
import org.junit.Test;
import org.powermock.api.mockito.PowerMockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/2 16:17
 */
public class WebSocketControllerTest {

    @Test
    public void test() throws Exception{
        WebSocketController webSocketController = new WebSocketController();
        MeetingRoomService meetingRoomService = PowerMockito.mock(MeetingRoomService.class);
        SetterUtils.setter(webSocketController, meetingRoomService, "meetingRoomService");
        SimpMessagingTemplate simpMessagingTemplate = PowerMockito.mock(SimpMessagingTemplate.class);
        SetterUtils.setter(webSocketController, simpMessagingTemplate, "simpMessagingTemplate");

        webSocketController.hello(new MeetingMember());
        WebSocketUserPrincipal userPrincipal = new WebSocketUserPrincipal();
        WebSocketRequestGenerator<String> stringWebSocketRequestGenerator = new WebSocketRequestGenerator<>();
        stringWebSocketRequestGenerator.setContent("192.168.1.1");
        webSocketController.reqCurrentMeeting(userPrincipal, stringWebSocketRequestGenerator);

        webSocketController.transmitOffer(userPrincipal, new WebSocketRequestGenerator<HashMap>());

        webSocketController.transmitAnswer(userPrincipal, new WebSocketRequestGenerator<String>());

        webSocketController.transmitCandidate(userPrincipal, new WebSocketRequestGenerator<CandidateContent>());

        GenericMessage genericMessage = new GenericMessage("hello");
        SessionDisconnectEvent sessionDisconnectEvent = new SessionDisconnectEvent("test", genericMessage, "sessionId",null, userPrincipal);
        webSocketController.sessionDisconnectEvent(sessionDisconnectEvent);
        webSocketController.onConnectedEvent(new SessionConnectedEvent("test", genericMessage));

        webSocketController.handleException(new RestApiException("rest"));
    }

}
