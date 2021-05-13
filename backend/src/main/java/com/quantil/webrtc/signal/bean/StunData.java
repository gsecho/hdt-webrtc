package com.quantil.webrtc.signal.bean;

import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/10 15:44
 */
@Data
public class StunData {
    private String ip1;
    private Integer port1;
    private String ip2;
    private Integer port2;
    private String user;
}
