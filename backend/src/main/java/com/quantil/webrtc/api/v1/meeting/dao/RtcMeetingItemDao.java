package com.quantil.webrtc.api.v1.meeting.dao;

import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface RtcMeetingItemDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcMeetingItem record);

    RtcMeetingItem selectByPrimaryKey(Long id);

    List<RtcMeetingItem> selectAll();

    List<RtcMeetingItem> selectByStartTime(RtcMeetingItem record);

    int updateByPrimaryKey(RtcMeetingItem record);
}