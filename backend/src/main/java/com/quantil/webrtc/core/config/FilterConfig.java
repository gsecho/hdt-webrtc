package com.quantil.webrtc.core.config;

import com.quantil.webrtc.core.bean.UrlProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 通过实例化FilterRegistrationBean来注入多个过滤器
 * 通过order来定义过滤器的顺序（数值越小，优先级越高）
 * 多个过滤器的指定也是先进后出的模式， 比如: before{i} doFilter after{i},以三个为例打印的结果如下
 *  before1 before2 before3 after3 after2 after1
 *  这个和拦截器的效果是一样的
 *
 * @author chenrf
 * @version 1.0
 * @date 2021/4/14 11:22
 */
@Configuration
public class FilterConfig {
    public static final int AUTH_FILTER_ORDER = 1;

    @Autowired
    UrlProperties urlProperties;

    @Bean
    public UrlProperties getUrlProperties(){
        return new UrlProperties();//源码中ConfigurationProperties注解是后置处理，也就是new了以后就会读取配置文件注入
    }

//    @Bean
//    @Order(AUTH_FILTER_ORDER)
//    public FilterRegistrationBean<AuthenticationFilter> loginFilterRegistration(@Autowired Environment env) {
//        FilterRegistrationBean<AuthenticationFilter> registration = new FilterRegistrationBean<>();
//        registration.setFilter(new AuthenticationFilter());
//        List<String> urlPatterns = new ArrayList<>();
//        urlPatterns.add("/*"); // 表示所有的请求都需要这个过滤器处理
//        registration.setUrlPatterns(urlPatterns);
//        registration.addInitParameter(ParamConstants.EXCLUDE_PATTERNS, urlProperties.getExcludedPatterns());
//        registration.addInitParameter(ParamConstants.URL_LOGIN, urlProperties.getLogin());
//        return registration;
//    }

}
