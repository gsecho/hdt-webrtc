package com.quantil.webrtc.core.security.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/17 14:03
 */
public class CustomUserDetails extends User {
    private Long userId;

    public CustomUserDetails(String username, String password,
                Collection<? extends GrantedAuthority> authorities) {
        this(username, password, true, true, true, true, authorities);
    }
    public CustomUserDetails(String username, String password, boolean enabled,
                boolean accountNonExpired, boolean credentialsNonExpired,
                boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
