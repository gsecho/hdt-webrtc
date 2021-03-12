import { stringify } from 'qs';
import request from '@/utils/request';
import * as helper from '@/utils/helper';
import * as chartUtil from '@/utils/chart';
import lodash from 'lodash';

const backendUrl = url + api;

export async function getMetrics(url, user, { startTime, endTime, interval, timezone, ...restParam }) {
    let i;
    interval && (i = chartUtil.tranInterval(interval).interval);
    const params = { ...restParam, datefrom: startTime, dateto: endTime, interval: i, timezone };

    let options = helper.generateRequestHeaders(user);
    return request(backendUrl + url + '?' + stringify(params), options);
}

export async function getAccessDomain(user, {authRange = "self-only",...restParam}) {
    let options = helper.generateRequestHeaders(user);
    return request(backendUrl + '/report/access-domain?' + stringify({...restParam,authRange}), options);
}

export async function getTransports(user, {authRange = "self-only",...restParam}) {
    let options = helper.generateRequestHeaders(user);
    return request(backendUrl + '/report/transport?' + stringify({...restParam,authRange}), options);
}