package com.quantil.webrtc.core.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.Collection;
import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/22 14:10
 */
@Slf4j
public class ToolUtils {
    private static String UNKNOWN = "unknown";
    private static String LOCAL_HOST = "127.0.0.1";

    public static String getClientIP(HttpServletRequest request) {
        String ip = null;

        //X-Forwarded-For：Squid 服务代理
        String ipAddresses = request.getHeader("X-Forwarded-For");
        if (ipAddresses == null || ipAddresses.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddresses)) {
            //Proxy-Client-IP：apache 服务代理
            ipAddresses = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddresses == null || ipAddresses.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddresses)) {
            //WL-Proxy-Client-IP：weblogic 服务代理
            ipAddresses = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddresses == null || ipAddresses.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddresses)) {
            //HTTP_CLIENT_IP：有些代理服务器
            ipAddresses = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ipAddresses == null || ipAddresses.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddresses)) {
            //X-Real-IP：nginx服务代理
            ipAddresses = request.getHeader("X-Real-IP");
        }

        //有些网络通过多层代理，那么获取到的ip就会有多个，一般都是通过逗号（,）分割开来，并且第一个ip为客户端的真实IP
        if (ipAddresses != null && ipAddresses.length() != 0) {
            ip = ipAddresses.split(",")[0];
        }

        //还是不能获取到，最后再通过request.getRemoteAddr();获取
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ipAddresses)) {
            ip = request.getRemoteAddr();
            if(ip.endsWith("0:0:0:0:0:0:1")){
                ip = LOCAL_HOST;
            }
        }
        return ip;
    }

    public static String getUserRoles(Collection<? extends GrantedAuthority> authorities){
        StringBuilder stringBuilder = new StringBuilder();
        for (GrantedAuthority authority : authorities) {
            if (stringBuilder.length() != 0){
                stringBuilder.append(",");
                stringBuilder.append(authority);
            }else{
                stringBuilder.append(authority);
            }
        }
        return stringBuilder.toString();
    }

    /**
     * 本持续打包成jar后执行，获取当前jar的路径
     * @return
     */
    public static String getJarPath()
    {
        String path = ToolUtils.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        int start =0;
        int end = path.length();
        final String FILE_PREFIX = "file:";
        final String DEBUG_SUFFIX = "target/classes/";
        if(path.startsWith(FILE_PREFIX)){
            start = FILE_PREFIX.length();
        }
        if(path.endsWith(DEBUG_SUFFIX)){
            end = end - DEBUG_SUFFIX.length();
        } else {
            int i = path.indexOf(".jar");
            if(i > -1){
                int j = path.lastIndexOf("/", i);
                if(j > -1){
                    end = j;
                }else{
                    log.error("get jar path error");
                    return null;
                }
            }
        }
        return path.substring(start, end);
    }

}
