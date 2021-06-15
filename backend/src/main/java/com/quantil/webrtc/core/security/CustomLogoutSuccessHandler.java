package com.quantil.webrtc.core.security;

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * LogoutSuccessHandler的默认调用逻辑在LogoutFilter的doFilter方法（只是判断url）
 * @author chenrf
 * @version 1.0
 * @date 2021/6/9 14:06
 */
@Slf4j
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        String tokenHeader = request.getHeader(CoreConstants.HEADER_TOKEN);
        if (tokenHeader == null) {
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return;
        }

        UsernamePasswordAuthenticationToken userToken = JwtUtils.verify(tokenHeader);
        if (userToken == null) {
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return;
        }

        response.setStatus(HttpStatus.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        PrintWriter out = response.getWriter();
        out.write(JSON.toJSONString(ResponseUtils.formatOkResponse()));
        out.flush();
        out.close();
        log.info("logoutSuccess");
    }
}
