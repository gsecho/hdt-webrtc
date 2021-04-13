/*
 * @Author: chenrf
 * @Date: 2021-03-18 15:01
 */
import { stringify } from 'qs';
import request from '@/utils/request';
import {backendUrl} from './globalconfig'

// 请求meeting列表
export async function reqMeetingList(params) {
    return request(`${backendUrl}/meetingManager/list?${stringify(params)}`);
}
// 删除单个meeting
export async function removeMeetingById(params) {
    return request(`${backendUrl}/meetingManager/id`, {
      method: 'DELETE',
      body: {
        ...params,
      },
    });
}

export async function addMeeting(params) {
    return request(`${backendUrl}/meetingManager/create`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function editMeeting(params) {
  return request(`${backendUrl}/meetingManager/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}




