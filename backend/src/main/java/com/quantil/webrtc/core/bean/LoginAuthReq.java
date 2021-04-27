package com.quantil.webrtc.core.bean;

import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/14 16:41
 */
@Data
public class LoginAuthReq {
    private String username;
    private String password;
    private boolean remember;
    private String host;
}
