package com.quantil.webrtc.core.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.quantil.webrtc.core.bean.db.RtcUser;

import java.util.Calendar;
import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 14:55
 */
public class JwtUtils {
    private static final int expireMin = 30;
    private static final String secret = "pe9229d2-f04b-266e-8f87-b0c89e7ek941";// 服务器私钥

    /**
     签发对象：这个用户的id
     签发时间：现在
     有效时间：n分钟
     载荷内容：暂时null
     加密密钥：这个人的id加上一串字符串
     */
    public static String createToken(String userName) {

        Calendar nowTime = Calendar.getInstance();
        nowTime.add(Calendar.MINUTE, expireMin);
        Date expiresDate = nowTime.getTime();

        // withAudience 是需要存入token的数据，可以多个，比如用户id，用户名...
        // claim 载荷，这个是用来写自定义k-v数据
        return JWT.create().withAudience(userName)//签发对象
                   .withIssuedAt(new Date())    //发行时间
                   .withExpiresAt(expiresDate)  //截止时间
//                   .withClaim("Username", rtcUser.getUsername())
                   .sign(Algorithm.HMAC256(secret));   //签名和加密
    }

    public static String verify(String token){
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(secret)).build();
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(token);
            return decodedJWT.getAudience().get(0);
        } catch (Exception e) {
            return null;
        }
    }

}

