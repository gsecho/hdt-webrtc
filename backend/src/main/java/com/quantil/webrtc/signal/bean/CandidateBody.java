package com.quantil.webrtc.signal.bean;

import com.quantil.webrtc.signal.constants.WebSocketConstants;
import lombok.Data;

/**
 * candidate解析后的数据
 * @author chenrf
 * @version 1.0
 * @date 2021/5/10 16:51
 */
@Data
public class CandidateBody {
    // 目前只关系这三个数据
    private String ip;
    private Integer port;
    private String ufragValue;

    public CandidateBody(String data){
        String[] array = data.split("\\s+");
        this.ip = array[WebSocketConstants.CANDIDATE_IP];
        this.port = Integer.valueOf(array[WebSocketConstants.CANDIDATE_PORT]);
        this.ufragValue = array[WebSocketConstants.CANDIDATE_UFRAG_VALUE];
    }
    public CandidateBody(String[] array){
        this.ip = array[WebSocketConstants.CANDIDATE_IP];
        this.port = Integer.valueOf(array[WebSocketConstants.CANDIDATE_PORT]);
        this.ufragValue = array[WebSocketConstants.CANDIDATE_UFRAG_VALUE];
    }
}
