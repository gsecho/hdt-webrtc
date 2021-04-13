/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:25
 */
// import { stringify } from 'qs';
import request from '@/utils/request';
import {backendUrl} from './globalconfig'


// eslint-disable-next-line import/prefer-default-export
export async function reqCurrentMeetingList() {
    return request(`${backendUrl}/meetingManager/currentList`);
  }




