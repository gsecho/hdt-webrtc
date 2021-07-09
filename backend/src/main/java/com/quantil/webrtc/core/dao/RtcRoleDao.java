package com.quantil.webrtc.core.dao;

import com.quantil.webrtc.core.bean.db.RtcRole;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface RtcRoleDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcRole record);

    RtcRole selectByPrimaryKey(Long id);

    List<RtcRole> selectAll();

    int updateByPrimaryKey(RtcRole record);
}