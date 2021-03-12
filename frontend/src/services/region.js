import request from '@/utils/request';
import * as helper from '@/utils/helper';
import { stringify } from 'qs';

const backendUrl = url + api;

/**
 * 获取region 列表
 * @param params
 * @param user
 * @returns {Promise<void>}
 */
export async function listRegion(params, user) {
  let options = helper.generateRequestHeaders(user);
  let url = '/regions?' + stringify(params);
  return request(backendUrl + url, options);
}
