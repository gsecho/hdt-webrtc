import * as service from '@/services/transport.ts';

export default {
    namespace: 'transportEdit',

    state: {
        transport: {},
    },

    effects: {
        * getTransport({ payload }, { call, put, select }) {
            // 获取user
            let user = yield select(state => state.user);
            let response = yield call(service.getTransport, payload, user,);
            if (response) {
                // 成功
                const transport = response[dataRoot] || {};
                yield put({
                    type: 'refreshTransport',
                    payload: transport,
                });
            }
            return response;
        },
        * modifyTransport({ payload }, { call, put, select }) {
            // 获取user
            let user = yield select(state => state.user);
            let response = yield call(service.modifyTransport, payload, user,);
            return response;
        },
        * createTransport({ payload }, { call, put, select }) {
            // 获取user
            let user = yield select(state => state.user);
            let response = yield call(service.createTransport, payload, user,);
            return response;
        },
    },

    reducers: {

        refreshTransport(state, { payload }) {
            return {
                ...state,
                transport: payload
            }
        },
    },
};