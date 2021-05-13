package com.quantil.webrtc.signal.bean;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 应答给客户端的数据
 * @author chenrf
 * @version 1.0
 * @date 2021/5/6 11:02
 */
@Data
public class MeetingRoomClientRes {

    private Integer roomId;

    private Integer maxMembers; // 允许最大会议人数
    private String speaker;     // 主讲人
    private List<MeetingMemberClientRes> members; // 当前成员信息

    public MeetingRoomClientRes(){
        members = new ArrayList<>();
    }
}
