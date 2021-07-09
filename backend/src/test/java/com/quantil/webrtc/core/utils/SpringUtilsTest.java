package com.quantil.webrtc.core.utils;

import com.quantil.webrtc.WebRtcApp;
import com.quantil.webrtc.api.v1.user.UserController;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/30 11:20
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WebRtcApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SpringUtilsTest {

    @Autowired
    protected ApplicationContext ctx;

    @Test
    public void cover(){
        SpringUtils.setApplicationContext(ctx);
        String beanName = "userController";
        UserController userController = SpringUtils.getBean(UserController.class);
        Assert.assertNotNull(userController);
        UserController userController1 = SpringUtils.getBean(beanName);
        Assert.assertNotNull(userController1);
        SpringUtils.containsBean(beanName);
        SpringUtils.isSingleton(beanName);
        SpringUtils.getType(beanName);
        SpringUtils.getAliases(beanName);
    }
}
