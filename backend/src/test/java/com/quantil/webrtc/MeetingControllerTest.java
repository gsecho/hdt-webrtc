package com.quantil.webrtc;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.controller.MeetingController;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.security.SecurityUtils;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.SpringUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import com.quantil.webrtc.signal.MeetingRoomService;
import mockit.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.platform.commons.util.StringUtils;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.internal.creation.util.MockitoMethodProxy;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.powermock.modules.junit4.PowerMockRunnerDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.event.annotation.BeforeTestClass;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.lang.reflect.Field;
import java.net.URI;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/17 14:06
 */
@RunWith(PowerMockRunner.class)
//@RunWith(SpringRunner.class)
//@PowerMockRunnerDelegate(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MeetingControllerTest {
//    @Autowired
//    private MockMvc mockMvc;

//    @Autowired
//    @Injectable
//    MeetingController meetingController;
//    @MockBean
//    MeetingRoomService meetingRoomService;
//    @Injectable
//    RtcMeetingItemDao rtcMeetingItemDao;

//    @Test
//    public void Redirection302Test() throws Exception{
//        URI uri = new URI("/v1/meeting/create");
//        this.mockMvc.perform(post(uri))
//            .andExpect(status().is3xxRedirection());
//    }
//    @Test
//    public void createItemTest() throws Exception{
////        JwtUtils.createToken()
//        URI uri = new URI("/v1/meeting/create");
//        this.mockMvc.perform(post(uri))
//            .andExpect(status().is3xxRedirection());
//    }

    // 使用我们的bean替换注入的 bean
    Object initMeetingController(Object mainClass, Object newObj, String fieldName) throws Exception {
        Class<?> clazzRoot = mainClass.getClass();
        Field field = clazzRoot.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(mainClass, newObj);
        return newObj;
    }


    @Test
    @PrepareForTest({ SecurityUtils.class })
    public void deleteItemTest() throws Exception{
        RtcMeetingItemDao rtcMeetingItemDao = Mockito.mock(RtcMeetingItemDao.class);
        Mockito.when(rtcMeetingItemDao.updateByPrimaryKey(Mockito.any())).thenReturn(1);
        PowerMockito.mockStatic(SecurityUtils.class);
        PowerMockito.when(SecurityUtils.getPrincipalName()).thenReturn("12");

        MeetingController meetingController = new MeetingController();
        initMeetingController(meetingController, rtcMeetingItemDao, "rtcMeetingItemDao");
        meetingController.deleteItem(1L);
    }
}
