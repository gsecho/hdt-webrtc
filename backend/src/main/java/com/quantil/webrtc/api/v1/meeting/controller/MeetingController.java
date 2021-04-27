package com.quantil.webrtc.api.v1.meeting.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingSearchReq;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.utils.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.UUID;

/**
 * rest api 文档(https://www.restapitutorial.com/lessons/httpmethods.html)
 * @author chenrf
 * @version 1.0
 * @date 2021/4/22 17:00
 */
@Slf4j
@RestController
@RequestMapping(value="/v1/meeting")
public class MeetingController {
    // 因为这个controller基本上没什么数据处理，所以没有再创建service层
    @Autowired
    RtcMeetingItemDao meetingItemDao;

    @PostMapping("/create")
    public ResponseResult createItem(@RequestBody RtcMeetingItem item, HttpServletRequest request){
        item.setPassword(UUID.randomUUID().toString());
        item.setAdminPassword(UUID.randomUUID().toString().substring(0, 8));
        item.setStatus(CoreConstants.DB_RECORD_ENABLE);
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        item.setCreateBy(userName);
        int resCode = meetingItemDao.insert(item);
        log.info("createItem resCode:%d", resCode);
        return ResponseUtils.formatOkResponse();
    }


    @PostMapping("/search")
    public ResponseResult searchList(@Validated @RequestBody RtcMeetingSearchReq searchReq, HttpServletRequest request){
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        searchReq.setCreateBy(userName);
        PageHelper.startPage(searchReq.getPageNum(), searchReq.getPageSize());
        HashMap<String, Object> map = new HashMap<>();
        PageInfo<RtcMeetingItem>pages =  new PageInfo(meetingItemDao.selectByStartTime(searchReq));

        map.put("total", pages.getTotal());
        map.put("list", pages.getList());
        return ResponseUtils.formatOkResponse(map);
    }

    @PostMapping("/update")
    public ResponseResult updateItem(@RequestBody RtcMeetingItem item, HttpServletRequest request){
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        item.setUpdateBy(userName);
        meetingItemDao.updateByPrimaryKey(item);
        return ResponseUtils.formatOkResponse();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseResult updateItem(@PathVariable("id") Integer id, HttpServletRequest request){
        String userName = (String)request.getAttribute(CoreConstants.USER_NAME);
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        rtcMeetingItem.setUpdateBy(userName);
        rtcMeetingItem.setId(id);
        rtcMeetingItem.setStatus(CoreConstants.DB_RECORD_DELETE);
        meetingItemDao.updateByPrimaryKey(rtcMeetingItem);
        return ResponseUtils.formatOkResponse();
    }
}
