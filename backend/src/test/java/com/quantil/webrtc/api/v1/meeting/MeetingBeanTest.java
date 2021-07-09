package com.quantil.webrtc.api.v1.meeting;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingSearchReq;
import com.quantil.webrtc.api.v1.meeting.utils.MeetingConstants;
import org.junit.Test;

import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 15:49
 */
public class MeetingBeanTest {

    @Test
    public void meetingItemCover(){
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        rtcMeetingItem.setId(1L);
        rtcMeetingItem.setPassword("123");
        rtcMeetingItem.setSubject("test");
        rtcMeetingItem.setContent("content");
        rtcMeetingItem.setStartTime(new Date());
        rtcMeetingItem.setDurationMin(5);
        rtcMeetingItem.setAdminPassword("123456");
        rtcMeetingItem.setMaxMember(6);
        rtcMeetingItem.setStatus(0);
        rtcMeetingItem.setCreateBy("test");
        rtcMeetingItem.setCreateDt(new Date());
        rtcMeetingItem.setUpdateBy("test");
        rtcMeetingItem.setUpdateDt(new Date());
    }

    @Test
    public void meetingSearchCover(){
        RtcMeetingSearchReq rtcMeetingSearchReq = new RtcMeetingSearchReq();
        rtcMeetingSearchReq.setPageNum(1);
        rtcMeetingSearchReq.setPageSize(100);
    }


}
