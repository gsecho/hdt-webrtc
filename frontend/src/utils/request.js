import fetch from 'dva/fetch';
import { getLocale } from 'umi/locale';
import lodash from 'lodash';
import * as tokenUtils from './tokenUtils'
import * as redirect from './redirect'

// const backendUrl = backend.api;

/**
 * 获取不需要拦截的request url (TODO,可以改成配置文件)
 */
function getAllowRequestUrl() {
  // 参数含义看这里 https://www.runoob.com/jsref/jsref-obj-regexp.html
  // 增加 /^\/v1\/user\/info/的原因，如有是/的时候是会重定向的，这时候redirect会失效
  return [
    /^\/v1\/user\/login/,
    /^\/v1\/user\/register/,
    /^\/v1\/meeting\/client-ip/
  ];
}

/**
 * 检查request url 是否需要拦截
 * @param url           request url
 * @returns {boolean}  true表示允许通过，false表示需要再判断
 */
function checkAllowRequestUrl(url) {
  let res = false;
  const exceptUrl = getAllowRequestUrl();
  if (exceptUrl.length > 0) {
    for (let i = 0; i < exceptUrl.length; i+=1) {
      const flag = exceptUrl[i].test(url);
      if (flag) {// 匹配到不需要user的url
        res = true;
        break;
      }
    }
  }
  return res;
}


async function httpClient(url, option) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  // console.log(token);
  let locale = getLocale();
  // 后端不支持-，需要替换成_
  locale = locale.replace('-', '_');
  const options = {
    expirys: false,
    credentials: 'include',
    redirect: 'manual',
    headers: {
      // 'Front-Version': "0001",
      'Accept': 'application/json',
      'lang': locale,
      'Cache-Control': 'no-cache'
    },
    ...option,
  };
  const localToken = tokenUtils.getToken()
  if(localToken !== null){
    options.headers.token = localToken
  }

  const newOptions = lodash.merge({}, options);
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE' ||
    newOptions.method === 'PATCH'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/json;charset=utf-8',// 加上utf8避免乱码
        ...newOptions.headers,
      };
      if (typeof (newOptions.body) !== 'string') {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
      };
    }
  }
  // 返回值： 
  // httpCode: http结果状态码
  // message：失败/成功 备注信息， 
  // content： 数据实体,包括app层面是所有返回 -- status: 忽略（后端历史问题，可能会取消）
  const resData =  await fetch(url, newOptions)
    // .then(resetTimer)
    .then((response) => {
      // 正常就进入下一个环节，错误就进入catch
      if ((response.status === 200) || (response.status === 400) || (response.status === 500) ) {// 200 OK , 400 Bad Request
        // body：详细
        // -- status: 忽略（后端历史问题，可能会删除）
        // code: 后端app状态码， 
        // message：失败/成功 备注信息， 
        // content： 数据实体
        const parser = response.json()
        .then((jsonStr)=>{
          const newData = {
            httpCode: response.status,
            message: response.statusText,
            body: jsonStr
          }
          return newData;
        })
        return parser;
      }
      // 重定向放401 ==> fetch 捕获不到302和307 
      const error = {};
      error.httpCode = response.status;
      error.message = response.statusText
      return error
    })
    .catch(e => ({
        httpCode: -1, // 自定义一个错误码
        message: e.message
      })
    );
    // console.log("resData" ,resData)
    return resData;
}

/**
 * @description: 用户请求校验，拦截未认证的请求  
 * @param {*} path 发起的http的path
 * @return {*}
 */
function reqFilter(path){
  let interceptFlag = true;
  const isAllow = checkAllowRequestUrl(path);
  // console.log(isAllow);
  if (isAllow) {
    // 不需要拦截
    interceptFlag = false;
  } else {
    // 再次判断
    // eslint-disable-next-line no-lonely-if
    if(tokenUtils.tokenValidate()){
      interceptFlag = false;
    }
  }
  if (!interceptFlag){
    return {
      intercept: false
    }
  }
  return {
    intercept: true,
    content: {
      httpCode: -2,
      message: "Account Info Missing"
    }
  }
}
function httpResInteceptor(res){
  // 401 在这里统一实现重定向
  if (res.httpCode === 401) {
    // 可以在这里加入排除的url判断
    tokenUtils.removeTokenAuthority()
    redirect.loginPageService();
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err" ,函数在执行的时候才返回  
 */
export default async function request(url, option) {
  const result = reqFilter(url)
  const { intercept } = result
  if(intercept){ // 拦截 
    return result.content;
  }

  const res = await httpClient(url, option);
  tokenUtils.refreshClickTime()
  // 增加一个http请求结果的拦截
  httpResInteceptor(res)
  return res;
}
