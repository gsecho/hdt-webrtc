package com.quantil.webrtc.api.v1.meeting.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingItem;
import com.quantil.webrtc.api.v1.meeting.bean.RtcMeetingSearchReq;
import com.quantil.webrtc.api.v1.meeting.dao.RtcMeetingItemDao;
import com.quantil.webrtc.core.bean.base.ResponseResult;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.security.SecurityUtils;
import com.quantil.webrtc.core.utils.ResponseUtils;
import com.quantil.webrtc.core.utils.ToolUtils;
import com.quantil.webrtc.signal.MeetingRoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
    RtcMeetingItemDao rtcMeetingItemDao;
    @Autowired
    MeetingRoomService meetingRoomService;

    /**
     * 创建会议室
     * @param item
     * @return
     */
    @PostMapping("/create")
    public ResponseResult createItem(@RequestBody RtcMeetingItem item){
        item.setPassword(UUID.randomUUID().toString());
        item.setAdminPassword(UUID.randomUUID().toString().substring(0, 8));
        item.setStatus(CoreConstants.DB_RECORD_ENABLE);
        item.setCreateBy(SecurityUtils.getPrincipalName());
        int resCode = rtcMeetingItemDao.insert(item);
        log.info("createItem resCode:{}", resCode);
        return ResponseUtils.formatOkResponse();
    }

    /**
     * 检索创建的会议
     * @param searchReq
     * @return
     */
    @PostMapping("/search")
    public ResponseResult searchList(@Validated @RequestBody RtcMeetingSearchReq searchReq){
        searchReq.setCreateBy(SecurityUtils.getPrincipalName());
        PageHelper.startPage(searchReq.getPageNum(), searchReq.getPageSize());
        searchReq.setCreateBy(SecurityUtils.getPrincipalName());
        PageInfo<RtcMeetingItem>pages =  new PageInfo(rtcMeetingItemDao.selectByStartTime(searchReq));

        HashMap<String, Object> map = new HashMap<>();
        map.put("total", pages.getTotal());
        map.put("list", pages.getList());
        return ResponseUtils.formatOkResponse(map);
    }

    /**
     * 更新会议室信息
     * @param item
     * @return
     */
    @PostMapping("/update")
    public ResponseResult updateItem(@RequestBody RtcMeetingItem item){
        item.setUpdateBy(SecurityUtils.getPrincipalName());
        rtcMeetingItemDao.updateByPrimaryKey(item);
        return ResponseUtils.formatOkResponse();
    }

    /**
     * 删除已创建的会议
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    public ResponseResult deleteItem(@PathVariable("id") Long id){
        RtcMeetingItem rtcMeetingItem = new RtcMeetingItem();
        rtcMeetingItem.setUpdateBy(SecurityUtils.getPrincipalName());
        rtcMeetingItem.setId(id);
        rtcMeetingItem.setStatus(CoreConstants.DB_RECORD_DELETE);
        rtcMeetingItemDao.updateByPrimaryKey(rtcMeetingItem);
        return ResponseUtils.formatOkResponse();
    }

    /**
     * 前端通过这个接口获取自己的ip信息
     * @param request
     * @return
     */
    @GetMapping("/client-ip")
    public ResponseResult getClientIp(HttpServletRequest request){
        String clientIp = ToolUtils.getClientIP(request);
        return ResponseUtils.formatOkResponse(clientIp);
    }

    /**
     * 确认 roomId和password是否正确
     * @param reqItem
     * @return
     */
    @PostMapping("/authenticate")
    public ResponseResult authenticate(@RequestBody RtcMeetingItem reqItem){
        RtcMeetingItem item = rtcMeetingItemDao.selectByPrimaryKey(reqItem.getId());
        if ((item != null) && (item.getPassword().equals(reqItem.getPassword()))) {
            return ResponseUtils.formatOkResponse();
        }else{
            return ResponseUtils.formatBadResponse();
        }
    }

    @GetMapping("/room-info/{id}")
    public ResponseResult getRoomInfo(@PathVariable("id") String id){
        return ResponseUtils.formatOkResponse(meetingRoomService.getRoomInfo(id));
    }

}
