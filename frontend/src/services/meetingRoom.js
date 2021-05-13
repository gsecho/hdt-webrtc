/*
 * @Author: chenrf
 * @Date: 2021-04-06 13:51
 */
import request from '@/utils/request';
import {backendUrl} from './globalconfig'


export async function getClientIp() {
    return request(`${backendUrl}/meeting/client-ip`);
}

