package com.quantil.webrtc.signal.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLInitializationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;

@Configuration
@Slf4j
public class RestTemplateConfig {
    @Value("${rest.stun.readTimeout}")
    private int readTimeout;

    @Value("${rest.stun.connectTimeout}")
    private int connectionTimeout;

    @Value("${rest.stun.retryCount}")
    private int retryCount = 1;

    @Value("${rest.stun.ssl.protocols}")
    private String protocols="TLS";


    @Bean
//    @Primary
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplateBuilder().requestFactory(() -> getClientHttpRequestFactory())
                .setConnectTimeout( Duration.ofMillis(connectionTimeout) )
                .setReadTimeout(Duration.ofMillis(readTimeout))
                .build();
        for (HttpMessageConverter<?> converter : restTemplate.getMessageConverters()) {
            if (converter instanceof StringHttpMessageConverter) {
                ((StringHttpMessageConverter) converter).setDefaultCharset(StandardCharsets.UTF_8);
            }
            if (converter instanceof MappingJackson2HttpMessageConverter) {
                MappingJackson2HttpMessageConverter jsonConverter = (MappingJackson2HttpMessageConverter) converter;
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
                jsonConverter.setObjectMapper(mapper);
//                jsonConverter.setSupportedMediaTypes(ImmutableList.of(
//                        new MediaType("application", "json", MappingJackson2HttpMessageConverter.DEFAULT_CHARSET),
//                        new MediaType("application", "octet-stream", MappingJackson2HttpMessageConverter.DEFAULT_CHARSET),
//                        new MediaType("text", "javascript", MappingJackson2HttpMessageConverter.DEFAULT_CHARSET)));
            }
        }
        return restTemplate;
    }

    private ClientHttpRequestFactory getClientHttpRequestFactory() {
        HttpClient httpClient = HttpClientBuilder.create()
                .setRetryHandler(new DefaultHttpRequestRetryHandler(retryCount, false))//不重试
                .setSSLContext(createSSLContext())
                .build();
        return new HttpComponentsClientHttpRequestFactory(httpClient);
    }

    private  SSLContext createSSLContext() throws SSLInitializationException {
        try {
            SSLContext sslContext = SSLContext.getInstance(protocols);
            sslContext.init((KeyManager[])null, (TrustManager[])null, (SecureRandom)null);
            return sslContext;
        } catch (NoSuchAlgorithmException var1) {
            throw new SSLInitializationException(var1.getMessage(), var1);
        } catch (KeyManagementException var2) {
            throw new SSLInitializationException(var2.getMessage(), var2);
        }
    }


}

