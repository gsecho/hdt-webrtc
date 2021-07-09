package com.quantil.webrtc.core.constant;

/**
 * 与errorCode.yml是数据一一对应
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 17:24
 */
public class ErrorConstants {
    private ErrorConstants() {
        throw new IllegalStateException("Utility class");
    }

    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
    public static final String MISSING_AUTH_HEADER = "MISSING_AUTH_HEADER";
    public static final String UN_AUTHORIZED = "UN_AUTHORIZED";
    public static final String MISSING_ARGUMENT = "MISSING_ARGUMENT";
    public static final String INVALID_ARGUMENT = "INVALID_ARGUMENT";
    public static final String INVALID_URI = "INVALID_URI";
    public static final String ACCESS_DENIED ="ACCESS_DENIED";


}
