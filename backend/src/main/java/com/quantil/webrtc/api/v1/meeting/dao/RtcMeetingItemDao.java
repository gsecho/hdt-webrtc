package com.quantil.webrtc.api.v1.meeting.dao;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import java.util.List;

public interface RtcMeetingItemDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcMeetingItem record);

    RtcMeetingItem selectByPrimaryKey(Long id);

    List<RtcMeetingItem> selectAll();

    List<RtcMeetingItem> selectByStartTime(RtcMeetingItem record);

    int updateByPrimaryKey(RtcMeetingItem record);
}