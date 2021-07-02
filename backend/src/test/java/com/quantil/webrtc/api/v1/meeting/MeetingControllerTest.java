package com.quantil.webrtc.api.v1.meeting;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingSearchReq;
import com.quantil.webrtc.api.v1.meeting.controller.MeetingController;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.security.SecurityUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.signal.MeetingRoomService;
import com.quantil.webrtc.core.utils.SetterUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import java.util.Collections;
import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/17 14:06
 */
@RunWith(PowerMockRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@PrepareForTest({ SecurityUtils.class })
public class MeetingControllerTest {

    public MeetingController init(){
        PowerMockito.mockStatic(SecurityUtils.class);
        PowerMockito.when(SecurityUtils.getPrincipalName()).thenReturn("lihua");

        RtcMeetingItemDao rtcMeetingItemDao = Mockito.mock(RtcMeetingItemDao.class);
        Mockito.when(rtcMeetingItemDao.insert(Mockito.any())).thenReturn(1);
        Mockito.when(rtcMeetingItemDao.updateByPrimaryKey(Mockito.any())).thenReturn(1);
        Mockito.when(rtcMeetingItemDao.selectByStartTime(Mockito.any())).thenReturn(Collections.EMPTY_LIST);
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        rtcMeetingItem.setPassword("123456");
        Mockito.when(rtcMeetingItemDao.selectByPrimaryKey(1L)).thenReturn(null);
        Mockito.when(rtcMeetingItemDao.selectByPrimaryKey(2L)).thenReturn(rtcMeetingItem);
        MeetingController meetingController = new MeetingController();
        SetterUtils.setter(meetingController, rtcMeetingItemDao, "rtcMeetingItemDao");
        MeetingRoomService meetingRoomService = Mockito.mock(MeetingRoomService.class);
        Mockito.when(meetingRoomService.getRoomInfo(Mockito.anyString())).thenReturn(null);
        SetterUtils.setter(meetingController, meetingRoomService, "meetingRoomService");
        return meetingController;
    }

    @Test
    public void createItem(){
        MeetingController meetingController = init();
        RtcMeetingItem item = new RtcMeetingItem();
        item.setSubject("test");
        item.setStartTime(new Date());
        item.setPassword("123456");
        item.setMaxMember(6);
        ResponseResult result = meetingController.createItem(item);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void searchList(){
        MeetingController meetingController = init();
        ResponseResult result = meetingController.searchList(new RtcMeetingSearchReq());
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void deleteItem(){
        MeetingController meetingController = init();
        ResponseResult result = meetingController.deleteItem(1L);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }
    @Test
    public void updateItem(){
        MeetingController meetingController = init();
        ResponseResult result = meetingController.updateItem(new RtcMeetingItem());
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void getClientIp(){
        MeetingController meetingController = init();
        MockHttpServletRequest request = new MockHttpServletRequest();
        String realIp = "192.168.1.1";
        request.addHeader("X-Forwarded-For", realIp);

        ResponseResult result = meetingController.getClientIp(request);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
        String s = (String) result.getContent();
        Assert.assertSame(s, realIp);
    }
    @Test
    public void authenticate(){
        MeetingController meetingController = init();
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        rtcMeetingItem.setPassword("123456");
        rtcMeetingItem.setId(1L);
        ResponseResult result = meetingController.authenticate(rtcMeetingItem);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_FAIL));
        rtcMeetingItem.setId(2L);
        result = meetingController.authenticate(rtcMeetingItem);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
        rtcMeetingItem.setPassword("1234568");
        result = meetingController.authenticate(rtcMeetingItem);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_FAIL));
    }

    @Test
    public void getRoomInfo(){
        MeetingController meetingController = init();
        ResponseResult result = meetingController.getRoomInfo("1");
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

}
