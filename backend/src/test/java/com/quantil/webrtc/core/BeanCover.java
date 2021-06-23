package com.quantil.webrtc.core;

import com.quantil.webrtc.core.bean.LoginAuthRes;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.bean.db.RtcRole;
import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.bean.db.RtcUserRole;
import org.junit.Test;

import java.util.Arrays;
import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 17:19
 */
public class BeanCover {

    @Test
    public void responseResult(){
        new ResponseResult(0, "test", null);
        new ResponseResult(0, "test");
    }

    @Test
    public void rtcRole(){
        RtcRole rtcRole = new RtcRole();
        rtcRole.setId(1L);
        rtcRole.setRole("user");
        rtcRole.setDescription("test");
        rtcRole.setStatus(0);
        rtcRole.setCreateBy("test");
        rtcRole.setCreateDt(new Date());
        rtcRole.setUpdateBy("test");
        rtcRole.setUpdateDt(new Date());
        rtcRole.setRemark("remark");
    }

    @Test
    public void rtcUser(){
        RtcUser rtcUser = new RtcUser();
        rtcUser.setId(1L);
        rtcUser.setUsername("lihua");
        rtcUser.setPassword("123456");
        rtcUser.setStatus(0);
        rtcUser.setCreateBy("test");
        rtcUser.setCreateDt(new Date());
        rtcUser.setUpdateBy("test");
        rtcUser.setUpdateDt(new Date());
        rtcUser.setRemark("remark");
    }

    @Test
    public void rtcUserRole(){
        RtcUserRole rtcUserRole = new RtcUserRole();
        rtcUserRole.setId(1L);
        rtcUserRole.setRoleId(1L);
        rtcUserRole.setUserId(1L);
        rtcUserRole.setStatus(0);
        rtcUserRole.setCreateBy("test");
        rtcUserRole.setCreateDt(new Date());
        rtcUserRole.setUpdateBy("test");
        rtcUserRole.setUpdateDt(new Date());
        rtcUserRole.setRemark("remark");
    }

    @Test
    public void loginAuthRes(){
        LoginAuthRes loginAuthRes = new LoginAuthRes();
        loginAuthRes.setToken("token");
        loginAuthRes.setAuthority(Arrays.asList("admin,user".split(",")));
    }

}
