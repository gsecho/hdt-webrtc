/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import * as tokenUtils  from '@/utils/tokenUtils'
import lodash from 'lodash'
import stomp from 'stompjs'
import { getClientIp } from '@/services/meetingRoom';
import * as meetingUtils  from '@/services/meetingUtils'
import backend from '../../config/backend';

const wsUri = backend.ws.uri
const wsSendPrefix = backend.ws.sendPrefix
const wsUserChannel = `${backend.ws.userPrefix}${backend.ws.userChannel}` // 订阅通道

export default {
    namespace: 'meetingRoom',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        stompClient: undefined,
        roomAuthed: undefined, // roomid和passwd校验结果(http)
        
        myId: 12, // 我的id--发消息时候放from位置
        roomId : 0,
        password: undefined,
        maxMember : undefined,
        speaker: 10, // 当前主讲人
        admin: [],  // 管理员（有权力关闭会议）[10, 1], 
        speeker: -1,
        myinfo: {}, // 数据内容与members的类似
        members: [],
        // 与会人员：Id，名称，头像，在线状态，video状态，audio状态
        // {'id': 2, 'name': 'xiaoming', 'avatar': '/..../path/2.png', 'online': true, 'video': true, "audio": false, peerConnect: {}, stream: undefined, candidates:[] }
    },
    effects: {

        *checkSocketWork(_, { fork, cancelled, select, put, take, cancel }) {
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            // eslint-disable-next-line func-names
            const timeTask = yield fork(function* () {
              try {
                while (true) {
                  yield delay(60000);// 60s
                  const stompClient = yield select(state =>state.meetingRoom.stompClient)
                  if(lodash.isUndefined(stompClient) || lodash.isNull(stompClient)){
                    // nothing
                  }else{
                    tokenUtils.refreshClickTime()
                  }
                }
              } finally {
                if (yield cancelled()) {// 取消之后的操作
                  // 这里什么都不做
                  console.log("-----   cancelled   -----");
                }
              }
            });
            yield take("STOP_TIME_TASK");
            yield cancel(timeTask)
        },
        *wbOpenedHander( { payload } , { put, call }){
            const { stompClient } = payload
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    'stompClient': stompClient, 
                    'roomAuthed': true,
                }
            });
            const response = yield call(getClientIp);
            if (response.httpCode === 200) {
                const {body: { content } } = response
                stompClient.send(`${wsSendPrefix}/current-meeting`, {} , JSON.stringify({'content': content}));// 上次自己的ip，同时请求当前room的连接信息
            }
        },
        *wbMessageCurrentMeeting( {payload} , { put }){
            // 获取到当前room已经连接的用户信息
            // 发起连接
            // const meetingRoom = yield select(state => state.meetingRoom)
            // console.log(meetingRoom);
            const {to:myId, content, content:{members}} = payload
            // 开启本地流数据
            const localStream = yield navigator.mediaDevices.getUserMedia({
                audio: true,
                // video: true,
                video:{
                    'width': 480,
                    'height': 360
                }
            });
            
            // 先存储currentMeeting信息
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    ...content,
                }
            });
            // 存储自己的流数据
            yield put({
                type: 'setMeetingMemberStream',
                payload: {
                    'id': myId,
                    'stream' :localStream ,
                }
            });
            
            // eslint-disable-next-line no-restricted-syntax
            for(const member of members) {
                const peerId = member.id
                member.peerConnect = new RTCPeerConnection()
                if(myId === peerId){
                    // eslint-disable-next-line no-continue
                    continue;
                }
                yield put({
                    type: 'wbRtcPeerConnectHandler',
                    payload: {
                        'myId' : myId,// from、to尽量只用在 ws传递中，内部用有意义的字段描述
                        'peerId' : peerId,
                        'offer': undefined,
                    }
                });
            }
        },
        *wbMessageOffer( {payload} , { put}){
            const {from: peerId, to: myId, content} = payload

            yield put({
                type: 'wbRtcPeerConnectHandler',
                payload: {
                    'myId' : myId,
                    'peerId' : peerId,
                    'offer': content
                }
            });
        },
        *wbMessageAnswer( {payload} , { select}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            const {from: peerId, content} = payload
            const member = meetingUtils.getMemberFromList(peerId, members)
            if(!member){
                return;
            }
            const { peerConnect } = member
            peerConnect.setRemoteDescription(new RTCSessionDescription(content));
        },
        *wbMessageCandidate( {payload} , { select}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            const {from: peerId, content} = payload
            const member = meetingUtils.getMemberFromList(peerId, members)
            if(!member){
                return;
            }
            const { peerConnect } = member
            peerConnect.addIceCandidate(new RTCIceCandidate(content));
        },
        *wbRtcPeerConnectHandler( {payload} , { select }){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {stompClient, members} = meetingRoom;
            const {myId, peerId, offer} = payload
            const member = meetingUtils.getMemberFromList(peerId, members)
            if(!member){
                return;
            }
            const { peerConnect } = member;
            peerConnect.onicecandidate = e=> { // 事件触发执行 
                if (e.candidate != null) {
                    console.log(`onicecandidate: send candidate${e.candidate}`);
                    stompClient.send(`${wsSendPrefix}/candidate`, {}, JSON.stringify({"from": myId, "to": peerId, "content": e.candidate}));
                }
            };
            peerConnect.ondatachannel = e => {
                console.log('Data channel is created!');
                e.channel.onopen = () => {
                  console.log('Data channel is open and ready to be used.');
                };

                e.channel.close = () => {
                    console.log('Data channel is close.');// TODO
                };
              };
            const myInfo = meetingUtils.getMemberFromList(myId, meetingRoom.members)
            if(myInfo !== null){
                peerConnect.addStream(myInfo.stream);// 加入local流数据
            }
            const peerMember = meetingUtils.getMemberFromList(peerId, meetingRoom.members)
            peerConnect.onaddstream = e => {
                peerMember.stream = e.stream
            };

            if(offer){
                // 应答 offer 
                peerConnect.setRemoteDescription(new RTCSessionDescription(offer));
                peerConnect.createAnswer().then(
                    (desc) =>{
                        peerConnect.setLocalDescription(desc);// 这个需要从state中取得
                        stompClient.send(`${wsSendPrefix}/answer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                    }
                );
            }else{
                peerConnect.createOffer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }).then( (desc) => {
                    peerConnect.setLocalDescription(desc);
                    stompClient.send(`${wsSendPrefix}/offer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                });
            }
        },
        
    },

    reducers: {
        // setTimeTaskState(state, {payload}) {
        //     return {
        //       ...state,
        //       timeTask: payload
        //     };
        // },
        setMeetingRoomState(state, {payload}) {
            return {
              ...state,
              ...payload
            };
        },
        clearMeetingRoomState(){
            return {
                members: []
            }
        },
        createMeetingMember(state, {payload}) {
            // payload  {  content:{id, username} }
            const {content} = payload
            content.peerConnect = new RTCPeerConnection()
            const { members } = state
            meetingUtils.addMemberToList(content, members)
            return {// 触发更新
                ...state
            }
        },
        removeMeetingMember(state, {payload}) {
            const {content} = payload
            const { members } = state
            meetingUtils.removeMemberFromList(content, members)
            return {// 触发更新
                ...state
            }
        },
        closeMeeting(state ) { // TODO 改成对特定链路关闭
            if(state.stompClient){
                state.stompClient.disconnect();
            }
            
            const { members } = state
            members.forEach(member =>{ // 注意，这里是异步操作
                if(!lodash.isEmpty(member)){
                    const {stream} = member
                    if(stream) {
                        const tracks = stream.getTracks()
                        if(tracks){
                            tracks.forEach( track=>{
                                track.stop()
                            })
                        }
                    }
                }
                if(member.peerConnect){
                    member.peerConnect.close()
                }
            })
            state.members.splice(0, members.length) // 清空
            return {
                ...state
            }
        },
        setMeetingMember(state, {payload}) { // 一次传入members,应答meeting表的时候调用
            // eslint-disable-next-line no-restricted-syntax
            for(const member of payload){
                member.peerConnect = new RTCPeerConnection()
            }

            return {
                ...state,
                members: {
                    ...payload
                }
            };
        },
        // setMeetingMemberPeerConnect(state, {payload}) {
        //     const { members } = state
        //     const member = meetingUtils.getMemberFromList(payload.id, members)
        //     if(member){
        //         member.peerConnect = payload.peerConnect;
        //     }else{
        //         console.log("null");
        //     }
        //     return {// 触发更新
        //         ...state
        //     }
        // },
        setMeetingMemberStream(state, {payload}) {
            // console.log(state);
            const { members } = state
            const member = meetingUtils.getMemberFromList(payload.id, members)
            if(member){
                member.stream = payload.stream;
            }
            return {// 触发更新
                ...state
            }
        },
    },
    subscriptions: {
        setup ({ dispatch, history }) {
            const PRE_URI = 'PRE_URI'
            history.listen(location => {
                const {pathname} = location
                const meetingUri = '/meetingroom'
                if(pathname !== meetingUri){ // 退出 meetingUri
                    const uri = sessionStorage.getItem(PRE_URI)
                    if((uri != null)&&(uri.indexOf(meetingUri))){
                        dispatch({
                            type: 'STOP_TIME_TASK'
                        })
                        dispatch({
                            type: 'closeMeeting'
                        })
                        dispatch({
                            type: 'clearMeetingRoomState'
                        })
                    }
                }else{
                    dispatch({
                        type: 'clearMeetingRoomState'
                    })
                    const uri = history.createHref(location)
                    sessionStorage.getItem(PRE_URI)
                    sessionStorage.setItem(PRE_URI, uri)
                    const roomId = location.query.id // 如果没有该参数值是undefined, 需要显示输入用户名和密码的界面
                    const roomPwd = location.query.pwd
                    const userName = tokenUtils.getTokenAudience()
                    if(userName === null){
                        return;
                    }
                    if(lodash.isUndefined(roomId) || lodash.isUndefined(roomPwd)){
                        // 错误情况
                    }else{
                        const clientId =  meetingUtils.getRandomClientName(roomId, userName)
                        const headers = {
                            'roomId': roomId,
                            'password': roomPwd,
                            'clientId': clientId,
                            'token': tokenUtils.getToken()
                        };
                        const ws = new WebSocket(`wss://${window.location.host}${wsUri}`);
                        const stompClient = stomp.over(ws);
                        const successFunction = ()=>{
                            stompClient.subscribe(wsUserChannel, respnose => {
                                // 展示返回的信息，只要订阅了 /user/getResponse 目标，都可以接收到服务端返回的信息
                                // console.log(respnose.body)
                                const data = JSON.parse(respnose.body);
                                switch(data.type){
                                    case 'current-meeting':
                                        dispatch({ type : 'wbMessageCurrentMeeting', payload: data});
                                        break;
                                    case 'offer':
                                        dispatch({ type : 'wbMessageOffer', payload: data});
                                        break;
                                    case 'answer':
                                        dispatch({ type : 'wbMessageAnswer', payload: data});
                                        break;
                                    case 'candidate':
                                        dispatch({ type : 'wbMessageCandidate', payload: data});
                                        break;
                                    case 'enter':
                                        dispatch({ type : 'createMeetingMember', payload: data});
                                        break;
                                    case 'leave':
                                        dispatch({ type : 'removeMeetingMember', payload: data});
                                        break;
                                    case 'close':
                                        dispatch({ type : 'closeMeeting', payload: data});
                                        break;
                                    default:
                                        console.log('default');
                                        break;
                                }
                            });
                            dispatch({
                                type: 'checkSocketWork', // 开启连接校验定时器
                            });
                            dispatch({
                                type: 'wbOpenedHander',
                                payload: { 
                                    'ws' : ws, // websocket连接
                                    'stompClient': stompClient,// stomp连接
                                    'roomId': roomId,
                                    'password': roomPwd,
                                    'myId': clientId,
                                }
                            });
                        }
                        const stompErrorCallback = e =>{
                            console.log("stompErrorCallback", e);
                            dispatch({
                                type: 'STOP_TIME_TASK'
                            })
                            dispatch({
                                type: 'closeMeeting'
                            })
                            dispatch({
                                type: 'setMeetingRoomState',
                                payload: {
                                    'roomAuthed': false,
                                }
                            })
                        }

                        stompClient.connect(headers, successFunction, stompErrorCallback);
                    }
                }
            })
        },
      },
}
 