package com.quantil.webrtc.core.security;

import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.dao.RtcUserRoleDao;
import com.quantil.webrtc.core.security.auth.UserDetailsServiceImpl;
import com.quantil.webrtc.core.utils.SetterUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 15:50
 */
@RunWith(PowerMockRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@PrepareForTest({ SecurityUtils.class })
public class UserDetailsServiceTest {

    @Test
    public void load(){
        UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl();
        // 数据库查不到
        RtcUserDao rtcUserDao = Mockito.mock(RtcUserDao.class);
        Mockito.when(rtcUserDao.selectByUsername(Mockito.any())).thenReturn(null);
        SetterUtils.setter(userDetailsService, rtcUserDao, "rtcUserDao");
        try {
            userDetailsService.loadUserByUsername("lihua");
        } catch (UsernameNotFoundException e) {
            if(e.getClass() != UsernameNotFoundException.class){
                Assert.assertTrue(false);
            }
        }
        // 查到了并且有角色信息
        Long id = 3L;
        RtcUser rtcUser = new RtcUser();
        rtcUser.setId(id);
        rtcUser.setUsername("lihua");
        rtcUser.setPassword("123");
        Mockito.when(rtcUserDao.selectByUsername(Mockito.any())).thenReturn(rtcUser);
        SetterUtils.setter(userDetailsService, rtcUserDao, "rtcUserDao");

        RtcUserRoleDao rtcUserRoleDao = Mockito.mock(RtcUserRoleDao.class);
        List<String> roles = new ArrayList<>();
        roles.add("admin");
        roles.add("roles");
        Mockito.when(rtcUserRoleDao.selectRoleByUserId(id)).thenReturn(roles);
        SetterUtils.setter(userDetailsService, rtcUserRoleDao, "rtcUserRoleDao");

        UserDetails userDetails = userDetailsService.loadUserByUsername("lihua");
        Assert.assertTrue(userDetails.getAuthorities().size() == 2);

        // 查到了，但数据库没有角色信息,使用默认是角色信息
        Mockito.when(rtcUserRoleDao.selectRoleByUserId(id)).thenReturn(null);
        SetterUtils.setter(userDetailsService, rtcUserRoleDao, "rtcUserRoleDao");
        userDetails = userDetailsService.loadUserByUsername("lihua");
        Assert.assertTrue(userDetails.getAuthorities().size() == 1);
    }
}
