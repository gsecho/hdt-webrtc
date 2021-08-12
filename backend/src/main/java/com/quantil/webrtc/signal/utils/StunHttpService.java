package com.quantil.webrtc.signal.utils;

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.signal.bean.StunData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;


@Slf4j
@Service
public class StunHttpService {

    @Value("${rest.stun.url}")
    private String url;

    @Autowired
    private RestTemplate restTemplate;

    public StunData post(StunData data){
        ResponseEntity<String> responseEntity = null;
        try {
            responseEntity = restTemplate.postForEntity(url, data, String.class);
            String abc = responseEntity.getBody();
            return JSON.parseObject(abc, StunData.class);
        } catch (RestClientException e) {
            log.error("StunData:{}", data);
            log.error("{}", e);
            throw e;
        }
    }
}

