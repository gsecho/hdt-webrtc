/*
 * @Author: chenrf
 * @Date: 2021-04-06 13:51
 */

import request from '@/utils/request';


// eslint-disable-next-line import/prefer-default-export
export async function getMeetingRoomCip() {
    return request('https://webrtc-test.quantil.com/cipjson');
}
