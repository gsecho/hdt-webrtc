/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import request from '@/utils/request';
import * as helper from '@/utils/helper';
import { stringify } from 'qs';
import {portalUrl, backendUrl} from './globalconfig'

// console.log(backendUrl)
// console.log(portalUrl)
/**
 * 登陆认证
 * @param {*} params 
 */
export async function reqUserLogin(params) {
    return request(`${backendUrl}/user/login`, {
      method: 'POST',
      body: params,
    });
}
/**
 * 获取当前登陆的用户信息
 */
export async function reqUserInfo() {
    return request(`${backendUrl}/user/info`);
}

export async function queryCurrent() {
    return request(`${backendUrl}/user/info`);
}
export async function query() {
    return request(`${backendUrl}/users`);
}

// SSO登出
export async function querySSOLogout(user) {
    let options = helper.generateRequestHeaders(user);
    options = {
        ...options,
        method: 'POST',
    };
    return request(`${backendUrl}/user/logout`, options);
}

// 根据id 获取用户信息
export async function getCustomer(id, user) {
    const options = helper.generateRequestHeaders(user, 1);
    return request(`${portalUrl}/customers/${  id}`, options);
}


// 获取所有customer
export async function listAllCustomer(user) {
    const options = helper.generateRequestHeaders(user);
    return request(`${portalUrl}/auth/customer-infos`, options);
}