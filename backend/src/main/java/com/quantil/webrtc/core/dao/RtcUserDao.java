package com.quantil.webrtc.core.dao;

import com.quantil.webrtc.core.bean.db.RtcUser;
import java.util.List;

public interface RtcUserDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcUser record);

    RtcUser selectByPrimaryKey(Long id);

    RtcUser selectByUsername(String name);

    List<RtcUser> selectAll();

    int updateByPrimaryKey(RtcUser record);
}