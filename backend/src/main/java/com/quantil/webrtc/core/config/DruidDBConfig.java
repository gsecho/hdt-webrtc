package com.quantil.webrtc.core.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import javax.sql.DataSource;

/**
 * 数据配置
 */
@Configuration
// 扫描dao
//@MapperScan(basePackages = {"com.quantil.webrtc.core.dao", "com.quantil.webrtc.api.v1.meeting.dao"},
//            sqlSessionFactoryRef = "sysSqlSessionFactory")
public class DruidDBConfig {

    @Bean(name = {"sysDataSource"})
    @ConfigurationProperties(prefix = "spring.datasource.sql")
    public DataSource getDataSource() {
        //多数据源的时候create连接池
        return DataSourceBuilder.create().type(DruidDataSource.class).build();
    }

    @Bean(name = "sysSqlSessionFactory")
    public SqlSessionFactory getSqlSessionFactory(@Qualifier("sysDataSource") DataSource dataSource)
            throws Exception {
        //这里自定义了sysSqlSessionFactory是为了支持多数据源
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sessionFactory.setMapperLocations(resolver.getResources("classpath*:mapper/*.xml"));
//        sessionFactory.setTypeAliasesPackage("com.quantil.webrtc.core.bean.db");
        return sessionFactory.getObject();
    }

    /**
     * 配置事物管理器
     * @param dataSource
     * @return
    */
    @Bean(name="transactionManager")
    public DataSourceTransactionManager transactionManager(@Qualifier("sysDataSource") DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }

}

