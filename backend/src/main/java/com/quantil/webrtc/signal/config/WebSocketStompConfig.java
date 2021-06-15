package com.quantil.webrtc.signal.config;

import com.alibaba.fastjson.support.spring.messaging.MappingFastJsonMessageConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

import java.security.Principal;
import java.util.List;

/**
 * 这篇文章满详细的，可以使用这个 https://blog.csdn.net/weixin_40693633/article/details/91512632
 * @author chenrf
 * @version 1.0
 * @date 2021/4/27 14:32
 */
@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketStompConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    WebSocketChannelInterceptor webSocketChannelInterceptor;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 普通协议
        registry.addEndpoint("/ws")
            .setAllowedOrigins("*") // 表示可以跨域
//            .setHandshakeHandler() // 自定义握手方式 -- 忽略
//            .addInterceptors(new StompHandshakeInterceptor())  // 自定义握手拦截器 -- 忽略
//            .withSockJS() //使用 SockJS 协议
        ;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 自定义调度器，用于控制心跳线程
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        // 线程池线程数，心跳连接开线程
        taskScheduler.setPoolSize(2);
        // 线程名前缀
        taskScheduler.setThreadNamePrefix("wb-thread-");
        // 初始化
        taskScheduler.initialize();

        /** 客户端 ---> websocket ---> MessageMapping(接收处理消息的地方) ---> MQ ---> 客户端订阅
         *  setApplicationDestinationPrefixes： 配置websocket进来消息的前缀，不满足的过滤
         *  enableSimpleBroker： 配置mq前缀，@sendTo
         *  setUserDestinationPrefix : 在MQ用户接收的一侧加入前缀,比如配置了前缀"/u/"，则@SendToUser(/user)变成”/u/user/“
         */
        // 定义broker
        // topic 广播消息（是topic），搭配@SendTo("/topic/...")
        // user  用户传递给特定用户（是queue），搭配@SendToUser("/user/...")
        registry.setApplicationDestinationPrefixes("/message")
            .enableSimpleBroker( "/topic", "/user")
            .setHeartbeatValue(new long[]{10000,10000}) // 设置心跳ms -- 超时会断开mq连接
            .setTaskScheduler(taskScheduler) // 配置心跳线程
        ;
        // 这个就是一个过滤器，有这个前缀的才会通过，否则被拦截丢弃
        registry.setUserDestinationPrefix("/u/");
    }


    /**
     * 配置发送与接收的消息参数，可以指定消息字节大小，缓存大小，发送超时时间
     * @param registration
     */
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        /*
         * 1. setMessageSizeLimit 设置消息缓存的字节数大小 字节
         * 2. setSendBufferSizeLimit 设置websocket会话时，缓存的大小 字节
         * 3. setSendTimeLimit 设置消息发送会话超时时间，毫秒
         */
        registration.setMessageSizeLimit(10240)
            .setSendBufferSizeLimit(10240)
            .setSendTimeLimit(10000);

        registration.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @Override
            public WebSocketHandler decorate(final WebSocketHandler handler) {
                return new WebSocketHandlerDecorator(handler) {
                    @Override
                    public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
                        log.info("----------- afterConnectionEstablished --------------");
                        super.afterConnectionEstablished(session);
                    }

                    @Override
                    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
                        Principal principal = session.getPrincipal();
                        super.handleMessage(session, message);
                    }
                };
            }
        });
    }

    /**
     * 设置输入消息通道的线程数，默认线程为1，可以自己自定义线程数，最大线程数，线程存活时间
     * @param registration
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {

        /*
         * 配置消息线程池
         * 1. corePoolSize 配置核心线程池，当线程数小于此配置时，不管线程中有无空闲的线程，都会产生新线程处理任务
         * 2. maxPoolSize 配置线程池最大数，当线程池数等于此配置时，不会产生新线程
         * 3. keepAliveSeconds 线程池维护线程所允许的空闲时间，单位秒
         */
        registration.taskExecutor().corePoolSize(10)
            .maxPoolSize(20)
            .keepAliveSeconds(60);
        /*
         * 消息拦截器，实现ChannelInterceptor接口
         */
        registration.interceptors(webSocketChannelInterceptor); // 配置输入侧拦截器
    }

    /**
     *设置输出消息通道的线程数，默认线程为1，可以自己自定义线程数，最大线程数，线程存活时间
     * @param registration
     */
    @Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(10)
            .maxPoolSize(20)
            .keepAliveSeconds(60);
    }


    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        // 使用fastjson解析json，不实例化则使用默认方式解析json
        MappingFastJsonMessageConverter converter = new MappingFastJsonMessageConverter();
        messageConverters.add(converter);
        return true;
    }
}
