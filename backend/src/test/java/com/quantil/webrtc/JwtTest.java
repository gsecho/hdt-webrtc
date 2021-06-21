package com.quantil.webrtc;

import com.quantil.webrtc.core.utils.JwtUtils;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/19 14:58
 */
public class JwtTest {

    @Test
    public void tokenVerify(){
        Integer id = 99;
        String token = JwtUtils.createToken("haha", "user");
        String userId = JwtUtils.verifyAndGetUsername(token);
        Assert.assertNotNull(userId);
    }
}
