package com.quantil.webrtc.core.bean;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 过滤器对一下url的处理
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 13:40
 */
@Data
@ConfigurationProperties(prefix = "filter.url")
public class UrlProperties {
    private String excludedPatterns;
    private String login;
//    private String prefix;
}
