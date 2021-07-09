package com.quantil.webrtc.core.bean.db;

import lombok.Data;

@Data
public class RtcUser extends DbBase {
    private Long id;

    private String username;

    private String password;

}