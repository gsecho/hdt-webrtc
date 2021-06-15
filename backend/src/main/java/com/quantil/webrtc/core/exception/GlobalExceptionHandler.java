package com.quantil.webrtc.core.exception;


import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.constant.ErrorConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

/**
 * 拦截springboot容器是所有异常，进行处理
 * 这里对：RestApiException， Exception做统一处理
 *
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final RestApiException NOT_FOUND_EXCEPTION =
            new RestApiException(ErrorConstants.INVALID_URI);
    private static final RestApiException INTERNAL_ERROR_EXCEPTION =
            new RestApiException(ErrorConstants.INTERNAL_ERROR);

    @ExceptionHandler(value = RestApiException.class)
    public ResponseEntity<ResponseResult> exceptionHandler(RestApiException e) {
        log.error("==============Global Exception ApiException handler:", e);
        return new ResponseEntity<>(e.getErrMsgMap(), HttpStatus.valueOf(e
                .getStatusCode()));
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ResponseResult> defaultErrorHandler(HttpServletRequest req, Exception e) {
        log.error("==============Global Exception default handler:", e);
        if (e instanceof org.springframework.web.servlet.NoHandlerFoundException) {
            return new ResponseEntity<>(NOT_FOUND_EXCEPTION.getErrMsgMap(),
                    HttpStatus.NOT_FOUND);
        } else if (e instanceof org.springframework.web.bind.MethodArgumentNotValidException) {
            org.springframework.web.bind.MethodArgumentNotValidException ee = (org.springframework.web.bind.MethodArgumentNotValidException) e;
            return new ResponseEntity<>(new RestApiException(
                    ErrorConstants.INVALID_ARGUMENT,
                    getErrorMsg(ee)).getErrMsgMap(), HttpStatus.BAD_REQUEST);
        } else if (e instanceof RestApiException) {
            RestApiException ae = (RestApiException) e;
            return new ResponseEntity<>(ae.getErrMsgMap(), HttpStatus.valueOf(ae
                    .getStatusCode()));
        } else {
            return new ResponseEntity<>(INTERNAL_ERROR_EXCEPTION.getErrMsgMap(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getErrorMsg(org.springframework.web.bind.MethodArgumentNotValidException e) {
        StringBuilder errorMessage = new StringBuilder();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errorMessage.append(fieldError.getDefaultMessage());
        }
        return errorMessage.toString();
    }
}
