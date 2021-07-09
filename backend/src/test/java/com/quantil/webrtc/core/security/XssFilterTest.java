package com.quantil.webrtc.core.security;

import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.security.xss.XssFilter;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;

import static org.mockito.Mockito.doNothing;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 16:33
 */
@Slf4j
@RunWith(PowerMockRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@PrepareForTest({ SecurityUtils.class })
public class XssFilterTest {

    @Test
    public void xxsFilter() throws IOException, ServletException {
        XssFilter xssFilter = new XssFilter();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
//        FilterChain chain = new MockFilterChain();
        MockFilterChain chain = Mockito.mock(MockFilterChain.class);
        doNothing().when(chain).doFilter(Mockito.any(),Mockito.any());

        try {
            xssFilter.doFilter(request, response, chain);
        } catch (Exception e) {
            Assert.assertTrue(false);
        }
        request.setContent("abc".getBytes());
        try {
            xssFilter.doFilter(request, response, chain);
        } catch (Exception e) {
            log.error("{}", e);
            Assert.assertTrue(false);
        }
        Assert.assertTrue(true);
    }
}
