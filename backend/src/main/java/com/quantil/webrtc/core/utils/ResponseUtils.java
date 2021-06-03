package com.quantil.webrtc.core.utils;


import com.quantil.webrtc.core.bean.base.ResponseResult;


public class ResponseUtils {

  public static final int CODE_FAIL = -1;
  public static final int CODE_SUCCESS = 0;
  // 其他状态码都会根据实际需要设置

  public static final String CODE_FAIL_MESSAGE = "Failed";
  public static final String CODE_SUCCESS_MESSAGE = "Success";

  public static ResponseResult formatResponse(Integer code, String message, Object content) {
//    if (content != null) {
//      return new ResponseResult(code, message, content);
//    }
    return new ResponseResult(code, message, content);
  }

  /* success */
  public static ResponseResult formatOkResponse() {
    return formatResponse(CODE_SUCCESS, CODE_SUCCESS_MESSAGE, null);
  }

  public static ResponseResult formatOkResponse(String message, Object content) {
    return formatResponse(CODE_SUCCESS, message, content);
  }

  public static ResponseResult formatOkResponse(Object content) {
    return formatResponse(CODE_SUCCESS, CODE_SUCCESS_MESSAGE, content);
  }

  /* bad */
  public static ResponseResult formatBadResponse() {
    return formatResponse(CODE_FAIL, CODE_FAIL_MESSAGE, null);
  }

  public static ResponseResult formatBadResponse(String message, Object content) {
    return formatResponse(CODE_FAIL, message, content);
  }

  public static ResponseResult formatBadResponse(Object content) {
    return formatResponse(CODE_FAIL, CODE_FAIL_MESSAGE, content);
  }
}
