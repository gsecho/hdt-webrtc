package com.quantil.webrtc.core.security.xss;

import com.quantil.webrtc.core.constant.CoreConstants;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Slf4j
public class XssRequestWrapper extends HttpServletRequestWrapper {
    private static final String SEC_UA_HEADER = "sec-ch-ua";// chrome 模拟手机的时候发出的这个会解析失败

    private byte[] rawData;
    private HttpServletRequest request;
    private ResettableServletInputStream servletStream;

    public XssRequestWrapper(HttpServletRequest request) {
        super(request);
        this.request = request;
        this.servletStream = new ResettableServletInputStream();
    }

    public void resetInputStream(byte[] newRawData) {
        rawData = newRawData;
        servletStream.stream = new ByteArrayInputStream(newRawData);
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        if (rawData == null) {
            rawData = IOUtils.toByteArray(this.request.getReader(), StandardCharsets.UTF_8);
            servletStream.stream = new ByteArrayInputStream(rawData);
        }
        return servletStream;
    }

    @Override
    public BufferedReader getReader() throws IOException {
        if (rawData == null) {
            rawData = IOUtils.toByteArray(this.request.getReader(), StandardCharsets.UTF_8);
            servletStream.stream = new ByteArrayInputStream(rawData);
        }
        return new BufferedReader(new InputStreamReader(servletStream));
    }

    private class ResettableServletInputStream extends ServletInputStream {

        private InputStream stream;

        @Override
        public int read() throws IOException {
            return stream.read();
        }

        @Override
        public boolean isFinished() {
            return false;
        }

        @Override
        public boolean isReady() {
            return false;
        }

        @Override
        public void setReadListener(ReadListener readListener) {
            // do nothing
        }
    }

    @Override
    public String[] getParameterValues(String parameter) {
        String[] values = super.getParameterValues(parameter);
        if (values == null) {
            return CoreConstants.STRING_ARRAY_EMPTY;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = XssUtils.stripXss(values[i]);
        }
        return encodedValues;
    }

    @Override
    public String getParameter(String parameter) {
        String value = super.getParameter(parameter);
        return XssUtils.stripXss(value);
    }

    @Override
    public String getHeader(String name) {
        String value = super.getHeader(name);
        if(name.equalsIgnoreCase(XssRequestWrapper.SEC_UA_HEADER)){
            return value;
        }else {
            return XssUtils.stripXss(value);
        }
    }

    @Override
    public Enumeration<String> getHeaders(String name) {
        List<String> result = new ArrayList<>();
        Enumeration<String> headers = super.getHeaders(name);
        while (headers.hasMoreElements()) {
            String header = headers.nextElement();
            String[] tokens = header.split(",");
            for (String token : tokens) {
                if(name.equalsIgnoreCase(XssRequestWrapper.SEC_UA_HEADER)){
                    result.add(token);
                }else {
                    result.add(XssUtils.stripXss(token));
                }
            }
        }
        return Collections.enumeration(result);
    }

}
