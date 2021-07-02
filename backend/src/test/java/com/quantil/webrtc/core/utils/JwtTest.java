package com.quantil.webrtc.core.utils;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/19 14:58
 */
public class JwtTest {

    @Test
    public void tokenVerify(){
        String token = JwtUtils.createToken("haha", "user");
        String userId = JwtUtils.verifyAndGetUsername(token);
        Assert.assertNotNull(userId);
        String errorToken = "test-helloabcdefg";
        userId = JwtUtils.verifyAndGetUsername(errorToken);
        Assert.assertNull(userId);
        UsernamePasswordAuthenticationToken verify = JwtUtils.verify(errorToken);
        Assert.assertNull(verify);
    }

}
