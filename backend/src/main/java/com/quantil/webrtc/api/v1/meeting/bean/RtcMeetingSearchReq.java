package com.quantil.webrtc.api.v1.meeting.bean;

import com.quantil.webrtc.api.v1.meeting.utils.MeetingConstants;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/25 13:40
 */
@Data
public class RtcMeetingSearchReq extends RtcMeetingItem{

//    @Max(value=1, message = "Invalid parameter")
    @Min(value=1)
    private Integer pageNum; // 页码从1开始
    @Min(value=10)
    @Max(value=100)
    private Integer pageSize;


    public RtcMeetingSearchReq(){
        pageNum = MeetingConstants.PAGE_NUM_DEFAULT;
        pageSize =  MeetingConstants.PAGE_SIZE_DEFAULT;

    }
}
