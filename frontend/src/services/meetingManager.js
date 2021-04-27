/*
 * @Author: chenrf
 * @Date: 2021-03-18 15:01
 */
import { stringify } from 'qs';
import request from '@/utils/request';
import {backendUrl} from './globalconfig'

// 请求meeting列表
export async function reqMeetingList(params) {
    // return request(`${backendUrl}/meeting/search?${stringify(params)}`);
     return request(`${backendUrl}/meeting/search`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
}
// 删除单个meeting
export async function removeMeetingById(id) {
    return request(`${backendUrl}/meeting/delete/${id}`, {
      method: 'DELETE',
    });
}

export async function addMeeting(params) {
    return request(`${backendUrl}/meeting/create`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function editMeeting(params) {
  return request(`${backendUrl}/meeting/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}




