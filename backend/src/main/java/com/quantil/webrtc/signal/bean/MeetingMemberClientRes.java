package com.quantil.webrtc.signal.bean;

import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/6 11:17
 */
@Data
public class MeetingMemberClientRes {
    private String id;
    private String username;

    private Boolean online;
    private Boolean video;
    private Boolean audio;

    public MeetingMemberClientRes(){
        online = true;
        video = true;
        audio = true;
    }
}
