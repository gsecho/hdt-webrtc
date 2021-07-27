package com.quantil.webrtc;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.lang.reflect.Method;
import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/23 17:56
 */
@Slf4j
public class ReflectTest {

    @Test
    public void test(){
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        Date date = new Date();
        try {
            Object para = rtcMeetingItem;
            Class<?> clz= para.getClass();
            Method a = clz.getMethod("setCreateDt", Date.class);
            a.invoke(rtcMeetingItem, date);
            log.info("hello");
        } catch (Exception e) {
            log.error("{}", e);
        }
    }

}
