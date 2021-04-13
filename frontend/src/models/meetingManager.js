/*
 * @Author: chenrf
 * @Date: 2021-03-18 14:56
 */
import { reqMeetingList, removeMeetingById, addMeeting, editMeeting } from '@/services/meetingManager';

export default {
    namespace: 'meetingManager',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        data: { // table相关数据
            pageNum : 1,
            pageSize: 10,
            total: 0,
            list: [],
        },
        addModalVisible: false, // 新增页面 显示标志
        editModalVisible: false, // 修改页面 显示标志
    },
  
    effects: {
        // 使用 curd 来命名， 小写开头
        /**
         * 获取会议记录  参数： 时间范围，数量，创建者
         * @param {payload} param0  {pageNum ， pageSize}
         * @param {*} param1 
         */
        *readMeetingList({ payload }, { call, put}){
            const response = yield call(reqMeetingList, payload);
            if (response.httpCode === 200) {
                const {body: { content } } = response 
                yield put({
                    type: 'setMeetingList',
                    payload: { 
                        ...content,
                        ...payload
                     }
                });
            }
        },
        *deleteMeetingById({ payload }, { call, put, select }){
            const data = yield select(state =>state.meetingManager.data)
            const { id } = payload
            const response = yield call(removeMeetingById, {'id': id});
            if (response.httpCode === 200) {
                yield put({type: 'readMeetingList', payload: {'pageNum': data.pageNum, 'pageSize': data.pageSize } });
            }
        },
        *createMeeting({ payload }, { call, put, select }) {
            const response = yield call(addMeeting, payload);
            if (response.httpCode === 200) {
                const data = yield select(state =>state.meetingManager.data)
                yield put({type: 'setAddModalVisible', payload: false});
                yield put({type: 'readMeetingList', payload: {'pageNum': data.pageNum, 'pageSize': data.pageSize } });
            }
        },
        *updateMeeting({ payload }, { call, put, select }) {
            const response = yield call(editMeeting, payload);
            if (response.httpCode === 200) {
                const data = yield select(state =>state.meetingManager.data)
                yield put({type: 'setEditModalVisible', payload: false});
                yield put({type: 'readMeetingList', payload: {'pageNum': data.pageNum, 'pageSize': data.pageSize } });
            }
        },
    },

    reducers: {
        setMeetingList(state, {payload}) {
            // console.log(payload);
            return {
              ...state,
              data: payload
            };
        },
        setAddModalVisible(state, {payload}) {
            // console.log(payload);
            return {
              ...state,
              addModalVisible: payload
            };
        },
        setEditModalVisible(state, {payload}) {
            // console.log(payload);
            return {
              ...state,
              editModalVisible: payload
            };
        },
    }
}
