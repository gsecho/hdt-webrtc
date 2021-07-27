package com.quantil.webrtc.core.bean.base;

import jdk.nashorn.internal.objects.annotations.Constructor;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/20 14:59
 */
@Data
@AllArgsConstructor
public class NameValue {
    private String name;
    private String value;
}
