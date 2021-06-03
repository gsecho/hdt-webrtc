package com.quantil.webrtc;

import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.Md5Utils;
import com.quantil.webrtc.signal.bean.MeetingMember;
import org.junit.Test;

import java.util.ArrayList;

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
    public void shiroMd5RandomSalt(){
        String username = "lisi";
        String rawString = "123456"; // password
        String saltString = CoreConstants.MD5_SALT;
        int hashIterations = 2;
        String result = Md5Utils.algorithm(rawString, username+":"+saltString, hashIterations);
        System.out.println(result);
    }

    @Test
    public void springSecurityEncode(){
        String username = "lisi";
        String rawString = "123456"; // password
        String saltString = CoreConstants.MD5_SALT;
        int hashIterations = 2;
        String result = Md5Utils.algorithm(rawString, saltString, hashIterations);
        System.out.println(result);
    }
}
