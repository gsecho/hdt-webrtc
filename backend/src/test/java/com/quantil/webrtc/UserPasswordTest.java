package com.quantil.webrtc;

import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.Md5Utils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


/**
 * @author chenrf
 * @version 1.0
 * @date 2021/2/5 15:05
 */
public class UserPasswordTest {

    @Test
    public void shiroMd5RandomSalt(){
        // spring security 的加密PasswordEncoder传入参数有限，所有如果要合并password-salt，然后到里面再解开数据password和salt
        String username = "lisi";
        String rawString = "123456"; // password
        String saltString = CoreConstants.MD5_SALT;
        int hashIterations = 2;
        Md5Utils.algorithm(rawString, username+":"+saltString, hashIterations);
    }

    @Test
    public void springSecurityEncode(){
        String rawString = "hWIga8SNJyWynqCv"; // password
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = bCryptPasswordEncoder.encode(rawString);
        boolean isEqual = bCryptPasswordEncoder.matches(rawString, encodedPassword);
        Assert.assertTrue(isEqual);

    }
}
