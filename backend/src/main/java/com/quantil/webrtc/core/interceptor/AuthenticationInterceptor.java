package com.quantil.webrtc.core.interceptor;

import com.quantil.webrtc.core.annotation.PassToken;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.utils.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 15:02
 */
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {

    @Autowired
    private RtcUserDao rtcUserDao;

    @Value("${filter.url.login}")
    private String loginUrl;

    private final static Logger logger = LoggerFactory.getLogger(AuthenticationInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object object) throws Exception {
        String token = httpServletRequest.getHeader("token");// 从 http 请求头中取出 token
        // 如果不是映射到方法直接通过
        if (!(object instanceof HandlerMethod)) {
            return true;
        }
        HandlerMethod handlerMethod = (HandlerMethod) object;
        Method method = handlerMethod.getMethod();
        //检查是否有Passtoken注释，有则跳过认证
        if (method.isAnnotationPresent(PassToken.class)) {
            PassToken passToken = method.getAnnotation(PassToken.class);
            if (passToken.required()) {
                return true;
            }
        }

        /* 使用token认证 */
        if (token == null) {
//            httpServletRequest.getRequestURL();  // 绝对路径
//            httpServletRequest.getRequestURI();  // 相对路径
            httpServletResponse.sendError(401);
            return false;
        }
        // 验证 token, 获取user id
        String userName = JwtUtils.verify(token);
        if (userName == null) {
            httpServletResponse.sendError(401);
            return false;
        }
        // 传递用户ID到后端
        httpServletRequest.setAttribute(CoreConstants.USER_NAME, userName);
        httpServletRequest.setAttribute(CoreConstants.USER_ID, userName);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest,
                           HttpServletResponse httpServletResponse,
                           Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest,
                                HttpServletResponse httpServletResponse,
                                Object o, Exception e) throws Exception {
    }

}
