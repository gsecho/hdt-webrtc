package com.quantil.webrtc.signal.bean;

import lombok.Data;

/**
 * stomp数据交互泛型结构
 * @author chenrf
 * @version 1.0
 * @date 2021/4/29 15:45
 */
@Data
public class WebSocketResponse {
    private String from;
    private String to;
    private String type;
    private Object content;
}
