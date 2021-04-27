package com.quantil.webrtc.api.v1.meeting.dao;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import java.util.List;

public interface RtcMeetingItemDao {
    int deleteByPrimaryKey(Integer id);

    int insert(RtcMeetingItem record);

    RtcMeetingItem selectByPrimaryKey(Integer id);

    List<RtcMeetingItem> selectAll();

    List<RtcMeetingItem> selectByStartTime(RtcMeetingItem record);

    int updateByPrimaryKey(RtcMeetingItem record);
}