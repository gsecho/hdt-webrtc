package com.quantil.webrtc.core.utils;

import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 11:16
 */
public class ResponseTest {

    @Test
    public void cover(){
        ResponseUtils.formatOkResponse();
        ResponseUtils.formatOkResponse(new String("abc"));
        ResponseUtils.formatOkResponse("abc", new String("abc"));

        ResponseUtils.formatBadResponse();
        ResponseUtils.formatBadResponse(new String("abc"));
        ResponseUtils.formatBadResponse("abc", new String("abc"));

    }
}
