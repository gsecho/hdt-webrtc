import * as transport from '@/services/transport.ts';
import lodash from 'lodash';


export default {
    namespace: 'transportCommon',

    state: {
        strategyList: [],
        allSuffix: '',
        cnameDomainName: '',
    },

    effects: {
        //获取后缀
        * getSuffixs(_, { call, put, select }) {
            // 获取user
            let user = yield select(state => state.user);

            let response = yield call(transport.getSuffixs, user);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshSuffixs',
                    payload: response[dataRoot],
                });
            }
            return response;

        },
        //获取策略
        * getStrategyList({ payload, callback }, { call, put, select }) {
            let strategyList = yield select(state => state.transportCommon.strategyList);
            if (strategyList.length === 0) {
                // 获取user
                let user = yield select(state => state.user);
                let response = yield call(transport.getStrategys, user);
                if (response) {
                    // 成功
                    yield put({
                        type: 'refreshStrategyList',
                        payload: response[dataRoot],
                    });
                }
                return response;
            } else {
                return strategyList;
            }
        },
    },

    reducers: {

        refreshSuffixs(state, { payload: { allSuffix, cnameDomainName } }) {
            return {
                ...state,
                allSuffix: allSuffix,
                cnameDomainName: cnameDomainName,
            }
        },
        refreshStrategyList(state, { payload }) {
            if (payload) {
                let strategyList = [];
                Object.keys(payload).forEach(item => {
                    strategyList.push({ text: payload[item], value: item })
                })
                return {
                    ...state,
                    strategyList: strategyList,
                }
            }

        },
    },
};