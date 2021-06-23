package com.quantil.webrtc.core;

import com.quantil.webrtc.core.security.CustomLogoutSuccessHandler;
import com.quantil.webrtc.core.utils.JwtUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 18:21
 */
public class SecurityTest {

    @Test
    public void customerLogin() {
        CustomLogoutSuccessHandler customLogoutSuccessHandler = new CustomLogoutSuccessHandler();
        String token = JwtUtils.createToken("lihua", "user");
        MockHttpServletRequest mockHttpServletRequest = new MockHttpServletRequest();
        mockHttpServletRequest.addHeader("token", token);
        try {
            customLogoutSuccessHandler.onLogoutSuccess(mockHttpServletRequest,
                new MockHttpServletResponse(),
                new UsernamePasswordAuthenticationToken("lihua", "123456"));
        } catch (Exception e) {
            Assert.assertTrue(false);
        }

    }
}
