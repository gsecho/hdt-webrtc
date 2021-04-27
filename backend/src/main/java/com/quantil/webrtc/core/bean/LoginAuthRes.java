package com.quantil.webrtc.core.bean;

import lombok.Data;

import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/14 16:41
 */
@Data
public class LoginAuthRes {
    private String token;
    private List<String> authority;
}
