package com.quantil.webrtc.core;

import com.quantil.webrtc.core.exception.RestApiException;
import com.quantil.webrtc.core.interceptor.MdcInterceptor;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/2 10:27
 */
public class InterceptorTest {

    @Test
    public void save() throws Exception{
        MdcInterceptor mdcInterceptor = new MdcInterceptor();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        RestApiException restApiException = new RestApiException("test");
        mdcInterceptor.afterCompletion(request, response, request, restApiException);

        Assert.assertTrue(mdcInterceptor.preHandle(request, response, request));
    }
}
