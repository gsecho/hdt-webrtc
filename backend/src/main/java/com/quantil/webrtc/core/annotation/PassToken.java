package com.quantil.webrtc.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 用于为某些url设置跳过认证(需要配合拦截器)，比如 register、user
 * @see <a href="https://www.jianshu.com/p/e88d3f8151db">https://www.jianshu.com/p/e88d3f8151db</a>
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 15:04
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PassToken {
    boolean required() default true;
}
