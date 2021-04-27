package com.quantil.webrtc.core.bean.db;

import lombok.Data;

import java.util.Date;

@Data
public class RtcUser {
    private Integer id;

    private String username;

    private String password;

    private String salt;

    private Integer status;

    private Date createDt;

    private Date updateDt;

    private String remark;

}