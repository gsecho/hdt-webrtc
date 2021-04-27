package com.quantil.webrtc.api.v1.meeting.bean;

import com.quantil.webrtc.core.bean.db.DbBase;
import lombok.Data;

import java.util.Date;

@Data
public class RtcMeetingItem extends DbBase {

    private Integer id;

    private String password;

    private String subject;

    private String content;

    private Date startTime;

    private Integer durationMin;

    private String adminPassword;

    private Integer maxMember;


}