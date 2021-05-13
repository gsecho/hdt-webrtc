package com.quantil.webrtc.signal.bean;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import lombok.Data;

import java.util.*;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/28 17:47
 */
@Data
public class MeetingRoom {
    private RtcMeetingItem rtcMeetingItem;
    private List<String> admin; // 通过password获取到管理员权限的用户名称
    private String speaker;     // 当前演讲者

    List<MeetingMember> members; // 当前成员信息
    public MeetingRoom(){
        members = new ArrayList<>();
    }
}
