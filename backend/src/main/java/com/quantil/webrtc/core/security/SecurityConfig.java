package com.quantil.webrtc.core.security;

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.core.bean.LoginAuthRes;
import com.quantil.webrtc.core.security.auth.CustomAuthenticationFilter;
import com.quantil.webrtc.core.security.auth.CustomAuthorizationFilter;
import com.quantil.webrtc.core.security.auth.CustomUserDetails;
import com.quantil.webrtc.core.security.auth.MD5PasswordEncoder;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/13 16:23
 */
@Slf4j
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsService userDetailsService;
    @Autowired
    MD5PasswordEncoder md5PasswordEncoder;

    @Bean
    CustomAuthenticationFilter customAuthenticationFilter() throws Exception {
        CustomAuthenticationFilter filter = new CustomAuthenticationFilter();
        filter.setFilterProcessesUrl("/v1/user/login");
        filter.setAuthenticationSuccessHandler(new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
                // Authentication 实际类型是 UsernamePasswordAuthenticationToken
                CustomUserDetails customUserDetails = (CustomUserDetails)authentication.getPrincipal();
                String token = JwtUtils.createToken(customUserDetails.getUsername(), customUserDetails.getUserId().toString(), ToolUtils.getUserRoles(customUserDetails.getAuthorities()));
                LoginAuthRes loginAuthRes = new LoginAuthRes();
                loginAuthRes.setToken(token);
                List<String> authority = new ArrayList<>();
                Collection<GrantedAuthority> authorities = customUserDetails.getAuthorities();
                for (GrantedAuthority grantedAuthority : authorities) {
                    authority.add(grantedAuthority.getAuthority());
                }
                loginAuthRes.setAuthority(authority);

                resp.setStatus(HttpStatus.SC_OK);
                resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
//                resp.setHeader(); // 也可以放入cookies中
                PrintWriter out = resp.getWriter();
                out.write(JSON.toJSONString(ResponseUtils.formatOkResponse(loginAuthRes)));
                out.flush();
                out.close();
            }
        });

        filter.setAuthenticationFailureHandler(new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException e) throws IOException, ServletException {
                resp.setStatus(HttpStatus.SC_UNAUTHORIZED);
                resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            }
        });
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            // 需要/号打头，不然会被拦截 -- 这里配置或者 web.ignoring().antMatchers方式都可以
            .antMatchers("/","/p/**", "/**.js", "/**.css", "/**.png", "/**.woff2", "/ws").permitAll()
            .anyRequest().authenticated()
            .and()

            // 登陆部分参数
            .formLogin()
            .loginPage("/p/user/login") // 重定向到这个页面
//                .loginProcessingUrl("/v1/user/login")// 这是是登陆post请求的url
            .and()
            // 配置remember， 校验的token保存在headerName，持续时间
//            .rememberMe()
//                .key("token")
//                .tokenValiditySeconds(6400)
//                .rememberMeParameter("remember")
//                .and()
            .addFilter(new CustomAuthorizationFilter(authenticationManager()))
            .addFilterAt(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        ;

        http.csrf().disable();
        // 调整为让 Spring Security 不创建和使用 session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http
            .headers()
            .xssProtection()// 会增加X-XSS-Protection: 1; mode=block这个标签，如果浏览器认为遇到xss攻击会跳转到"#"
            .and()
        // https://developer.mozilla.org/zh-CN/docs/conflicting/Web/HTTP/CSP   CSP介绍
//        .contentSecurityPolicy("script-src 'self'") // （CSP）支持是脚本来源，也就是js来源(比如，不允许代码中嵌入<script>...</script>)
        ;

    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userDetailsService)
            .passwordEncoder(this.md5PasswordEncoder);
    }
}
