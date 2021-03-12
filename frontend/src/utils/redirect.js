/*
 * @Author: chenrf
 * @Date: 2021-03-09 15:11
 */
import router from 'umi/router';


function push(path){
    //  重定向调查
    // console.log(path)
    router.push(path);
}
/**
 * fetch 应答数据处理
 * @param {} response 
 */
function resDataHandler(response){
    // environment should not be used
    const { httpCode } = response;
    if ((httpCode === 302) || (httpCode === 307)){// 重定向
      push({
        pathname: response.message,
      });
    }
    // // 针对account 处于suspended 状态
    // if (httpCode === 403) {
    //   push({
    //     pathname: '/accessdenied',
    //   });
    // }
    return response;
}
/**
 * 通过改变页面url实现跳转
 * @param {*} url 
 */
function setWindowHref(url){
  // 使用这个会导致全局数据清空 
  window.location.href = url
}
export {push, resDataHandler, setWindowHref}