package com.quantil.webrtc.api.v1.user;

import lombok.Data;

import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/19 11:21
 */
@Data
public class UserInfo {
    private Integer id;
    private String name;
    private String nickName;
    private List<String> roles;
}
