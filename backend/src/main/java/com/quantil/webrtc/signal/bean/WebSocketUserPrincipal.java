package com.quantil.webrtc.signal.bean;

import lombok.Data;

import java.security.Principal;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/28 14:21
 */
@Data
public class WebSocketUserPrincipal implements Principal {

    private Integer index;//在list中的序号
    private String name;    // 这个是stomp发送消息要用的name，是唯一的，也就是使用客户端上传的clientId
    private String username; // 这个是数据库(token)的用户名
    private String ip; // 客户端的真实IP
    private Boolean enable;// 表示这个session需要断开
    private String roomId; // disconnect要用

    public WebSocketUserPrincipal(){
        this.enable = true;
    }

    public String getUserId(){
        return name;
    }
}
