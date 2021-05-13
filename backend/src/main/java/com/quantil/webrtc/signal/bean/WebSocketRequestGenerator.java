package com.quantil.webrtc.signal.bean;

import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/6 10:27
 */
@Data
public class WebSocketRequestGenerator<T> {
    private String from;
    private String to;
    private String type;
    private T content;
}
