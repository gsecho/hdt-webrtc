import * as transport from '@/services/transport.ts';
import * as user from '@/services/user';
import lodash from 'lodash';

const searchParam = { transportType: "ipport", status: 1 }; //查询条件
export default {
    namespace: 'transportList',

    state: {
        search: {
            transportName: '',
            page: 1,
            pageSize: 10,
            transportStatus: [],
            transportStrategy: [],
            sorter: {}
        },
        transportList: {},
        allCustomerList: {},//所有的customer
    },

    effects: {
        // 获取transport列表
        * getTransportList({ payload, callback }, { call, put, select }) {

            if (payload && payload.page) {
                const { search } = yield select(state => state.transportList);
                yield put({
                    type: 'refreshSearch',
                    payload: { ...search, page: payload.page }
                });
            }
            const { search: { page = 1, pageSize = 10, transportName = '', transportStatus, transportStrategy = [], sorter = {} } } = yield select(state => state.transportList);
            const params = {
                ...searchParam,
                start: parseInt((page - 1) * pageSize),
                limit: parseInt(pageSize),
                transportName,
                transportStatus: transportStatus ? transportStatus[0] : null,
                transportStrategy: transportStrategy.join(','),
                sorterField: sorter.field,
                sorterOrder: sorter.order,
            }

            // 获取user
            let user = yield select(state => state.user);

            let response = yield call(transport.listTransport, user, params);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshTransportList',
                    payload: response
                });
            }
            return response;
        },
        * deleteTransport({ payload, callback }, { call, put, select }) {

            // 获取user
            let user = yield select(state => state.user);

            let response = yield call(transport.deleteTransport, payload, user);
            if (response) {
                const result = JSON.parse(response);
                if (result.status) {
                    // 成功
                    yield put({
                        type: 'getTransportList'
                    });
                }
                return result;
            }
            return response;
        },
        //获取所有用户列表
        * getAllCustomerList({ payload, callback }, { call, put, select }) {
            let allCustomerList = yield select(state => state.transportList.allCustomerList);
            if (lodash.isEmpty(allCustomerList)) {
                // 获取user
                let u = yield select(state => state.user);
                let response = yield call(user.listAllCustomer, u);
                if (response) {
                    // 成功
                    yield put({
                        type: 'refreshAllCustomerList',
                        payload: response,
                    });
                }
                return response;
            }
        },

    },

    reducers: {
        refreshSearch(state, { payload }) {
            let { search } = state;
            return {
                ...state,
                search: { ...search, ...payload },
            };
        },
        refreshTransportList(state, { payload }) {

            let transportList = {};
            if (payload) {
                transportList = { count: payload[dataRoot].count, data: payload[dataRoot].data }
            }

            return {
                ...state,
                transportList
            };
        },
        refreshAllCustomerList(state, { payload }) {
            return {
                ...state,
                allCustomerList: payload[dataRoot] || {},
            };
        },
    },
};