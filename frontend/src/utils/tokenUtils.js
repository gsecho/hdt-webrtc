/* eslint-disable no-use-before-define */
/*
 * @Author: chenrf
 * @Date: 2021-04-26 13:52
 */
import jwtDecode from "jwt-decode";
import {setAuthority} from './Authority'

const TOKEN_STRING = 'token'
const CLICK_SENOND_STING = 'clickSecond' // 发起请求的时间
const ERROR_VALUE = null

function getCurrentSecond(){
  // Math.round四舍六入五成双
  return Math.round(new Date().getTime()/1000);// 得到秒值
}
// ***************************** TOKEN ***************************** //
export function getToken(){
  return localStorage.getItem(TOKEN_STRING);// 没有token返回null
}
export function setToken(value){
  localStorage.setItem(TOKEN_STRING, value)
}
export function removeToken(){
  localStorage.removeItem(TOKEN_STRING)
}

/**
 * 校验token是否正确
 * 流程： 1. 读取token 2. 判断时间是否过期
 *  true：合法token
 */
export function tokenValidate(){
  let validFlag = false;
  const token = getToken()
  if(token !== null){
    try {
      const decoded = jwtDecode(token);
      const currentSec = new Date().getTime()/1000;
      const expired = decoded.exp
      if(expired < currentSec){// 过期删除
        removeTokenAuthority()
      }else{
        validFlag = true;
      }
    }catch(e){
      // nothing
      removeTokenAuthority()
    }
  }
  return validFlag ;
}
/**
 * 返回token的expired时间
 * 如果解析错误就清空所有数据
 * return 到期时间(秒值) / 0
 */
export function getTokenExpiredSecond(){
  const token = getToken()
  try {
    const decoded = jwtDecode(token);
    return decoded.exp
  }catch(e){
    removeTokenAuthority()
    return ERROR_VALUE
  }
}
export function getTokenAudience(){
  const token = getToken()
  try {
    const decoded = jwtDecode(token);
    return decoded.aud
  }catch(e){
    removeTokenAuthority()
    return ERROR_VALUE
  }
}
// ***************************** CLICK_TIME ***************************** //
// 存的是秒值
export function getClickTime(){
    return localStorage.getItem(CLICK_SENOND_STING);// 没有token返回null
  }
export function setClickTime(value){
  localStorage.setItem(CLICK_SENOND_STING, value)
}
export function refreshClickTime(){
  localStorage.setItem(CLICK_SENOND_STING, getCurrentSecond())
}
export function removeClickTime(){
  localStorage.removeItem(CLICK_SENOND_STING)
}

// ***************************** 刷新TOKEN ***************************** //
/**
 * 方案： 
 * 1. token的有效期是30min，我们设定20min以后(使用token里面的时间，距离exp小于10min)才开始刷新token，也就是如果20m-30m之间，页面没打开就不会刷新token
 * 2. 设置一个click操作时间clickTime，如果超过10min没有操作，则发送logout，同时清除本地token
 * 备注: clickTime包括两部分：一个用户动作，一个是socket保持连接
 */
/**
 * 判断是否需要刷新token
 * 0： 需要，1，不需要操作， 2 退出登陆
 */
const opTimeOut = 10*60 // 超过这个时间没操作就可以退出了
const refreshTimeDt = 10*60 // 小于这个值就要刷新Token
export function needRefreshToken(){
    const curSecond = getCurrentSecond()
    const exp = getTokenExpiredSecond()
    const clickTime = getClickTime()
    if(clickTime === ERROR_VALUE){
        return 2;
    }
      // 读取最后一次操作
      const dtOp = curSecond - clickTime
      if(dtOp > opTimeOut){
        return 2;
      }

      const dt = exp - curSecond;
      if((dt >= 0) && (dt <= refreshTimeDt)){// （单位s）在规定时间内,请求刷新token
          // request
          return 0;
      }
      return 1;
}

export function removeTokenAuthority(){
  removeToken()
  setAuthority(null)
  setClickTime(0)
}

export function tokenAuthorityRefresh(token, authority){
  setToken(token)
  setAuthority(authority)
  setClickTime(getCurrentSecond())
}

