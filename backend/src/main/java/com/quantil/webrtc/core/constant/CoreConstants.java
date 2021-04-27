package com.quantil.webrtc.core.constant;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/14 11:12
 */
public class CoreConstants {

    public static final String URL_PREFIX = "urlPrefix";
    public static final String EXCLUDE_PATTERNS = "excludedPatterns"; // 可以跳过该过滤器的正则表达式
    public static final String URL_LOGIN = "user";
    public static final String DATE_FORMAT = "YYYY-MM-dd HH:mm:ss";

    public static final String USER_NAME = "username"; // token解析后的name存放到attribute中
    public static final Integer DB_RECORD_ENABLE = 0;
    public static final Integer DB_RECORD_DISABLE = 1;
    public static final Integer DB_RECORD_DELETE = 2;
}
