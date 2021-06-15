package com.quantil.webrtc.core.bean.db;


import lombok.Data;

@Data
public class RtcRole extends DbBase {
    private Long id;

    private String role;

    private String description;
}