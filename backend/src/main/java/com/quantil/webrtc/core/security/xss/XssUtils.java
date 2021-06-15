package com.quantil.webrtc.core.security.xss;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.owasp.esapi.ESAPI;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/19 14:44
 */
@Slf4j
public class XssUtils {

    public static String stripXss(String value) {
        if (value == null) {
            return null;
        }
        value = ESAPI.encoder()
                    .canonicalize(value)
                    .replaceAll("\0", "");
        return Jsoup.clean(value, Whitelist.none());
    }

}
