package com.quantil.webrtc.signal.bean;

import com.quantil.webrtc.core.bean.base.NameValue;
import com.quantil.webrtc.signal.constants.WebSocketConstants;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.message.BasicNameValuePair;

import java.util.ArrayList;
import java.util.List;

/**
 * candidate解析后的数据
 * [参考](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidateInit/candidate)
 * (1) "candidate:656808840  1 udp 2122194687 10.8.156.147 59444 typ host generation 0 ufrag oNmN network-id 2 network-cost 10"
 * (2) "candidate:1772480376 1 tcp 1518214911 10.8.156.147 9 typ host tcptype active generation 0 ufrag oNmN network-id 2 network-cost 10"
 * 我们以(2)结构为例分析:
 *  foundation: 1772480376
 *  component:  1 (1:rtp, 2:rtcp)
 *  protocol: tcp
 *  priority: 1518214911
 *  ip: 10.8.156.147
 *  port: 9
 *  接下去的内容都是成对出现的
 *    typ host
 *    tcptype active
 *    generation 0
 *    ufrag oNmN
 *    network-id 2
 *    network-cost 10
 * @author chenrf
 * @version 1.0
 * @date 2021/5/10 16:51
 */
@Data
public class CandidateDetail {
    private final static String PREFIX = "candidate:";
    private String foundation;
    private String component;
    private String protocol;
    private String priority;
    // 目前只关系这三个数据
    private String ip;
    private String port;
    List<NameValue> pairList;

    public CandidateDetail(String data){
        this.pairList = new ArrayList<>();
        String substring = data.substring(PREFIX.length());
        String[] array = substring.split("\\s+");
        this.foundation = array[WebSocketConstants.CANDIDATE_FOUNDATION];
        this.component = array[WebSocketConstants.CANDIDATE_COMPONENT];
        this.protocol  = array[WebSocketConstants.CANDIDATE_PROTOCOL];
        this.priority = array[WebSocketConstants.CANDIDATE_PRIORITY];
        this.ip = array[WebSocketConstants.CANDIDATE_IP];
        this.port = array[WebSocketConstants.CANDIDATE_PORT];
        for (int i = WebSocketConstants.CANDIDATE_PORT+1; i+1 < array.length; i+=2) {
            NameValue nameValue = new NameValue(array[i], array[i + 1]);
            pairList.add(nameValue);
        }
    }

    public void setUfrag(String value){
        pairList.forEach( pair ->{
            if (pair.getName().equals("ufrag")) {
                pair.setValue(value);
            }
        });
    }

    @Override
    public String toString(){
        ArrayList<String> strings = new ArrayList<>();
        strings.add(PREFIX+this.foundation);
        strings.add(this.component);
        strings.add(this.protocol);
        strings.add(this.priority);
        strings.add(this.ip);
        strings.add(this.port);
        this.pairList.forEach( pair ->{
            strings.add(pair.getName());
            strings.add(pair.getValue());
        });
        return StringUtils.join(strings, " ");
    }
}
