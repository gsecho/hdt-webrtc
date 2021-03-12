import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
import { reqUserLogin, reqUserInfo } from '@/services/user';
import { setAuthority } from '@/utils/hdtAuthority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import * as redirect from '@/utils/redirect'
import backend from '../../config/backend'

const backendPrefix = backend.prod.url

export default {
  namespace: 'userLogin',

  state: {
    status: undefined,
    authFailureDisplay: 'none', // 认证错误信息 显示/隐藏
    userInfo : {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      // console.log(payload);
      const response = yield call(reqUserLogin, payload);
      // Login successfully
      if (response.httpCode === 200) {
        // yield put({
        //   type: 'setAuthDisplay',
        //   payload: 'none' // 隐藏失败信息
        // });
        
        // 登陆成功马上请求当前用户信息
        const userInfo = yield call(reqUserInfo, payload);
        if (userInfo.httpCode === 200) {
          const {body: { content } } = userInfo
          yield put({
            type: 'setUserInfo',
            payload: content
          });
        }
        reloadAuthorized();
        // const params = getPageQuery();
        // const { service: redirectUrl } = params; // 得到重定向地址
        // redirect.setWindowHref(redirectUrl || '/');
        // redirect.push("/");
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { service: redirectUrl } = params;
        if (redirectUrl) {
          const redirectUrlParams = new URL(redirectUrl);
          if (redirectUrlParams.origin === urlParams.origin) {
            // 查找前缀
            const { pathname } = redirectUrlParams
            if(pathname.startsWith(backendPrefix)){
              redirectUrl = redirectUrl.substr(urlParams.origin.length+backendPrefix.length);
              if(redirectUrl === ""){
                redirect.push("/")
              }else{
                redirect.push(redirectUrl)
              }
            }else{
              redirect.push("/")
            }
            
          } else {
            window.location.href = redirectUrl;
          }
        }
      }else{
        // 认证失败
        yield put({
          type: 'setAuthDisplay',
          payload: '' // 显示失败信息 
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'setUserLogout'
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    setUserLogout(state) {
      // 登出 清除用户信息
      return {
        ...state,
        userInfo: {}
      };
    },
    setUserInfo(state, { payload }) {
      // 登陆 存储用户信息
      const {roles} = payload
      setAuthority(roles);
      return {
        ...state,
        userInfo: payload
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
