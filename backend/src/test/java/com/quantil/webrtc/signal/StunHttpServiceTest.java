package com.quantil.webrtc.signal;

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.core.utils.SetterUtils;
import com.quantil.webrtc.signal.bean.StunData;
import com.quantil.webrtc.signal.utils.StunHttpService;
import org.junit.Assert;
import org.junit.Test;
import org.powermock.api.mockito.PowerMockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/2 15:34
 */
public class StunHttpServiceTest {

    @Test
    public void stunCover(){
        String url = "http://localhost";
        StunData stunDataRes = new StunData();
        stunDataRes.setIp1("192.168.1.1");
        stunDataRes.setPort1(10001);
        stunDataRes.setIp2("192.168.1.2");
        stunDataRes.setPort2(10002);
        stunDataRes.setUser("test");

        StunData stunDataReq = new StunData();

        ResponseEntity<String> stunDataResponseEntity = new ResponseEntity<>(JSON.toJSONString(stunDataRes), HttpStatus.OK);
        RestTemplate restTemplate = PowerMockito.mock(RestTemplate.class);
        PowerMockito.when(restTemplate.postForEntity(url, stunDataReq, String.class)).thenReturn(stunDataResponseEntity);

        StunHttpService stunHttpService = new StunHttpService();
        SetterUtils.setter(stunHttpService, restTemplate, "restTemplate");
        SetterUtils.setter(stunHttpService, url, "url");
        StunData out = stunHttpService.post(stunDataReq);

        Assert.assertTrue(out.equals(stunDataRes));
    }
}
