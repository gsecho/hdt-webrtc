/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import { postAuthMeetingEnter } from '@/services/meetingEnter';
import * as redirect from '@/utils/redirect'

export default {
    namespace: 'meetingEnter',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        enterRoomVisible: false,
        enterAuthFailFlag: false,
    },
    effects: {
        *auth( params , { call, put}){// 通过http接口验证： 用户名，密码信息
            const response = yield call(postAuthMeetingEnter, params.payload);
            if ((response.httpCode === 200) && (response.body.code === 0)) {
                yield put({
                    type: 'setEnterMeeting',
                    payload: {
                        enterRoomVisible: false,
                        enterAuthFailFlag: false,
                    }
                });
                const url = `/room?id=${params.payload.id}&pwd=${params.payload.password}`
                // console.log(url);
                redirect.push(url)
            }else{
                yield put({
                    type: 'setEnterMeeting',
                    payload: {
                        enterAuthFailFlag: true,
                    }
                });
            }
        }
    },

    reducers: {
        setEnterMeeting(state, {payload}) {
            return {
              ...state,
              ...payload
            };
        },
    },

}
 