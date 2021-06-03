package com.quantil.webrtc.core.security.auth;

import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.Md5Utils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/13 17:29
 */
@Component
public class MD5PasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        return Md5Utils.algorithm(rawPassword.toString(), CoreConstants.MD5_SALT, CoreConstants.MD5_HASH_ITERATIONS);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return encodedPassword.equals(this.encode(rawPassword));
    }
}
