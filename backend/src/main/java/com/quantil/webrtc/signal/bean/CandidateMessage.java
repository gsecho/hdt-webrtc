package com.quantil.webrtc.signal.bean;

import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/10 14:42
 */
@Data
public class CandidateMessage {
    private Integer sdpMLineIndex;
    private String sdpMid;
    private String candidate;
}
