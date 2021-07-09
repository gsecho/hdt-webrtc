package com.quantil.webrtc.core;

import com.quantil.webrtc.core.bean.db.DbBase;
import com.quantil.webrtc.core.interceptor.PreSaveInterceptor;
import org.apache.ibatis.mapping.SqlCommandType;
import org.junit.Test;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/6/21 18:18
 */
public class PreSaveTest {

    @Test
    public void preSave(){
        PreSaveInterceptor preSaveInterceptor = new PreSaveInterceptor();
        preSaveInterceptor.preSave(SqlCommandType.INSERT, new DbBase());
        preSaveInterceptor.preSave(SqlCommandType.UPDATE, new DbBase());
        preSaveInterceptor.preSave(SqlCommandType.SELECT, new DbBase());
    }

}
