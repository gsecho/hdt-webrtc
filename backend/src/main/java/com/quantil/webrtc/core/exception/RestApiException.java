package com.quantil.webrtc.core.exception;


import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.utils.ResponseUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.io.ClassPathResource;

import java.util.Properties;


public class RestApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private static final Properties errorProperties;

    static {
        YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
        yaml.setResources(new ClassPathResource("/ErrorCode.yml"));
        errorProperties = yaml.getObject();
    }
    private final Integer statusCode;
    private final String errorCode;
    private final String description;

    public RestApiException(String errorCode) {
        super(errorCode);
        this.errorCode = errorCode;
        this.description = getErrorCodeDesc(this.errorCode);
        this.statusCode = getErrorCodeStatus(this.errorCode);
    }

    public RestApiException(String errorCode, String description) {
        super(errorCode);
        this.errorCode = errorCode;
        this.description = description;
        this.statusCode = getErrorCodeStatus(this.errorCode);
    }

    public RestApiException(String errorCode, String description, Integer statusCode) {
        super(errorCode);
        this.errorCode = errorCode;
        this.description = description;
        this.statusCode = statusCode;
    }

    public ResponseResult getErrMsgMap() {
        return ResponseUtils.formatBadResponse(this.description, null);
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        String s = getClass().getName();
        return (this.description != null) ? (s + " - " + this.errorCode + ": " + this.description) : (s
                + " - " + this.errorCode);
    }

    public static String getErrorCodeDesc(String errorCode) {
        String description = errorProperties.getProperty(errorCode + "[0]");
        if (StringUtils.isNotBlank(description)) {
            return description;
        }
        return "We encountered an internal error. Please try again.";
    }

    public static Integer getErrorCodeStatus(String errorCode) {
        String statusCode = errorProperties.getProperty(errorCode + "[1]");
        if (StringUtils.isNotBlank(statusCode)) {
            return Integer.valueOf(statusCode);
        }
        return 500;
    }
}

