package com.quantil.webrtc.core.config;

import com.quantil.webrtc.core.interceptor.PreSaveInterceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2021/4/23 16:46
 */
@Component
public class MybatisPlusConfig {
    @Autowired
    private List<SqlSessionFactory> sqlSessionFactoryList;

    @PostConstruct
    public void addPageInterceptor() {
        PreSaveInterceptor preSaveInterceptor = new PreSaveInterceptor();
        sqlSessionFactoryList.forEach(
            sqlSessionFactory -> {
                sqlSessionFactory.getConfiguration().addInterceptor(preSaveInterceptor);
            });
    }
}
