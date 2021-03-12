import * as globalconfig from '@/services/globalconfig';


export default {
  namespace: 'globalconfig',

  state: {
    configs: [],
  },

  effects: {
    *getGlobalConfig({payload, callback}, {call, put, select}){
      // 获取user
      const u = yield select(state => state.user);
      const response = yield call(globalconfig.getGlobalConfig, payload.groupId, u);
      if(response){
        // 成功
        yield put({
          type: 'refreshConfigs',
          payload: response,
        });
      }
      return response;
    },
  },

  reducers: {
    refreshConfigs(state, {payload}) {
      return {
        ...state,
        configs: payload || [],
      };
    },
  },
};
