package com.quantil.webrtc.core.utils;

import sun.misc.BASE64Encoder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/15 10:51
 */

public class Md5Utils {

    private static final String alg = "MD5";

    private static byte[] hash(byte[] bytes, byte[] salt, int hashIterations) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance(alg);
        if (salt != null) {
            digest.reset();
            digest.update(salt);
        }

        byte[] hashed = digest.digest(bytes);
        int iterations = hashIterations - 1;

        for(int i = 0; i < iterations; ++i) {
            digest.reset();
            hashed = digest.digest(hashed);
        }

        return hashed;
    }

    /**
     *
     * @param raw 原始数据
     * @param salt  盐值
     * @param hashIterations 加密次数
     * @return
     */
    public static String  algorithm(String raw, String salt, int hashIterations){
        try {
            byte[] bytes = hash(raw.getBytes(), salt.getBytes(), hashIterations);
            String baseString = new BASE64Encoder().encode(bytes);
            return baseString;
        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}
