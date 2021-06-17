package com.quantil.webrtc;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/16 10:20
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
public class AppTest {

    @Test
    public void logTest(){
        log.info("======info=====");

    }
}
