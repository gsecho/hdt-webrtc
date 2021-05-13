package com.quantil.webrtc;

import com.quantil.webrtc.core.utils.Md5Utils;
import com.quantil.webrtc.signal.bean.MeetingMember;
import org.junit.Test;

import java.util.ArrayList;
import java.util.UUID;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/2/5 15:05
 */
public class UserPasswordTest {

    @Test
    public void listTest(){
        ArrayList<MeetingMember> meetingMembers = new ArrayList<>();

        meetingMembers.add(new MeetingMember());
        meetingMembers.add(null);
        meetingMembers.add(new MeetingMember());
        System.out.println("end--");
        for (MeetingMember meetingMember : meetingMembers) {
            System.out.println(meetingMember);
        }
        System.out.println("end--");
        for (int i = 0; i < meetingMembers.size(); i++) {
            System.out.println(meetingMembers.get(i));
        }
        System.out.println("end--");
    }
    @Test
    public void helloEcho(){
        System.out.println(UUID.randomUUID().toString());
        String username = "lisi";
        String rawString = "123456"; // password
        String saltString = "63cbff35c4aaadff8faa7f8ce32e260";
        int hashIterations = 2;
        String result = Md5Utils.algorithm(rawString, username+":"+saltString, hashIterations);
        System.out.println(result);
    }
}
