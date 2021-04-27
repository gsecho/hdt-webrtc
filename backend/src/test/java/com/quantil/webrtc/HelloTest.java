package com.quantil.webrtc;

import com.quantil.webrtc.core.utils.Md5Utils;
import org.junit.Test;

import java.util.UUID;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/2/5 15:05
 */
public class HelloTest {

    @Test
    public void helloEcho(){
        System.out.println(UUID.randomUUID().toString());
        String username = "zhangsan";
        String rawString = "123456"; // password
        String saltString = "63cbff35c4aaadff8faa7f8ce32e260";
        int hashIterations = 2;
        String result = Md5Utils.algorithm(rawString, username+":"+saltString, hashIterations);
        System.out.println(result);
    }
}
