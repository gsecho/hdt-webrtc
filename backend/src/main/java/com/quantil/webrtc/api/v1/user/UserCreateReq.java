package com.quantil.webrtc.api.v1.user;

import lombok.Data;

import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/18 16:36
 */
@Data
public class UserCreateReq {
    private String username;
    private String password;
    private List<String> roles;
}
