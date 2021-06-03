package com.quantil.webrtc;

import com.quantil.webrtc.core.utils.SpringUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/2/5 15:11
 */
@SpringBootApplication
public class WebRtcApp {

  public static void main(String[] args) {
    ApplicationContext app = SpringApplication.run(WebRtcApp.class, args);
    SpringUtils.setApplicationContext(app);
  }

}