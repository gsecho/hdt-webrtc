package com.quantil.webrtc.core;

import com.quantil.webrtc.core.exception.GlobalExceptionHandler;
import com.quantil.webrtc.core.exception.RestApiException;
import org.junit.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.messaging.support.ErrorMessage;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.io.IOException;
import java.lang.reflect.Method;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 17:33
 */
public class ExceptionCoverTest {

    @Test
    public void exceptionHandler(){
        RestApiException restApiException = new RestApiException("500");
        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        globalExceptionHandler.exceptionHandler(restApiException);
    }

    @Test
    public void defaultErrorHandler(){

        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        NoHandlerFoundException noHandlerFoundException = new NoHandlerFoundException("test", "http://localhost", new HttpHeaders());
        globalExceptionHandler.defaultErrorHandler(new MockHttpServletRequest(), noHandlerFoundException);

        RestApiException restApiException = new RestApiException("500");
        globalExceptionHandler.defaultErrorHandler(new MockHttpServletRequest(), restApiException);

        IOException ioException = new IOException();
        globalExceptionHandler.defaultErrorHandler(new MockHttpServletRequest(), ioException);

    }

    @Test
    public void restApiException(){
        RestApiException restApiException = new RestApiException("500");
        new RestApiException("500", "description");
        new RestApiException("500", "description", 500);
        restApiException.getStatusCode();
        restApiException.getErrorCode();
        restApiException.getDescription();
        restApiException.toString();
        restApiException.getErrMsgMap();

        restApiException.getErrorCodeDesc("500");
        restApiException.getErrorCodeDesc("30500");
        restApiException.getErrorCodeStatus("500");
        restApiException.getErrorCodeStatus("30500");

    }
}
