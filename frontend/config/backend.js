/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
export default {
    // 环境
    pages: '/p', // 网页的访问
    // api: 'http://localhost:8010/v1'
    api: '/v1',  // api接口，用于版本控制
    publicPath: '/p/', // 静态资源路径
    // outputPath: '/assets/', // 指定编译后文件存放路径

    dataRoot:'content', // 返回的 body 数据格式

    loginUri : '/user/login',
    
    ws:{
        // url : 'wss://myrtc.com:18010/ws', // websocket url
        uri : '/ws', // websocket url
        sendPrefix: '/message',// 发送通道的前缀
        userPrefix: '/u',         // 接收通道的前缀
        userChannel: '/user/channel',
    },


};
