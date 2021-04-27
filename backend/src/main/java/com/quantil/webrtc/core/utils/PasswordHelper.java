package com.quantil.webrtc.core.utils;

import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.bean.LoginAuthReq;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 12:37
 */
public class PasswordHelper {

    private static final int hashInterations =  2;

    /**
     * 校验信息是否正确
     * @param authData
     * @param rtcUser
     * @return
     */
    public static boolean doMatch(LoginAuthReq authData, RtcUser rtcUser){
        String encryptPassword = Md5Utils.algorithm(
            authData.getPassword(),
            String.format("%s:%s", rtcUser.getUsername(), rtcUser.getSalt()),// 使用'username:salt'作为盐
            hashInterations);
        if (encryptPassword.equals(rtcUser.getPassword())) {
            return true;
        }else {
            return false;
        }
    }

}
