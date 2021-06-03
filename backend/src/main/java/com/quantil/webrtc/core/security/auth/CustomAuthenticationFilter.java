package com.quantil.webrtc.core.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantil.webrtc.core.constant.CoreConstants;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/17 10:20
 */
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

//    @Override
//    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
//        logger.info("----------CustomAuthenticationFilter-------doFilter---------");
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        super.doFilter(req, res, chain);
//    }

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
                    authRequest = new UsernamePasswordAuthenticationToken(authenticationBean.get(CoreConstants.USER_NAME), authenticationBean.get(CoreConstants.USER_PASSWORD));
                } catch (IOException e) {
                    logger.error("{}", e);
                    authRequest = new UsernamePasswordAuthenticationToken("", "");
                } finally {
                    setDetails(request, authRequest);
                    return this.getAuthenticationManager().authenticate(authRequest);
                }
            }else {
                throw new BadCredentialsException("Invalid Credentials");
            }
        }

    }

}
