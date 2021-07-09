package com.quantil.webrtc.core.security;

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.security.auth.CustomAuthenticationFilter;
import com.quantil.webrtc.core.security.auth.CustomUserDetails;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 14:04
 */
public class AuthenticationTest {

    public static class NoOpAuthenticationManager implements AuthenticationManager {
        public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {
            return null;
        }
    }
    @Test
    public void attemptAuthentication(){
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        request.setMethod("GET");
        boolean flag = false;
        try {
            customAuthenticationFilter.attemptAuthentication(request, response);
        } catch (AuthenticationException e) {
            if(e.getClass() == AuthenticationServiceException.class){
                flag =  true;
            }
        }
        Assert.assertTrue(flag);
        request.setMethod("POST");
        request.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Map<String, String> map = new HashMap<>();
        map.put(CoreConstants.USER_NAME, "lihua");
        map.put(CoreConstants.USER_PASSWORD, "123");
        String s = JSON.toJSONString(map);
        request.setContent(s.getBytes());

        customAuthenticationFilter.setAuthenticationManager(new NoOpAuthenticationManager());
        Authentication authentication = customAuthenticationFilter.attemptAuthentication(request, response);
        Assert.assertTrue(authentication == null);

        request.setContentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE);
        flag = false;
        try {
            customAuthenticationFilter.attemptAuthentication(request, response);
        } catch (BadCredentialsException e) {
            if(e.getClass() == BadCredentialsException.class){
                flag =  true;
            }
        }
        Assert.assertTrue(flag);
    }

    @Test
    public void authResult(){
        CustomAuthenticationFilter.SuccessHandler successHandler = new CustomAuthenticationFilter.SuccessHandler();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        CustomUserDetails customUserDetails = new CustomUserDetails("lihua", "123",AuthorityUtils.commaSeparatedStringToAuthorityList("admin,user"));
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(customUserDetails, null);
        try {
            successHandler.onAuthenticationSuccess(request, response, token);
        } catch (Exception e) {
            Assert.assertTrue(false);// 失败
        }
        CustomAuthenticationFilter.FailureHandler failureHandler = new CustomAuthenticationFilter.FailureHandler();
        BadCredentialsException exception = new BadCredentialsException("Invalid Credentials");
        try {
            failureHandler.onAuthenticationFailure(request, response, exception);
        } catch (Exception e) {
            Assert.assertTrue(false);// 失败
        }
    }
}
