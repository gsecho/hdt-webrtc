package com.quantil.webrtc.api.v1.user;

import com.quantil.webrtc.api.v1.meeting.utils.MeetingConstants;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/5/17 16:05
 */
@Setter
@Getter
public class UserListReq {

    @Min(value=1)
    private Integer pageNum; // 页码从1开始
    @Min(value=10)
    @Max(value=100)
    private Integer pageSize;


    public UserListReq(){
        pageNum = MeetingConstants.PAGE_NUM_DEFAULT;
        pageSize =  MeetingConstants.PAGE_SIZE_DEFAULT;
    }

}
