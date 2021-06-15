package com.quantil.webrtc.core.bean.db;

import lombok.Data;

@Data
public class RtcUserRole extends DbBase {
    private Long id;

    private Long userId;

    private Long roleId;

}