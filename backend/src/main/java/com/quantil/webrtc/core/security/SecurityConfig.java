package com.quantil.webrtc.core.security;

import com.quantil.webrtc.core.security.auth.CustomAuthenticationFilter;
import com.quantil.webrtc.core.security.auth.CustomAuthorizationFilter;
import com.quantil.webrtc.core.security.auth.MD5PasswordEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

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
        filter.setFilterProcessesUrl("/v*/user/login");
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            // 需要/号打头，不然会被拦截 -- 这里配置或者 web.ignoring().antMatchers方式都可以
            .antMatchers("/","/p/**", "/**.js", "/**.css", "/**.png", "/**.woff2", "/ws", "/v*/meeting/client-ip", "/v*/user/test").permitAll()
            .anyRequest().authenticated()
            .and()
            // 登陆部分参数
            .formLogin()
            .loginPage("/p/user/login") // 重定向到这个页面
//                .loginProcessingUrl("/v1/user/login")// 这是是登陆post请求的url
            .and()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/*/user/logout"))
//                .deleteCookies("deleteCookies")
                .logoutSuccessHandler(new CustomLogoutSuccessHandler())

            .and()
            // 配置remember， 校验的token保存在headerName，持续时间
//            .rememberMe()
//                .key("token")
//                .tokenValiditySeconds(6400)
//                .rememberMeParameter("remember")
//                .and()
            .addFilter(new CustomAuthorizationFilter(authenticationManager()))
            .addFilterAt(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            // 定义错误拦截点，比如权限不足的时候可以抛出AuthenticationEntryPoint类型的错误，认证点会返回403给前端
//            .exceptionHandling().authenticationEntryPoint(new Http403ForbiddenEntryPoint()) // 默认 Http403ForbiddenEntryPoint
//        .accessDeniedHandler()
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
            .passwordEncoder(new BCryptPasswordEncoder())
//            .passwordEncoder(this.md5PasswordEncoder)
        ;
    }
}
