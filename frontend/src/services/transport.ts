import { stringify } from 'qs';
import request from '@/utils/request';
import * as helper from '@/utils/helper';

const backendUrl = url + api;


export async function listTransport(user, { ...restParam }) {
    let params = helper.trimObject(restParam);
    let options = helper.generateRequestHeaders(user);
    return request(backendUrl + '/transport?' + stringify(params), options);
}

export async function getStrategys(user) {
    let options = helper.generateRequestHeaders(user);
    return request(backendUrl + '/transport-strategies', options);
}

export async function getTransport(transportId, user) {
    let options = helper.generateRequestHeaders(user);
    return request(`${backendUrl}/transport/${transportId}`, options);
}

export async function getSuffixs(user) {

    let options = helper.generateRequestHeaders(user);
    return request(`${backendUrl}/transport/suffixs`, options);
}

export async function modifyTransport(transport, user) {
    let options = helper.generateRequestHeaders(user);
    options = {
        ...options,
        method: 'PUT',
        body: transport,
    };

    return request(`${backendUrl}/transport/${transport.transportId}`, options);
}

export async function deleteTransport(transportId, user) {
    let options = helper.generateRequestHeaders(user);
    options = {
        ...options,
        method: 'DELETE',
    };

    return request(`${backendUrl}/transport/${transportId}`, options);
}

export async function createTransport(transport, user) {
    let options = helper.generateRequestHeaders(user);
    options = {
        ...options,
        method: 'POST',
        body: transport,
    };

    return request(`${backendUrl}/transport`, options);
}

interface IHistoryProps {
    start: Number;
    limit: Number;
    transportId: Number;
}

export async function getTransportHistory(user, params: IHistoryProps) {
    let options = helper.generateRequestHeaders(user);
    return request(`${backendUrl}/transport/${params.transportId}/history?` + stringify(params), options);
}
