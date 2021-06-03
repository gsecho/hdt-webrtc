/*
 * @Author: chenrf
 * @Date: 2021-03-09 15:11
 */
import router from 'umi/router';
import backend from '../../config/backend';

export function getRedirectLoginUrl(){
  // return `${backend.pages}${backend.loginUri}?service=${window.location.href}`;
  return `${backend.loginUri}?service=${window.location.href}`;
}

export function push(path){
    //  重定向
    router.push(path);
}

export function loginPageService(){
  const { pathname } = window.location
  // 已经在/user/login的页面，就不需要跳转了
  if(! pathname.startsWith(`${backend.pages}${backend.loginUri}`)){
    router.push(getRedirectLoginUrl());
  }
}

export function logoutPage(){
  router.push(`${backend.loginUri}`);
}

/**
 * 通过改变页面url实现跳转
 * @param {*} url 
 */
export function setWindowHref(url){
  // 使用这个会导致全局数据清空 
  window.location.href = url
}

