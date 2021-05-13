package com.quantil.webrtc.api.v1.meeting.bean;

import lombok.Data;

import java.util.Date;

@Data
public class RtcMeetingItem {
    private Integer id;

    private String password;

    private String subject;

    private String content;

    private Date startTime;

    private Integer durationMin;

    private String adminPassword;

    private Integer maxMember;

    private Integer status;

    private Date createDt;

    private String createBy;

    private Date updateDt;

    private String updateBy;

    private String remark;


}