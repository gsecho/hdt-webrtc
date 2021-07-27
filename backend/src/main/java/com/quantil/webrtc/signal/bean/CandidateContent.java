package com.quantil.webrtc.signal.bean;

import lombok.Data;
import org.springframework.stereotype.Component;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/20 14:37
 */
@Data
public class CandidateContent {

    private String MediaType;// audio/video
    private IceCandidate candidate;

}
