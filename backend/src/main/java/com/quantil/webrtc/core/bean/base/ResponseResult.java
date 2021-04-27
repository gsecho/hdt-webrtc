package com.quantil.webrtc.core.bean.base;

import lombok.Getter;
import lombok.Setter;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/13 17:12
 */
@Getter
@Setter
public class ResponseResult {
    private Integer code;

    private String message;

    private Object content;

    public ResponseResult(Integer code, String message, Object content) {
        this.code = code;
        this.message = message;
        this.content = content;
    }

    public ResponseResult(Integer code, String message) {
        this.code = code;
        this.message = message;
        this.content = null;
    }
}
