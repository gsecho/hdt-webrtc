package com.quantil.webrtc.core.security.auth;

import com.quantil.webrtc.core.bean.db.RtcUser;
import com.quantil.webrtc.core.dao.RtcUserDao;
import com.quantil.webrtc.core.dao.RtcUserRoleDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/13 16:54
 */
@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    RtcUserDao rtcUserDao;
    @Autowired
    RtcUserRoleDao rtcUserRoleDao;

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        // 登陆的时候进来一次
        RtcUser rtcUser = rtcUserDao.selectByUsername(name);
        if (rtcUser == null) {
            throw new UsernameNotFoundException("username or password error!");
        }else{
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            List<String> authorities = rtcUserRoleDao.selectRoleByUserId(rtcUser.getId()); // TODO 和rtcUserDao.selectByUsername合并为一次查询
            if((authorities == null) || authorities.isEmpty()){
                grantedAuthorities.add(new SimpleGrantedAuthority("user"));// TODO 后续需要删除--同时
            }else{
//                List<GrantedAuthority> grantedAuthorities = new ArrayList<>(authorities.size());
                for (String authority : authorities) {
                    grantedAuthorities.add(new SimpleGrantedAuthority(authority));
                }
            }

            CustomUserDetails customUserDetails = new CustomUserDetails(rtcUser.getUsername(), rtcUser.getPassword(), grantedAuthorities);
            customUserDetails.setUserId(rtcUser.getId());
            return customUserDetails;
        }
    }
}
