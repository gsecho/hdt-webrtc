package com.quantil.webrtc.core.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.UUID;

/**
 * @author chenrf
 * @version 1.0
 * @date 2019/11/22 10:44
 */
@Component
public class MdcInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(MdcInterceptor.class);
    private static final String REQUEST_ID = "REQUEST_ID";

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        String uuid = UUID.randomUUID().toString().substring(0, 8);//取8位
        MDC.put(REQUEST_ID, uuid);
        String requestInfo = "API Request Content:  ClientIP {%s}, Header {%s}, Url {%s}, Method {%s}";
        String clientIP = httpServletRequest.getRemoteAddr();
        Enumeration<String> headerNames = httpServletRequest.getHeaderNames();
        StringBuilder headerInfo = new StringBuilder();
        while (headerNames.hasMoreElements()) {
            String element = headerNames.nextElement();
            String header = httpServletRequest.getHeader(element);
            headerInfo.append(element + "=" + header + ", ");
        }
        String uri = httpServletRequest.getRequestURI();
        logger.info(String.format(requestInfo, clientIP, headerInfo.toString(), uri, httpServletRequest.getMethod()));
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        //throw 的时候不会进这里
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
        MDC.remove(REQUEST_ID);
    }
}
