package com.quantil.webrtc.signal;

import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.utils.SetterUtils;
import com.quantil.webrtc.signal.bean.WebSocketUserPrincipal;
import com.quantil.webrtc.signal.config.WebSocketChannelInterceptor;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ExecutorSubscribableChannel;
import org.springframework.messaging.support.GenericMessage;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/9 11:52
 */
public class WebSocketChannelInterceptorTest {

    @Test
    public void heartBeat() {
        WebSocketChannelInterceptor webSocketChannelInterceptor = new WebSocketChannelInterceptor();
        RtcMeetingItemDao rtcMeetingItemDao = PowerMockito.mock(RtcMeetingItemDao.class);
        SetterUtils.setter(webSocketChannelInterceptor, rtcMeetingItemDao, "rtcMeetingItemDao");
        MeetingRoomService meetingRoomService = PowerMockito.mock(MeetingRoomService.class);
        SetterUtils.setter(webSocketChannelInterceptor, meetingRoomService, "meetingRoomService");

        ExecutorSubscribableChannel executorSubscribableChannel = new ExecutorSubscribableChannel();
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.createForHeartbeat();
        WebSocketUserPrincipal webSocketUserPrincipal = new WebSocketUserPrincipal();
        stompHeaderAccessor.setUser(webSocketUserPrincipal);
        webSocketUserPrincipal.setEnable(false);
        GenericMessage<String> message = new GenericMessage<String>("payload", stompHeaderAccessor.getMessageHeaders());

        boolean flag = false;
        try{
            webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        }catch (RuntimeException e){
            flag = true;
        }
        Assert.assertTrue(flag);
        webSocketUserPrincipal.setEnable(true);
        Message<?> out = webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        Assert.assertTrue(out == message);
    }

    @Test
    public void connect(){
        WebSocketChannelInterceptor webSocketChannelInterceptor = new WebSocketChannelInterceptor();
        RtcMeetingItemDao rtcMeetingItemDao = PowerMockito.mock(RtcMeetingItemDao.class);
        SetterUtils.setter(webSocketChannelInterceptor, rtcMeetingItemDao, "rtcMeetingItemDao");
        MeetingRoomService meetingRoomService = PowerMockito.mock(MeetingRoomService.class);
        SetterUtils.setter(webSocketChannelInterceptor, meetingRoomService, "meetingRoomService");

        ExecutorSubscribableChannel executorSubscribableChannel = new ExecutorSubscribableChannel();

        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        GenericMessage<String> message = new GenericMessage<String>("payload", stompHeaderAccessor.getMessageHeaders());
        Message<?> out = webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        Assert.assertNull(out);

        PowerMockito.when(meetingRoomService.connectHandler(Mockito.any(), Mockito.any())).thenReturn(true);
        out = webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        Assert.assertTrue(out == message);
    }

    @Test
    public void disconnect() {
        WebSocketChannelInterceptor webSocketChannelInterceptor = new WebSocketChannelInterceptor();
        RtcMeetingItemDao rtcMeetingItemDao = PowerMockito.mock(RtcMeetingItemDao.class);
        SetterUtils.setter(webSocketChannelInterceptor, rtcMeetingItemDao, "rtcMeetingItemDao");
        MeetingRoomService meetingRoomService = PowerMockito.mock(MeetingRoomService.class);
        SetterUtils.setter(webSocketChannelInterceptor, meetingRoomService, "meetingRoomService");

        ExecutorSubscribableChannel executorSubscribableChannel = new ExecutorSubscribableChannel();

        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.create(StompCommand.DISCONNECT);
        GenericMessage<String> message = new GenericMessage<String>("payload", stompHeaderAccessor.getMessageHeaders());
        Message<?> out = webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        Assert.assertTrue(out == message);

    }

    @Test
    public void other() {
        WebSocketChannelInterceptor webSocketChannelInterceptor = new WebSocketChannelInterceptor();
        ExecutorSubscribableChannel executorSubscribableChannel = new ExecutorSubscribableChannel();

        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
        GenericMessage<String> message = new GenericMessage<String>("payload", stompHeaderAccessor.getMessageHeaders());
        Message<?> out = webSocketChannelInterceptor.preSend(message, executorSubscribableChannel);
        Assert.assertNull(out);


        StompHeaderAccessor stompHeaderAccessor1 = StompHeaderAccessor.create(StompCommand.ERROR);
        WebSocketUserPrincipal webSocketUserPrincipal = new WebSocketUserPrincipal();
        stompHeaderAccessor1.setUser(webSocketUserPrincipal);
        GenericMessage<String> message1 = new GenericMessage<String>("payload", stompHeaderAccessor1.getMessageHeaders());
        out = webSocketChannelInterceptor.preSend(message1, executorSubscribableChannel);
        Assert.assertTrue(out == message1);
    }


}
