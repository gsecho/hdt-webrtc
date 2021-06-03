package com.quantil.webrtc.core.security;

import com.quantil.webrtc.core.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/21 15:46
 */
public class SecurityUtils {

    public static CustomUserDetails getPrincipalCustomUserDetails(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails)authentication.getPrincipal();
    }

    public static String getPrincipalName(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ((CustomUserDetails)authentication.getPrincipal()).getUsername();
    }
}
