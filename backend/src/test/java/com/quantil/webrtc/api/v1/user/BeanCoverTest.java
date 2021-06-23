package com.quantil.webrtc.api.v1.user;

import org.junit.Test;

import java.util.Arrays;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 16:44
 */
public class BeanCoverTest {

    @Test
    public void userCreateReq(){
        UserCreateReq userCreateReq = new UserCreateReq();
        userCreateReq.setUsername("lihua");
        userCreateReq.setPassword("123456");
        userCreateReq.setRoles(Arrays.asList("admin,user".split(",")));
    }

    @Test
    public void userInfo(){
        UserInfo userInfo = new UserInfo();
        userInfo.setName("lihua");
        userInfo.setNickName("xiaoli");
        userInfo.setId(1L);
        userInfo.setRoles(Arrays.asList("admin,user".split(",")));
    }

    @Test
    public void userListReq(){
        UserListReq userListReq = new UserListReq();
        userListReq.setPageNum(1);
        userListReq.setPageSize(100);
    }

}
