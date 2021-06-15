package com.quantil.webrtc.core.config;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.quantil.webrtc.core.constant.CoreConstants;
import com.quantil.webrtc.core.interceptor.MdcInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * @author chenrf
 * @version 1.0
 * @date 2019/11/22 11:02
 */
@Configuration
@EnableWebMvc
public class InterceptorConfig implements WebMvcConfigurer {

    @Autowired
    private MdcInterceptor mdcInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 静态资源直接通过,这个是优先级很低，是没有匹配的url以后才会匹配这个
        registry.addResourceHandler("/**css", "/**js", "/**png")//url路径
//        registry.addResourceHandler("/**")//url路径
                .addResourceLocations("classpath:/static/");//对应目录
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        //使用Json转Map
        converters.add(getJsonHttpMessageConverter());
        converters.add(new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        WebMvcConfigurer.super.configureContentNegotiation(configurer);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 配置log打印时候的id信息
        registry.addInterceptor(mdcInterceptor).order(10);
    }

    private FastJsonHttpMessageConverter getJsonHttpMessageConverter() {
        FastJsonHttpMessageConverter fastJsonHttpMessageConverter = new FastJsonHttpMessageConverter();
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setSerializerFeatures(SerializerFeature.DisableCircularReferenceDetect);
        fastJsonConfig.setDateFormat(CoreConstants.DATE_FORMAT);
        List<MediaType> mediaTypes = new ArrayList<>();
        mediaTypes.add(MediaType.APPLICATION_JSON);
        fastJsonHttpMessageConverter.setSupportedMediaTypes(mediaTypes);
        fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);
        return fastJsonHttpMessageConverter;
    }

}
