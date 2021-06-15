package com.quantil.webrtc.core.security.auth;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/18 12:41
 */

import com.alibaba.fastjson.JSON;
import com.quantil.webrtc.core.bean.LoginAuthRes;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import org.apache.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 登录成功之后走此类进行鉴权操作
 */
public class CustomAuthorizationFilter extends BasicAuthenticationFilter {
    AntPathRequestMatcher antPathRequestMatcher;

    public CustomAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
        antPathRequestMatcher = new AntPathRequestMatcher("/v*/user/refresh-token");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse resp,
                                    FilterChain chain) throws IOException, ServletException {

        String tokenHeader = req.getHeader(CoreConstants.HEADER_TOKEN);
        // 如果请求头中没有Authorization信息则直接放行了,如果没有权限等下会被拦截的
        if (tokenHeader == null) {
            chain.doFilter(req, resp);
            return;
        }
        // TODO 这里可以改成从redis中获取
        // 每次请求都需要解析，然后转成对应的信息，存入
        UsernamePasswordAuthenticationToken userToken = JwtUtils.verify(tokenHeader);
        if (userToken != null) {
            // 如果请求头中有token，则进行解析，存入上下文
            SecurityContextHolder.getContext().setAuthentication(userToken);
            if (antPathRequestMatcher.matcher(req).isMatch()) {
                // 重新签发token
                CustomUserDetails customUserDetails = (CustomUserDetails)userToken.getPrincipal();
                String token = JwtUtils.createToken(customUserDetails.getUsername(), customUserDetails.getUserId().toString(), ToolUtils.getUserRoles(customUserDetails.getAuthorities()));
                List<String> authority = new ArrayList<>();
                Collection<GrantedAuthority> authorities = userToken.getAuthorities();
                for (GrantedAuthority grantedAuthority : authorities) {
                    authority.add(grantedAuthority.getAuthority());
                }
                LoginAuthRes loginAuthRes = new LoginAuthRes();
                loginAuthRes.setToken(token);
                loginAuthRes.setAuthority(authority);
                resp.setStatus(HttpStatus.SC_OK);
                resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
//                resp.setHeader(); // 也可以放入cookies中
                PrintWriter out = resp.getWriter();
                out.write(JSON.toJSONString(ResponseUtils.formatOkResponse(loginAuthRes)));
                out.flush();
                out.close();
                return;
            }
        }else{
            resp.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return;
        }
        super.doFilterInternal(req, resp, chain);
    }

}
