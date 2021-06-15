package com.quantil.webrtc.core.security.auth;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantil.webrtc.core.bean.LoginAuthRes;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.JwtUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import org.apache.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/17 10:20
 */
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    public CustomAuthenticationFilter(){
        setAuthenticationSuccessHandler(new AuthenticationSuccessHandler() {
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

        setAuthenticationFailureHandler(new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException e) throws IOException, ServletException {
                resp.setStatus(HttpStatus.SC_UNAUTHORIZED);
                resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            }
        });
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }else {
            MediaType mediaType = MediaType.parseMediaType(request.getContentType());
            if (MediaType.APPLICATION_JSON.includes(mediaType)) {
                ObjectMapper mapper = new ObjectMapper();
                UsernamePasswordAuthenticationToken authRequest = null;
                try (InputStream is = request.getInputStream()) {
                    Map<String,String> authenticationBean = mapper.readValue(is, Map.class);
                    String userName = authenticationBean.get(CoreConstants.USER_NAME);
                    String userPassword = authenticationBean.get(CoreConstants.USER_PASSWORD);
                    authRequest = new UsernamePasswordAuthenticationToken(userName, userPassword);
                } catch (IOException e) {
                    logger.error("{}", e);
                    authRequest = new UsernamePasswordAuthenticationToken("", "");
                }
//                finally {
//
//                }
                setDetails(request, authRequest);
                return this.getAuthenticationManager().authenticate(authRequest);
            }else {
                throw new BadCredentialsException("Invalid Credentials");
            }
        }

    }

}
