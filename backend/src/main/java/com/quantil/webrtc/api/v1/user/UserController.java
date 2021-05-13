package com.quantil.webrtc.api.v1.user;

import com.quantil.webrtc.core.annotation.PassToken;
import com.quantil.webrtc.core.bean.LoginAuthRes;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.exception.RestApiException;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.PasswordHelper;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.core.bean.LoginAuthReq;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;


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
    public ResponseResult login(HttpServletRequest request){
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        // TODO 测试数据
        UserInfo userInfo = new UserInfo();
        userInfo.setId(2654);
        userInfo.setName(userName);
        userInfo.setNickName("Nick");
        ArrayList<String> roles = new ArrayList<>();
        roles.add("admin");
        roles.add("user");
        roles.add("write");
        userInfo.setRoles(roles);
        return ResponseUtils.formatOkResponse(userInfo);
    }

    @PassToken
    @PostMapping("login")
    public ResponseResult login(@RequestBody LoginAuthReq loginAuthReq){
        RtcUser rtcUser = rtcUserDao.selectByUsername(loginAuthReq.getUsername());
        // TODO
        // 频繁操作判断
        if ((rtcUser != null) && (PasswordHelper.doMatch(loginAuthReq, rtcUser))) {
            String token = JwtUtils.createToken(rtcUser.getUsername(), rtcUser.getId().toString());
            LoginAuthRes loginAuthRes = new LoginAuthRes();
            loginAuthRes.setToken(token);
            List<String> authority = new ArrayList<>();
            authority.add("admin");
            authority.add("user");
            loginAuthRes.setAuthority(authority);
            return ResponseUtils.formatOkResponse(loginAuthRes);
        }
        throw new RestApiException("401 UnAuthorized", "failed", 401);
//        return ResponseUtils.formatBadResponse();
    }

    @GetMapping("refresh-token")
    public ResponseResult refreshToken(HttpServletRequest request){
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        String userId = (String)request.getAttribute(CoreConstants.USER_ID);
        String token = JwtUtils.createToken(userName, userId);
        LoginAuthRes loginAuthRes = new LoginAuthRes();
        loginAuthRes.setToken(token);
        List<String> authority = new ArrayList<>();
        authority.add("admin");
        authority.add("user");
        loginAuthRes.setAuthority(authority);
        return ResponseUtils.formatBadResponse(loginAuthRes);
    }

    @PostMapping("logout")
    public ResponseResult logout(){
        // 请求退出的时候，就把token加入黑名单(redis)
        // TODO
        return ResponseUtils.formatOkResponse();
    }

}
