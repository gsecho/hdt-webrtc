/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import request from '@/utils/request';
import { backendUrl} from './globalconfig'


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
 * 登出
 * @param {*} params 
 */
export async function reqUserLogout(params) {
    return request(`${backendUrl}/user/logout`, {
      method: 'POST',
      body: params,
    });
}
/**
 * 刷新token
 */
export async function reqRefreshToken() {
    return request(`${backendUrl}/user/refresh-token`);
}
/**
 * 获取当前登陆的用户信息
 */
export async function reqUserInfo() {
    return request(`${backendUrl}/user/info`);
}

export async function requestUserList(params) {
    return request(`${backendUrl}/user/list`, {
        method: 'POST',
        body: params,
      });
}

export async function deleteUser(params) {
    const {id} = params
    return request(`${backendUrl}/user/${id}`, {
        method: 'DELETE',
        // body: params,
      });
}

export async function createUser(params) {
  return request(`${backendUrl}/user/create`, {
      method: 'POST',
      body: params,
    });
}

