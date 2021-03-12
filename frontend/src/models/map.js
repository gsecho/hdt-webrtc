import * as map from '@/services/map';

export default {
    namespace: 'map',

    state: {
        recordCount: 0,
        list: [],
        mapData: [],
    },

    effects: {
        * listNode({ payload, callback }, { call, put, select }) {
            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(map.listNode, payload.params, u);

            if (response) {
                // 成功
                yield put({
                    type: 'refreshList',
                    payload: response,
                });
            }
            return response;
        },
        * listAllNode(_, { call, put, select }) {

            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(map.listAllNode, u);

            if (response) {
                // 成功
                yield put({
                    type: 'refreshMapData',
                    payload: response,
                });
            }
            return response;
        },

    },

    reducers: {
        refreshList(state, { payload }) {
            return {
                ...state,
                recordCount: payload.totalCount || 0,
                list: payload.data || [],
            };
        },
        refreshMapData(state, { payload }) {
            return {
                ...state,
                mapData: payload.data || [],
            };
        },
    },
};