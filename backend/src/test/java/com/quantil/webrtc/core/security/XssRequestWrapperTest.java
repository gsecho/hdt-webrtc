package com.quantil.webrtc.core.security;

import com.quantil.webrtc.core.security.xss.XssRequestWrapper;
import com.quantil.webrtc.core.security.xss.XssUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import javax.servlet.ServletInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Enumeration;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 17:28
 */
@Slf4j
public class XssRequestWrapperTest {

    @Test
    public void getInput(){
        String data = "abc";
        MockHttpServletRequest request = new MockHttpServletRequest();
        XssRequestWrapper xssRequestWrapper = new XssRequestWrapper(request);
        try {
            ServletInputStream servletInputStream = xssRequestWrapper.getInputStream();
            Assert.assertTrue(servletInputStream.read() == -1);
        } catch (IOException e) {
            Assert.assertTrue(false);
        }
        xssRequestWrapper.resetInputStream(data.getBytes());
        try {
            ServletInputStream servletInputStream = xssRequestWrapper.getInputStream();
            byte[] buf = new byte[50];
            int length = servletInputStream.read(buf);
            Assert.assertTrue(data.equalsIgnoreCase(new String(buf, 0, length)));
        } catch (IOException e) {
            Assert.assertTrue(false);
        }
    }

    @Test
    public void getReader(){
        String data = "abc";
        MockHttpServletRequest request = new MockHttpServletRequest();

        XssRequestWrapper xssRequestWrapper = new XssRequestWrapper(request);
        try {
            BufferedReader reader = xssRequestWrapper.getReader();
            Assert.assertTrue(reader.read() == -1);
        } catch (IOException e) {
            Assert.assertTrue(false);
        }
        xssRequestWrapper.resetInputStream(data.getBytes());
        try {
            BufferedReader reader = xssRequestWrapper.getReader();
            Assert.assertTrue(data.equalsIgnoreCase(reader.readLine()));
        } catch (IOException e) {
            Assert.assertTrue(false);
        }
    }

    @Test
    public void getParam(){
        String paramKey = "test-key";
        String paramValue = "test-value";

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter(paramKey, paramValue);
        XssRequestWrapper xssRequestWrapper = new XssRequestWrapper(request);
        String[] params = xssRequestWrapper.getParameterValues(paramKey);
        Assert.assertTrue((params.length == 1) && params[0].equals(paramValue));

        String value = xssRequestWrapper.getParameter(paramKey);
        Assert.assertTrue(value.equals(paramValue));
    }

    @Test
    public void getHeader(){
        String keyTest = "test-key";
        String valueTest = "test-value";
        String valueTest1 = "test-value-1";

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(keyTest, valueTest);
        XssRequestWrapper xssRequestWrapper = new XssRequestWrapper(request);
        String header = xssRequestWrapper.getHeader(keyTest);
        Assert.assertTrue(header.equalsIgnoreCase(valueTest));

        request.addHeader(keyTest, valueTest1);
        Enumeration<String> headers = xssRequestWrapper.getHeaders(keyTest);
        String s = headers.nextElement();
        Assert.assertTrue(s.equalsIgnoreCase(valueTest));
        String s1 = headers.nextElement();
        Assert.assertTrue(s1.equalsIgnoreCase(valueTest1));

    }

    @Test
    public void stripXss(){
        String s = XssUtils.stripXss(null);
        Assert.assertTrue(s == null);
    }
}
