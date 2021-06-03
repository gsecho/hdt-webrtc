package com.quantil.webrtc.core.dao;

import com.quantil.webrtc.core.bean.db.RtcUserRole;
import java.util.List;

public interface RtcUserRoleDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcUserRole record);

    RtcUserRole selectByPrimaryKey(Long id);

    List<String> selectRoleByUserId(Long id);

    List<RtcUserRole> selectAll();

    int updateByPrimaryKey(RtcUserRole record);
}