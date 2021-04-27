package com.quantil.webrtc;

import com.quantil.webrtc.core.utils.JwtUtils;
import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/19 14:58
 */
public class JwtTest {

    @Test
    public void tokenVerify(){
        String token = JwtUtils.createToken("54366");
        System.out.println(token);
        String userId = JwtUtils.verify(token);
        System.out.println(userId);
    }
}
