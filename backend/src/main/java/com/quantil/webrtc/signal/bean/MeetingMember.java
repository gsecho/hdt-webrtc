package com.quantil.webrtc.signal.bean;

import lombok.Data;
import org.apache.xpath.operations.Bool;

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

    public MeetingMember(Boolean videoBool, Boolean audioBool){
        online = true;
        video = videoBool;
        audio = audioBool;
        map = new ConcurrentHashMap();
    }
}
