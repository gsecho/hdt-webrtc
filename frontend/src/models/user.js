/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import * as user from '@/services/user';
import * as redirect from '@/utils/redirect'
import * as utils from '@/utils/utils'
import * as tokenUtils from '@/utils/tokenUtils'
import { setAuthority } from '@/utils/Authority';
// import * as tokenUtils from '@/utils/tokenUtils'
import { reloadAuthorized } from '@/utils/Authorized';
import lodash from 'lodash'
import backend from '../../config/backend'

// const backendApiPrefix = backend.api
const backendPagePrefix = backend.pages

export default {
    namespace: 'user',

    state: {
        // 用户信息  
        // id, name, nickName, roles[] 
        userInfo: {},
        status: undefined,
        authFailureDisplay: 'none', // 认证错误信息 显示/隐藏
        
        // // 上一个跳转路由
        // lastRouter: '',
        // // 下一跳转路由
        // nextRouter: null,
    },

    effects: {
        *login({ payload }, { call, put }) {
            // console.log(payload);
            const response = yield call(user.reqUserLogin, payload);
            // Login successfully
            if (response.httpCode === 200) {
              const {body: { content: {token, authority} } } = response
              if(!lodash.isUndefined(token)){
                tokenUtils.tokenAuthorityRefresh(token, authority);
                reloadAuthorized();// 目录控制
              }
              
              const urlParams = new URL(window.location.href);
              const params = utils.getPageQuery();
              const { service } = params;
              if (service) {
                const redirectUrlParams = new URL(service);
                if (redirectUrlParams.origin === urlParams.origin) {
                  // 查找前缀
                  const { pathname } = redirectUrlParams
                  if(pathname.startsWith(backendPagePrefix)){
                    const redirectUrl = service.substr(urlParams.origin.length+backendPagePrefix.length);
                    if(redirectUrl === ""){
                      redirect.push("/")
                    }else{
                      redirect.push(redirectUrl)
                    }
                  }else{
                    redirect.push("/")
                  }
                } else {
                  window.location.href = service; // 使用这个会丢失开发者调试的数据，不利于分析,但是不影响使用
                }
              }else{
                redirect.push("/")
              }
            }else{
              // 认证失败
              yield put({
                type: 'setAuthDisplay',
                payload: '' // 显示失败信息 
              });
            }
          },
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
        * refreshToken(_ , { call, put }) { // 外部有定时器，会间隔一定时间调用
            const refresh = tokenUtils.needRefreshToken()
            if(refresh === 0){
                const response = yield call(user.reqRefreshToken)
                if (response.httpCode === 200) {
                    const {body: { content: {token, authority} } } = response
                    if(!lodash.isUndefined(token)){
                      tokenUtils.tokenAuthorityRefresh(token, authority);
                      reloadAuthorized();// 目录控制
                    }
                }
            }else if(refresh === 2){
                // 退出
                yield put({
                    type: 'logout'
                });
            }
            
        },
        *logout(_, { put, call }) {
            yield put({
              type: 'setUserLogout'
            });
            const localToken = tokenUtils.getToken()
            if(localToken !== null){
              yield call(user.reqUserLogout, {'token': localToken}); // 这里不关心结果
            }
            tokenUtils.removeTokenAuthority()
            redirect.logoutPage()
        },
    },

    reducers: {
        refreshCurrentUser(state, { payload }) {
            return {
                ...state,
                userInfo: payload
            };
        },
        setUserLogout(state) {
            // 登出 清除用户信息
            return {
              ...state,
              userInfo: {}
            };
          },
        /**
         * 设置/清除 认证错误信息显示标志
         * @param {s} state 
         * @param {*} param1 
        */
        setAuthDisplay(state, {payload}){
            return {
                ...state,
                authFailureDisplay: payload
            }
        },
    },
};