package com.quantil.webrtc.core.bean.db;

import lombok.Data;

import java.util.Date;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/25 16:32
 */
@Data
public class DbBase { // 定义一个基础类，拦截的时候判断这个类，再去修改updateDt信息

    private Integer status; // 记录的状态 0：正常，1：挂起，2：删除

    private Date createDt;

    private String createBy;

    private Date updateDt;

    private String updateBy;

    private String remark;
}
