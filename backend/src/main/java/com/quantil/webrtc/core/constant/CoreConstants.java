package com.quantil.webrtc.core.constant;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/14 11:12
 */
public class CoreConstants {
    private CoreConstants() {
        throw new IllegalStateException("Utility class");
    }
    public static final String HEADER_TOKEN = "token";
    public static final String TOKEN_USER_ID = "id";
    public static final String TOKEN_AUTHORITIES = "authorities";

    public static final String MD5_SALT = "63cbff35c4aaadff8faa7f8ce32e260";
    public static final Integer MD5_HASH_ITERATIONS = 2;

    public static final String URL_PREFIX = "urlPrefix";
    public static final String EXCLUDE_PATTERNS = "excludedPatterns"; // 可以跳过该过滤器的正则表达式
    public static final String URL_LOGIN = "user";
    public static final String DATE_FORMAT = "YYYY-MM-dd HH:mm:ss";

    public static final String USER_NAME = "username";
    public static final String USER_PASSWORD = "password";
    public static final Integer DB_RECORD_ENABLE = 0;
    public static final Integer DB_RECORD_DISABLE = 1;
    public static final Integer DB_RECORD_DELETE = 2;

    public static final String[] STRING_ARRAY_EMPTY= new String[0];

}
