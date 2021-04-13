/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import { reqCurrentMeetingList } from '@/services/meetingList';

export default {
    namespace: 'meetingList',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        data: {// 当前会议数据  
            total: 0,
            currentList: [] 
        }, 
    },
    effects: {
        *readList( _ , { call, put}){
            const response = yield call(reqCurrentMeetingList);
            if (response.httpCode === 200) {
                const {body: { content } } = response 
                yield put({
                    type: 'setList',
                    payload: { 
                        ...content,
                     }
                });
            }
        }
    },

    reducers: {
        setList(state, {payload}) {
            // console.log(payload);
            return {
              ...state,
              data: payload
            };
        },
    },

}
 