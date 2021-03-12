import fetch from 'dva/fetch';
import { getLocale } from 'umi/locale';
import lodash from 'lodash';
import * as redirect from './redirect'

/**
 * 获取不需要拦截的request url (TODO,可以改成配置文件)
 */
function getAllowRequestUrl() {
  return [
    /\/rest\/user\/customers(.*)?/g,
    /\/rest\/user\/current(.*)?/g,
    /\/rest\/user\/logout(.*)?/g,
    /\/hdt\/v1\/login\/account/g,
  ];
}

/**
 * 检查request url 是否需要拦截
 * @param url           request url
 * @returns {boolean}  true表示需要拦截，false表示不需要拦截
 */
function checkRequestUrl(url) {
  let res = true;
  const exceptUrl = getAllowRequestUrl();
  if (exceptUrl.length > 0) {
    for (let i = 0; i < exceptUrl.length; i+=1) {
      const flag = exceptUrl[i].test(url);
      if (flag) {
        res = false;
        break;
      }
    }
  }
  return res;
}


// const cachedSave = (response, hashcode) => 
//   /**
//    * Clone a response data and store it in sessionStorage
//    * Does not support data other than json, Cache only json
//    */
//   // const contentType = response.headers.get('Content-Type');
//   // if (contentType && contentType.match(/application\/json/i)) {
//   //   // All data is saved as text
//   //   response
//   //     .clone()
//   //     .text()
//   //     .then(content => {
//   //       sessionStorage.setItem(hashcode, content);
//   //       sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//   //     });
//   // }
//    response
// ;


async function httpClient(url, option) {
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
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
  const newOptions = lodash.merge({}, options);
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE' ||
    newOptions.method === 'PATCH'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
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
      if ((response.status === 200) || (response.status === 400)) {// 200 OK , 400 Bad Request
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
      }if ((response.status === 302) || (response.status === 307)){
        // 302 Found (Previously "Moved temporarily")
        // 307 Temporary Redirect (since HTTP/1.1)
        const location = response.headers.get("Location"); // 重定向地址
        const body = {}
        body.httpCode = response.status;
        body.message = location;
        return body;
      }
        const error = {};
        error.httpCode = response.status;
        error.message = response.statusText
        return error
    })
    .then((data)=>{
      redirect.resDataHandler(data);
      // console.log(data)
      return data;
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
async function reqFilter(path){
  let interceptFlag = false;// 拦截标志
  const isCheck = checkRequestUrl(path);
  if (!isCheck) {
    // 不需要拦截
  } else {
    // 拦截请求
    // TODO: 通过session Storage获取user
    let userStr = sessionStorage.getItem('userInfo');
    if(userStr === null){
      // 缺少用户信息，需要你先 请求 用户信息 
      const resData = await httpClient("/hdt/v1/user/info", {}); // TODO 修改 这个url的 读取位置 
      const { httpCode } = resData;
      if (httpCode === 200 ){
          const {code, content} = resData.body
          if (code === 0){
            sessionStorage.setItem('userInfo', JSON.stringify(content)) // 存入seasion中
          }
      }
      userStr = sessionStorage.getItem('userInfo');
      if(userStr === null){
        interceptFlag = true;
      }  
    }
  }
  if(interceptFlag){
    return {
      intercept: true,
      content: {
        httpCode: -2,
        message: "Account Info Missing"
      }
    }
  }
    return {
      intercept: false
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
    return result;
  }

  const res = await httpClient(url, option);
  return res;
}
