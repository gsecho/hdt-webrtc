package com.quantil.webrtc.core.utils;


import com.quantil.webrtc.core.constant.SessionConstants;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


public class SessionUtil {
    private SessionUtil(){
        throw new IllegalStateException("Utility class");
    }
    /**
     * 获取session
     * filter 调用这个的时候RequestContextHolder还没有session数据
     * service层调用RequestContextHolder可以获取到session数据
     * @param request 可以传入null
     * @return
     */
    public static HttpSession getSession(HttpServletRequest request){
        if (request == null) {
            request = ((ServletRequestAttributes)
                           RequestContextHolder.getRequestAttributes()).getRequest();
        }
        return request.getSession();
    }

    public static void setAttribute(HttpServletRequest request, String key, Object value){
        getSession(request).setAttribute(key,value);
    }

    public static Object getAttribute(HttpServletRequest request, String key){
        HttpSession session = SessionUtil.getSession(request);
        return session.getAttribute(key);
    }

    public static void removeAttribute(HttpServletRequest request, String key){
        HttpSession session = SessionUtil.getSession(request);
        session.removeAttribute(key);
    }


    public static <T> T getCurrentUser(HttpServletRequest request){
        return (T) SessionUtil.getAttribute(request, SessionConstants.USER_IN_SESSION);
    }

    public static void removeCurrentUser(HttpServletRequest request){
        SessionUtil.removeAttribute(request, SessionConstants.USER_IN_SESSION);
    }

    public static void setCurrentUser(HttpServletRequest request, Object user){
        SessionUtil.setAttribute(request, SessionConstants.USER_IN_SESSION,user);
    }

}
