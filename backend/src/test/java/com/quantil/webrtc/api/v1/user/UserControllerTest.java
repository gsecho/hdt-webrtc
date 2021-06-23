package com.quantil.webrtc.api.v1.user;

import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.security.SecurityUtils;
import com.quantil.webrtc.core.security.auth.CustomUserDetails;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.utils.SetterUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collections;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 15:58
 */
@RunWith(PowerMockRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@PrepareForTest({ SecurityUtils.class })
public class UserControllerTest {

    public UserController init(){
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("admin,user");
        CustomUserDetails customUserDetails = new CustomUserDetails("lihua", "123456", grantedAuthorities);

        PowerMockito.mockStatic(SecurityUtils.class);
        PowerMockito.when(SecurityUtils.getPrincipalCustomUserDetails()).thenReturn(customUserDetails);
        RtcUserDao rtcUserDao = PowerMockito.mock(RtcUserDao.class);
        PowerMockito.when(rtcUserDao.selectAll()).thenReturn(Collections.EMPTY_LIST);
        PowerMockito.when(rtcUserDao.deleteByPrimaryKey(1L)).thenReturn(1);

        UserController userController = new UserController();
        SetterUtils.setter(userController, rtcUserDao, "rtcUserDao");
        return userController;
    }

    @Test
    public void login(){
        UserController userController = init();
        ResponseResult result = userController.login();
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void userList(){
        UserController userController = init();
        ResponseResult result = userController.userList(new UserListReq());
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void deleteUser(){
        UserController userController = init();
        ResponseResult result = userController.deleteUser(1L);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

    @Test
    public void createUser(){
        UserController userController = init();
        UserCreateReq userCreateReq = new UserCreateReq();
        userCreateReq.setUsername("lihua");
        userCreateReq.setPassword("123456");
        ResponseResult result = userController.createUser(userCreateReq);
        Assert.assertTrue(result.getCode().equals(ResponseUtils.CODE_SUCCESS));
    }

}
