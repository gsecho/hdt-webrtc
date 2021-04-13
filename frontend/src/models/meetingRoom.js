/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import { ROOM_STEP }  from '@/utils/globalConsts'
import lodash from 'lodash'
// import { getMeetingRoomCip } from '@/services/meetingRoom'
// const STEP_INIT = 0;
// const STEP_ROOMAUTH = 1;
// const STEP_ROOMEND = 2;
// const STEP_WEBSOCKET = 3;
// const STEP_END = 4;

export default {
    namespace: 'meetingRoom',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        step: ROOM_STEP.INIT , // 0：起始, 1： roomAuth，2：套接字连接， 3:结束
        roomAuthed: false, // roomid和passwd校验结果(http)
        ws: undefined,
        
        myId: 12, // 我的id
        roomId : 654,
        total : 6,
        speaker: 10, // 当前主讲人
        admin: [],  // 管理员（有权力关闭会议）[10, 1], 
        speeker: -1,
        myinfo: {}, // 数据内容与members的类似
        members: {},
        // // 与会人员：Id，名称，头像，在线状态，video状态，audio状态
        // {'id': 2, 'name': 'xiaoming', 'avatar': '/..../path/2.png', 'online': true, 'video': true, "audio": false, peerConnect: {}, stream: undefined, candidates:[] }
    },
    effects: {
        *auth( params , { put}){// 通过http接口验证： 用户名，密码信息
            let flag = true;
            const curStep = ROOM_STEP.END;
            flag = true;

            yield put({
                type: 'setMeetingRoomState',
                payload: { 
                    'step' : curStep,
                    'roomAuthed': flag,
                 }
            });
        },
        *wbOpenedHander( {payload: { target } } , { put, select }){
            // TODO 由于id和join都是一起发的，导致这个还没打开，就执行了join，所以移到这里，后续自己的后台需要改到id信令的时候做
            const localStream = yield navigator.mediaDevices.getUserMedia({
                audio: true,
                // video: true,
                video:{
                    'width': 480,
                    'height': 360
                }
            });
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    'stream' : localStream,
                }
            });
            const meetingRoom = yield select(state =>state.meetingRoom)
            const {roomId} = meetingRoom;
            target.send(JSON.stringify({"type": "login", "user": '123', "key": 'password' }));
            // TODO 
            const wanIP ='59.61.78.135';
            if (wanIP != null) {
                target.send(JSON.stringify({"type": "wanIP", "ip": wanIP}));
            }
            target.send(JSON.stringify({"type": "room", "room": roomId}));
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    'step' : ROOM_STEP.END,
                }
            });
        },
        *wbMessageHander( {payload: {target, data}} , { put, select}){
            const meetingRoom = yield select(state =>state.meetingRoom)
            const obj = JSON.parse(data)
            if (obj.type === "id") { // 服务器分配给该客户端的id，这个后面会换成固定的id
                

                const myId = obj.id;
                yield put({
                    type: 'setMeetingRoomState',
                    payload: {
                        'myId' : myId,
                    }
                });
                
                yield put({
                    type: 'setMeetingMemberId',
                    payload: {
                        'id': myId,
                    }
                });
                const member = meetingRoom.members[myId]
                member.stream = meetingRoom.stream
            }else if (obj.type === "join") {
                const peerId = obj.join;
                // 有客户端请求room的时候，服务器会告知请求者 每个设备的id，让他去发起connet连接
                // 测试demo的每次发一个join.id，后续可以改成一次发送全部
                const peerConnect = new RTCPeerConnection();
                yield put({
                    type: 'setMeetingMemberPeerConnect',
                    payload: {
                        'id': peerId, // 已经连接到room的客户id
                        'peerConnect' : peerConnect,
                    }
                });
                peerConnect.onicecandidate = e=> { // 有事件触发执行  
                    // console.log(e);
                    if (e.candidate != null) {
                        console.log(`send candidate${e.candidate.candidate}`);
                        target.send(JSON.stringify({"type": "message", "to": peerId, "message": {"action": "candidate", "candidate": e.candidate}}));
                    }
                };
                const {myId} = meetingRoom
                console.log(meetingRoom );
                peerConnect.addStream(meetingRoom.members[myId].stream);// 加入local流数据
                peerConnect.onaddstream = e => {
                    console.log(e);
                    const member = meetingRoom.members[peerId];
                    member.stream = e.stream
                    if (e.candidate != null) {
                        console.log(`send candidate${e.candidate.candidate}`);
                        // 请求都加上from
                        target.send(JSON.stringify({"type": "message", "to": peerId, "message": {"action": "candidate", "candidate": e.candidate}}));
                    }
                };
                
                peerConnect.createOffer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }).then( (desc) => {
                    peerConnect.setLocalDescription(desc);
                    target.send(JSON.stringify({"type": "message", "to": peerId, "message": {"action": "offer", "offer": desc}}));
                });
                
                target.send(JSON.stringify({"type": "message", "to": peerId, "message": {"action": "connect"}}));
            }else if (obj.type === "message") {
                if (obj.message.action === "connect") {// 其他客户端主动请求连接
                    const peerId = obj.from;
                    const peerConnect = new RTCPeerConnection();
                    peerConnect.onicecandidate = e=> { // 有事件触发执行  
                        // console.log(e);
                        if (e.candidate != null) {
                            // console.log("send candidate " + event.candidate.candidate);
                            target.send(JSON.stringify({"type": "message", "to": peerId, "message": {"action": "candidate", "candidate": e.candidate}}));
                        }
                    };
                    yield put({
                        type: 'setMeetingMemberId',
                        payload: {
                            'id': peerId,
                        }
                    });
                    const {myId} = meetingRoom
                    peerConnect.addStream(meetingRoom.members[myId].stream);// 加入local流数据
                    peerConnect.onaddstream = e => {
                        // console.log(e);
                        const member = meetingRoom.members[peerId];
                        member.stream = e.stream
                    };
                    
                    yield put({
                        type: 'setMeetingMemberPeerConnect',
                        payload: {
                            'id': peerId, // 已经连接到room的客户id
                            'peerConnect' : peerConnect,
                        }
                    });
                }else if (obj.message.action === "offer") { // 其他客户端主动请求发起offer 
                    const remoteDesc = new RTCSessionDescription(obj.message.offer)
                    const member = meetingRoom.members[obj.from]
                    member.peerConnect.setRemoteDescription(remoteDesc)
                    member.peerConnect.createAnswer().then(
                        (desc) =>{
                            member.peerConnect.setLocalDescription(desc);// 这个需要从state中取得
	                        target.send(JSON.stringify({"type": "message", "to": obj.from, "message": {"action": "answer", "answer": desc}}));
                        }
                    );
                }else if (obj.message.action === "answer") {
                    const remoteDesc = new RTCSessionDescription(obj.message.answer)
                    const member = meetingRoom.members[obj.from]
                    // console.log(member);
                    member.peerConnect.setRemoteDescription(remoteDesc)
                }else if (obj.message.action === "candidate") {
                    const member = meetingRoom.members[obj.from]
                    // 每个member的candidate，这里可以有多个，一般是 网卡数量+自定义
                    member.peerConnect.addIceCandidate(new RTCIceCandidate(obj.message.candidate));
                }
                // console.log(obj);
            }else if (obj.type === "leave") {
                meetingRoom.members[obj.leave].peerConnect.close()
                // 清除数据 
                delete meetingRoom.members[obj.leave]
            } 
        }
    },

    reducers: {
        setMeetingRoomState(state, {payload}) {
            // console.log(state, payload);
            return {
              ...state,
              ...payload
            };
        },
        setMeetingMemberId(state, {payload}) {
            console.log(state);
            const { members } = state
            const member = members[payload.id]
            if(lodash.isUndefined(member)){
                members[payload.id]=  {'id': payload.id }
            }
            return state;
        },
        setMeetingMemberPeerConnect(state, {payload}) {
            const { members } = state
            const member = members[payload.id]
            if(lodash.isUndefined(member)){
                members[payload.id]= payload ;
            }else{
                member.peerConnect = payload.peerConnect;
            }
            return state;
        },
        setMeetingMemberStream(state, {payload}) {
            console.log(state);
            const { members } = state
            const member = members[payload.id]
            if(!lodash.isUndefined(member)){
                member.stream = payload.stream;
            }
            return state;
        },
        setMeetingMemberCandidate(state, {payload}) {
            const { members } = state
            const member = members[payload.id]
            if(!lodash.isUndefined(member)){
                member.candidates.push(payload.candidate);
            }
            return state;
        },
        setMeetingMemberState(state, {payload}) { 
            // 后续的修改（除了删除）都用这个
            // 方法： 在effect中修改数据，组装数据，然后传递到这个函数修改
            const { members } = state
            let member = members[payload.id]
            if(!lodash.isUndefined(member)){
                member =  payload// 替换原来的数据
            }
            return state;
        },
        deleteMeetingMember(state, {payload}) { 
            const { members } = state
            const member = members[payload.id]
            if(!lodash.isUndefined(member)){
                if(!lodash.isUndefined(member).peerConnect){
                    member.peerConnect.close()
                }
                delete members[payload.id]
            }
            return state;
        }
    },
    subscriptions: {
        setup ({ dispatch, history }) {
            const {location} = history;
            // console.log(history);
            const roomId = location.query.id // 如果没有该参数值是undefined, 需要显示输入用户名和密码的界面
            const roomPwd = location.query.pwd
            if(lodash.isUndefined(roomId) || lodash.isUndefined(roomPwd)){
                // 错误情况
            }else{
                const ws = new WebSocket("wss://webrtc-signal.quantil.com:8181");
                dispatch({
                    type: 'setMeetingRoomState',
                    payload: { 
                        'ws' : ws,
                        'roomId': roomId,
                        'password': roomPwd,
                    }
                 });
                ws.onopen =  (e) => {
                    // console.log(e);
                    dispatch({
                        type: 'wbOpenedHander',
                        payload: {
                            target: e.target,
                            // 目前看 target，srcElement，currentTarget，三者是一样的
                            // srcEle: e.srcElement,
                            // currentTarget: e.currentTarget,
                        }
                     });
                }
                ws.onerror = ()=> {
                    console.log('error');
                }
    
                ws.onmessage = e=> {
                    dispatch({
                        type: 'wbMessageHander',
                        payload: {
                            target: e.target,
                            data: e.data,
                        }
                     });
                }
            
                ws.onclose = e => {
                    console.log('Connection closed', e);
                }
            }
            
        },
      },
}
 