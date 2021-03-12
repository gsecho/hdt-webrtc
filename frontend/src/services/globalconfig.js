/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import request from '@/utils/request';
import * as helper from '@/utils/helper';
import backend from '../../config/backend';


const portalUrl = backend.dev.portalUrl + backend.dev.portalApi;// hdt/rest
const backendUrl = backend.dev.url + backend.dev.api;// hdt/v1
// const abc = `${portalUrl} and ${backendUrl}`


// 根据group id获取config
export async function getGlobalConfig(groupId, user) {
  const options = helper.generateRequestHeaders(user);
  return request(`${backendUrl}/globalconfig/${groupId}`, options);
}
export {portalUrl, backendUrl}
