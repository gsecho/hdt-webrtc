package com.quantil.webrtc.core.dao;

import com.quantil.webrtc.core.bean.db.RtcUser;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface RtcUserDao {
    int deleteByPrimaryKey(Long id);

    int insert(RtcUser record);

    RtcUser selectByPrimaryKey(Long id);

    RtcUser selectByUsername(String username);

    List<RtcUser> selectAll();

    int updateByPrimaryKey(RtcUser record);
}