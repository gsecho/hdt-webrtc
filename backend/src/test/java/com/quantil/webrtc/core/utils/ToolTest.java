package com.quantil.webrtc.core.utils;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 11:52
 */
public class ToolTest {

    @Test
    public void cover(){
        ToolUtils.getJarPath();
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("admin,user");
        ToolUtils.getUserRoles(grantedAuthorities);
    }
    @Test
    public void getClientIp(){
        MockHttpServletRequest request = new MockHttpServletRequest();
        String ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "127.0.0.1");
        request.addHeader("X-Real-IP", "192.168.1.2");
        ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "192.168.1.2");
        request.addHeader("HTTP_CLIENT_IP", "192.168.1.3");
        ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "192.168.1.3");
        request.addHeader("WL-Proxy-Client-IP", "192.168.1.4");
        ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "192.168.1.4");
        request.addHeader("Proxy-Client-IP", "192.168.1.5");
        ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "192.168.1.5");
        request.addHeader("X-Forwarded-For", "192.168.1.6");
        ip = ToolUtils.getClientIP(request);
        Assert.assertTrue(ip == "192.168.1.6");
    }
}
