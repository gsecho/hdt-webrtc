/*
 * @Author: chenrf
 * @Date: 2021-04-06 13:51
 */

import request from '@/utils/request';
import {backendUrl} from './globalconfig'


// eslint-disable-next-line import/prefer-default-export
export async function postAuthMeetingEnter(params) {
  return request(`${backendUrl}/meeting/authenticate`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
}
