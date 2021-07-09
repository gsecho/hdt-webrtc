package com.quantil.webrtc.pages;

import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/7/2 15:31
 */
public class IndexControllerTest {

    @Test
    public void cover(){
        IndexController indexController = new IndexController();
        indexController.rootIndex();
        indexController.pages();
    }
}
