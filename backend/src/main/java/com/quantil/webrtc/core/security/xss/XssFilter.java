package com.quantil.webrtc.core.security.xss;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/19 12:42
 * @see <a>https://www.baeldung.com/spring-prevent-xss</a>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class XssFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 替换原来的方法(getParameter, getHeader)
        XssRequestWrapper xssRequestWrapper =new XssRequestWrapper((HttpServletRequest) servletRequest);
        // 替换body数据
        String body = IOUtils.toString(xssRequestWrapper.getReader());
        if (!StringUtils.isBlank(body)) {
            body = XssUtils.stripXss(body);
            xssRequestWrapper.resetInputStream(body.getBytes());
        }
        filterChain.doFilter(xssRequestWrapper, servletResponse);
    }

}
