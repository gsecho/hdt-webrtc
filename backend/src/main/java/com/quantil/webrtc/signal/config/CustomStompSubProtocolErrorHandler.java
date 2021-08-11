package com.quantil.webrtc.signal.config;

import org.springframework.lang.Nullable;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/8/10 16:18
 */
public class CustomStompSubProtocolErrorHandler extends StompSubProtocolErrorHandler {
    @Override

    public Message<byte[]> handleClientMessageProcessingError(@Nullable Message<byte[]> clientMessage, Throwable ex) {

        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
//        accessor.setMessage(ex.getMessage());
        accessor.setLeaveMutable(true);

        StompHeaderAccessor clientHeaderAccessor = null;
        if (clientMessage != null) {
            clientHeaderAccessor = MessageHeaderAccessor.getAccessor(clientMessage, StompHeaderAccessor.class);
            if (clientHeaderAccessor != null) {
                String receiptId = clientHeaderAccessor.getReceipt();
                if (receiptId != null) {
                    accessor.setReceiptId(receiptId);
                }
            }
        }

        return handleInternal(accessor, ex.getCause().getMessage().getBytes(), ex, clientHeaderAccessor);
    }
}
