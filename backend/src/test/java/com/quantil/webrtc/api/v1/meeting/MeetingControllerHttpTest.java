package com.quantil.webrtc.api.v1.meeting;

import com.quantil.webrtc.core.utils.JwtUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.net.URI;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/17 14:06
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MeetingControllerHttpTest {
    @Autowired
    private MockMvc mockMvc;


    @Test
    public void Redirection302Test() throws Exception{
        URI uri = new URI("/v1/meeting/create");
        this.mockMvc.perform(post(uri))
            .andExpect(status().is3xxRedirection());
    }
    @Test
    public void createItemTest() throws Exception{
        String token = JwtUtils.createToken("test", "user");
        URI uri = new URI("/v1/meeting/client-ip");
        this.mockMvc.perform( get(uri).header("token", token) )
            .andExpect(status().isOk());
    }


}
