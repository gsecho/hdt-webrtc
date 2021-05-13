package com.quantil.webrtc.signal.bean;

import lombok.Data;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/28 18:05
 */
@Data
public class MeetingMember {
    private WebSocketUserPrincipal userPrincipal;
    private Boolean online;
    private Boolean video;
    private Boolean audio;
    private ConcurrentMap<String, CandidateBody> map;// <toID, ufrag>

    public MeetingMember(){
        online = true;
        video = true;
        audio = true;
        map = new ConcurrentHashMap();
    }
}
