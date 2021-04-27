package com.quantil.webrtc.core.utils;

import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/22 14:10
 */
public class ToolUtils {
    /**
     * 得到n分钟前的时间
     * @param minutes
     * @return
     */
    public static Date getBeforeMinTime(int minutes) {
        long currentTime = System.currentTimeMillis() ;
        long targetTime = currentTime - minutes*6000;// 1000*60
        return new Date(targetTime);
    }
}
