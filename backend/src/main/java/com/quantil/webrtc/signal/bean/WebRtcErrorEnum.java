package com.quantil.webrtc.signal.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializeConfig;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/8/10 16:28
 */
public enum WebRtcErrorEnum {

    AUTH(0, "id or password error"),
    EXCEED_LIMIT(1, "exceed limit"),
    USER_DUPLICATE(2, "user duplicate"),
    ;

    private final int errorCode;
    private final String message;

//    @JSONField(name = "errorCode")
    public int getErrorCode(){
        return errorCode;
    }
//    @JSONField(name = "message")
    public String getMessage(){
        return message;
    }

    WebRtcErrorEnum(int errorCode, String message){
        this.errorCode = errorCode;
        this.message = message;
    }

    @Override
    public String toString(){
        SerializeConfig config = new SerializeConfig();
        config.configEnumAsJavaBean(WebRtcErrorEnum.class);
        return JSON.toJSONString(this, config);
    }

}
