import { stringify } from 'qs';
import request from '@/utils/request';
import * as helper from '@/utils/helper';

const backendUrl = url + api;

// 获取secret 详情
export async function getSecretDetail(secretId, user) {
  let options = helper.generateRequestHeaders(user);
  return request(backendUrl + '/imagepullsecrets/' + secretId, options);
}
// 获取secret 列表
export async function listSecret(start, length, search, user) {
  let options = helper.generateRequestHeaders(user);
  let params = {
    'searchString': search,
    'offset': start,
    'limit': length,
  };

  return request(backendUrl + '/imagepullsecrets?' + stringify(params), options);
}
// 更新secret
export async function updateSecret(secretId, params, user) {
  let options = helper.generateRequestHeaders(user);
  options = {
    ...options,
    method: 'PATCH',
    body: params,
  };
  return request(backendUrl + '/imagepullsecrets/' + secretId, options);
}
// 删除secret
export async function deleteSecret(secretId, user) {
  let options = helper.generateRequestHeaders(user);
  options = {
    ...options,
    method: 'DELETE'
  };
  return request(backendUrl + '/imagepullsecrets/' + secretId, options);
}
// 新增secret
export async function addSecret(params, user) {
  let options = helper.generateRequestHeaders(user);
  options = {
    ...options,
    method: 'POST',
    body: params,
  };

  return request(backendUrl + '/imagepullsecrets', options);
}
