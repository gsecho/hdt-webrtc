/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import * as user from '@/services/user';
import { setAuthority } from '@/utils/hdtAuthority';

// const timezoneKey = 'hdt-timezone';

export default {
    namespace: 'user',

    state: {
        // 用户信息  
        // id, name, nickName, roles[] 
        userInfo: {},
        // timezone: Number(localStorage.getItem(timezoneKey) || (moment().utcOffset()) / 60),
        
        // 上一个跳转路由
        lastRouter: '',
        // 下一跳转路由
        nextRouter: null,
    },

    effects: {
        // 登出
        // * logout({ payload, callback }, { call, put, select }) {
            
        // },
        // 获取当前用户信息, 登录和页面刷新的时候都会请求
        *getUserInfo({ payload }, { call, put }) {
            const userInfo = yield call(user.reqUserInfo, payload);
            if (userInfo.httpCode === 200) {
                const {body: { content } } = userInfo
                yield put({
                  type: 'refreshCurrentUser',
                  payload: content
                });
              }
        },
    },

    reducers: {
        refreshCurrentUser(state, { payload }) {
            const {roles} = payload
            setAuthority(roles);
            return {
                ...state,
                userInfo: payload
            };
        },
    },
};