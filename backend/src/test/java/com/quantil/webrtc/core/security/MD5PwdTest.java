package com.quantil.webrtc.core.security;

import com.quantil.webrtc.core.security.auth.MD5PasswordEncoder;
import org.junit.Assert;
import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 15:37
 */
public class MD5PwdTest {

    @Test
    public void match(){
        MD5PasswordEncoder md5PasswordEncoder = new MD5PasswordEncoder();
        String rawPwd = "123";
        String encodePassword = md5PasswordEncoder.encode(rawPwd);
        boolean flag = md5PasswordEncoder.matches(rawPwd, "hellofsdsfdf");
        Assert.assertTrue(!flag);
        flag = md5PasswordEncoder.matches(rawPwd, encodePassword);
        Assert.assertTrue(flag);
    }
}
