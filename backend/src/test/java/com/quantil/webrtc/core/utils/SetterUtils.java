package com.quantil.webrtc.core.utils;

import org.junit.Assert;

import java.lang.reflect.Field;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 15:59
 */

public class SetterUtils {

    // 使用我们的bean替换注入的 bean
    public static final Object setter(Object mainObj, Object fieldObj, String fieldName) {
        try {
            Class<?> clazzRoot = mainObj.getClass();
            Field field = clazzRoot.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(mainObj, fieldObj);
        } catch (Exception e) {
            Assert.assertTrue(false);// 错误停止
        }
        return fieldObj;
    }
}
