package com.quantil.webrtc.api.v1.user;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.security.SecurityUtils;
import com.quantil.webrtc.core.security.auth.CustomUserDetails;
import com.quantil.webrtc.core.security.auth.MD5PasswordEncoder;
import com.quantil.webrtc.core.utils.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;


/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/13 16:17
 */
@Slf4j
@RestController
@RequestMapping(value = "/v1/user")
public class UserController {

    @Autowired
    RtcUserDao rtcUserDao;

    @GetMapping("info")
    public ResponseResult login(){
        CustomUserDetails customUserDetails = SecurityUtils.getPrincipalCustomUserDetails();
        UserInfo userInfo = new UserInfo();
        userInfo.setId(customUserDetails.getUserId());
        userInfo.setName(customUserDetails.getUsername());
        userInfo.setNickName(customUserDetails.getUsername());
//        ArrayList<String> roles = new ArrayList<>();
//        for (GrantedAuthority authority : customUserDetails.getAuthorities()) {
//            roles.add(authority.getAuthority());
//        }
//        userInfo.setRoles(roles);
        return ResponseUtils.formatOkResponse(userInfo);
    }

    @PostMapping("logout")
    public ResponseResult logout(){
        // 请求退出的时候，就把token加入黑名单(redis)
        // TODO
        return ResponseUtils.formatOkResponse();
    }
    @PostMapping("list")
    public ResponseResult userList(@Validated @RequestBody UserListReq req){
        PageHelper.startPage(req.getPageNum(), req.getPageSize());
        PageInfo<RtcMeetingItem>pages = new PageInfo(rtcUserDao.selectAll());

        HashMap<String, Object> map = new HashMap<>();
        map.put("total", pages.getTotal());
        map.put("list", pages.getList());
        return ResponseUtils.formatOkResponse(map);
    }
    @DeleteMapping("{id}")
    public ResponseResult deleteUser(@PathVariable("id") Long id){
        int res = rtcUserDao.deleteByPrimaryKey(id);
        log.info("res:{}", res);
        return ResponseUtils.formatOkResponse();
    }

    @PostMapping("create")
    public ResponseResult createUser(@RequestBody UserCreateReq userCreateReq){
        RtcUser rtcUser = new RtcUser();
        rtcUser.setUsername(userCreateReq.getUsername());
        rtcUser.setSalt(CoreConstants.MD5_SALT);
        MD5PasswordEncoder md5PasswordEncoder = new MD5PasswordEncoder();
        String password = md5PasswordEncoder.encode(userCreateReq.getPassword());
        rtcUser.setPassword(password);
        rtcUser.setStatus(CoreConstants.DB_RECORD_ENABLE);
        int resCode = rtcUserDao.insert(rtcUser);
        log.info("resCode: {}", resCode);
        return ResponseUtils.formatOkResponse();
    }
}
