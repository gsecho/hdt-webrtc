package com.quantil.webrtc.core.interceptor;

import com.quantil.webrtc.core.bean.db.DbBase;
import com.quantil.webrtc.core.constant.CoreConstants;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;
import java.util.Properties;

/**
 * 使用mybatis的拦截器填入时间数据
 * @author chenrf
 * @version 1.0
 * @date 2021/4/23 9:27
 */

@Intercepts({
    @Signature(
        type = Executor.class,
        method = "update",
        args = {MappedStatement.class, Object.class}
    )
})
public class PreSaveInterceptor implements Interceptor {
    private static final Logger logger = LoggerFactory.getLogger(PreSaveInterceptor.class);

    public void preSave(SqlCommandType type, DbBase dbBase){
        Date date = new Date();
        if(type == SqlCommandType.INSERT){
            dbBase.setCreateDt(date);
            dbBase.setUpdateDt(date);
            dbBase.setStatus(CoreConstants.DB_RECORD_ENABLE);
        }else if(type == SqlCommandType.UPDATE){
            dbBase.setUpdateDt(date);
        }
    }

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 写入自己的逻辑
//        logger.info("PreSaveInterceptor");
//        Object target = invocation.getTarget(); //被代理对象 -- 这里是 CachingExecutor
//        Method method = invocation.getMethod(); //代理方法   -- 这里是 Executor
//        Object[] args = invocation.getArgs(); //方法参数
        // 自定义操作
        if (invocation.getArgs().length > 1) {
            Object para0 = invocation.getArgs()[0];
            Object para1 = invocation.getArgs()[1];
            if((para0 instanceof MappedStatement) && (para1 instanceof DbBase)){
                preSave(((MappedStatement) para0).getSqlCommandType(), (DbBase)para1);
            }
        }
        return invocation.proceed();
    }

    @Override
    public Object plugin(Object target) {
        if (target instanceof Executor) { // 判断需要代理的类
            logger.info(target.getClass().getName());
            return Plugin.wrap(target, this); // 返回代理类
        }else{
            return target;
        }
    }

    @Override
    public void setProperties(Properties properties) {
        logger.debug("setProperties");
    }

}
