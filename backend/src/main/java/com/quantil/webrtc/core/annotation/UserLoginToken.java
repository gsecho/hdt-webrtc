package com.quantil.webrtc.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 必须要用户登陆才可以访问，需要配合拦截器
 * @see <a href="https://www.jianshu.com/p/e88d3f8151db">https://www.jianshu.com/p/e88d3f8151db</a>
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 15:07
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserLoginToken {
    boolean required() default true;
}
