/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import * as tokenUtils  from '@/utils/tokenUtils'
import lodash from 'lodash'
import { getClientIp } from '@/services/meetingRoom';
import * as meetingUtils  from '@/services/meetingUtils'
import backend from '../../config/backend';

const wsSendPrefix = backend.ws.sendPrefix

export default {
    namespace: 'meetingRoom',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        // 进入页面以后 clearMeetingRoomState 会清空数据
        stompClient: undefined,
        roomAuthed: true, // roomid和passwd校验结果(http)
        
        curSource: undefined, // 当前发送的流，camera、screen 
        micEnabled: true, // 麦克风状态
        myId: 0, // 我的id--发消息时候放from位置
        roomId : 0,
        password: undefined,
        maxMember : undefined,
        speaker: 10, // 当前主讲人
        admin: [],  // 管理员（有权力关闭会议）[10, 1], 
        speeker: -1,
        // mystream: {}, // audiostreamTrack, videostreamTrack 单独拧出来方便操作
        members: [],
        // 与会人员：Id，名称，头像，在线状态，video状态，audio状态
        // {'id': 2, 'name': 'xiaoming', 'avatar': '/..../path/2.png', 'online': true, 'video': true, "audio": false, peerConnect: {}, stream: undefined, candidates:[], muted: false, screenStream: undefined }
    },
    effects: {
        /**
         * 监测websocket是否一直连接着，通话中，保持登陆状态
         */
        *checkSocketWork(_, { fork, cancelled, select, take, cancel }) {
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
            yield cancel(timeTask);
        },
        /** websocket连接成功处理 */
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
        /**
         * 请求current-meeting后的应答，如果有连接，需要逐个发起webrtc请求
         */
        *wbMessageCurrentMeeting( {payload, callback} , { put,select }){
            // 获取到当前room已经连接的用户信息
            // 发起连接
            const {to:myId, content, content:{members}} = payload
            // 先存储currentMeeting信息
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    ...content,
                    'myId': myId,
                }
            });
            const {isMobile} = yield select(state => state.global)

            // 先查询当前有的设备，然后再打开设备
            const enumDevices = yield navigator.mediaDevices.enumerateDevices()
            .then(devices => devices)
            .catch(error => {
                console.log(`${error.name  }: ${  error.message}`);
                return []
            });
            // 所有设备的devideId都是空的，返回 true: 所有都没有授权， false表示有授权过
            const authFlag = enumDevices.every( (value) => value.deviceId === "")
            
            const videoIndex = lodash.findIndex(enumDevices, { 'kind': 'videoinput' });
            const mediaConfig = {}
            if(videoIndex >= 0){// 有视频频设备
                if(!authFlag && enumDevices[videoIndex].deviceId === ""){// 认证过了,但是不同意使用摄像头
                    // nothing
                }else{
                    const videoConfig = {
                        'width': 480,
                        'height': 360
                    };
                    if(isMobile){
                        videoConfig.facingMode = "user"
                    }
                    mediaConfig.video = videoConfig
                }
            }
            const audioIndex = lodash.findIndex(enumDevices, { 'kind': 'audioinput' });
            if(audioIndex >=0 ){
                if(!authFlag && enumDevices[audioIndex].deviceId === ""){// 认证过了,但是不同意使用麦克风
                    // nothing
                }else{
                    mediaConfig.audio= true
                }
            }

            // 开启本地流数据
            const localStream = yield navigator.mediaDevices.getUserMedia({
                ...mediaConfig
            }).catch( error => {
                console.log(error);
                return new MediaStream()
            });
            console.log(localStream);
            // 先存一份myId和stream数据
            // 存储自己的流数据
            yield put({
                type: 'setMeetingMemberStream',
                payload: {
                    'id': myId,
                    'stream' :localStream ,
                    'muted': true, // 自己的播放器，要静音，不然会听到自己的声音
                }
            });

            // eslint-disable-next-line no-restricted-syntax
            for(const member of members) {
                const peerId = member.id
                if(myId === peerId){ // 自己不需要创建peerConnection
                    // eslint-disable-next-line no-continue
                    continue;
                }
                member.peerConnect = new RTCPeerConnection()
                yield put({
                    type: 'wbRtcPeerConnectHandler',
                    payload: {
                        'myId' : myId,// from、to尽量只用在 ws传递中，内部用有意义的字段描述
                        'peerId' : peerId,
                        'offer': undefined,
                    },
                    'callback': callback,
                });
            }
        },
        /**
         * 替换流数据操作（ camera <--> screen， camera1 <--> camera2）
         */
        *replaceTrack( {payload, callback} , { select, put } ){
            // const meetingRoom = yield select(state => state.meetingRoom)
            let videoStream;
            if(payload.target === 'camera'){
                const {isMobile} = yield select(state => state.global)
                const videoConfig = {
                    'width': 480,
                    'height': 360
                };
                if(isMobile){
                    videoConfig.facingMode = "user" 
                }
                videoStream = yield navigator.mediaDevices.getUserMedia({
                    video: videoConfig
                }).catch(error => {
                    console.log(error);
                });
                if(!videoStream){
                    return;
                }
            }else if(payload.target === 'screen'){
                videoStream = yield navigator.mediaDevices.getDisplayMedia({
                    video:{
                        'width': 1280,
                        'height': 720
                    }
                }).catch( error =>{
                    console.log(error);
                })
                if(videoStream){
                    callback(videoStream.getVideoTracks()[0]) // 把流数据返回给前端，停止的时候才能在回调中发送 disaptch 
                }else{
                    return;
                }
            }
            // const member = meetingUtils.getMemberFromList(myId, members)
            yield put({
                type: 'replaceMeetingMemberStream',
                payload: {
                    'videoStream' :videoStream ,
                }
            });
            yield put({ type: 'setMeetingRoomState', payload: { curSource: payload.target } });
        },
        /** 对端发起的offer */
        *wbMessageOffer( {payload, callback} , { put}){
            const {from: peerId, to: myId, content} = payload
            yield put({
                type: 'wbRtcPeerConnectHandler',
                payload: {
                    'myId' : myId,
                    'peerId' : peerId,
                    'offer': content,
                },
                'callback': callback
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
        *wbRtcPeerConnectHandler( {payload, callback} , { select }){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {stompClient, members} = meetingRoom;
            const {myId, peerId, offer} = payload
            const peerMember = meetingUtils.getMemberFromList(peerId, members)
            if(!peerMember){
                return;
            }
            const { peerConnect } = peerMember;
            peerConnect.onicecandidate = e=> { // 事件触发执行 
                if (e.candidate != null) {
                    // console.log(`onicecandidate: send candidate${e.candidate}`);
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

            const myInfo = meetingUtils.getMemberFromList(myId, members)
            if(myInfo){
                peerConnect.addStream(myInfo.stream);// 加入camera流数据
            }
            peerConnect.onaddstream = callback
            // peerConnect.onaddstream = e => {
            //     console.log("-------------------------------: ", e);
            //     peerMember.stream = e.stream
            //     console.log(peerMember.peerConnect.getReceivers());
            // };
            
            if(offer){
                // 应答 offer 
                peerConnect.setRemoteDescription(new RTCSessionDescription(offer));
                peerConnect.createAnswer().then(
                    (desc) =>{
                        peerConnect.setLocalDescription(desc);// 这个需要从state中取得
                        stompClient.send(`${wsSendPrefix}/answer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                    }
                )
            }else{
                // https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC
                // 发送offer之前必须准备好流
                peerConnect.createOffer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }).then( (desc) => {
                    peerConnect.setLocalDescription(desc);
                    stompClient.send(`${wsSendPrefix}/offer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                })
            }
        },
        
    },

    reducers: {
        setMeetingRoomState(state, {payload}) {
            return {
              ...state,
              ...payload
            };
        },
        clearMeetingRoomState(){
            return {
                'micEnabled': true,
                'roomAuthed': true,
                'members': []
            }
        },
        refeashStream(state) {
            const { members } = state;
            // eslint-disable-next-line no-restricted-syntax
            for(const member of members){
                if( !member.stream && member.peerConnect ){
                    member.stream = new MediaStream();
                    const receivers = member.peerConnect.getReceivers()
                    // eslint-disable-next-line no-restricted-syntax
                    for(const receiver of receivers){
                        member.stream.addTrack(receiver.track)
                    }
                }
            }
            return {
                ...state
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
        setMeetingMemberStream(state, {payload}) {
            // console.log(state);
            const { members } = state
            const member = meetingUtils.getMemberFromList(payload.id, members)
            if(member){
                member.stream = payload.stream;
                member.muted = payload.muted
            }
            return {// 触发更新
                ...state
            }
        },
        /**
         * 只替换RTCRtpSender流，使用新的videoStream+旧的audioStream替换localStream
         */
        replaceMeetingMemberStream(state, {payload : {videoStream: targetStream}}) {
            const { members, myId } = state
            // eslint-disable-next-line no-restricted-syntax
            for (const member of members) {
                if(myId === member.id){                    
                    member.stream.getVideoTracks()[0].stop()
                    targetStream.addTrack(member.stream.getAudioTracks()[0])
                    member.stream = targetStream
                }else{
                    const sends = member.peerConnect.getSenders(); // RTCRtpSender
                    if(sends){
                        // eslint-disable-next-line no-restricted-syntax
                        for (const rtpSender of sends) {
                            if(rtpSender.track !== null && rtpSender.track.kind === 'video'){
                                // const { track } = rtpSender
                                rtpSender.replaceTrack(targetStream.getVideoTracks()[0])
                            }
                        }
                    }
                }
            }
            // console.log(members);
            return {// 触发更新
                ...state
            }
        },
        micControl(state) {
            const {myId, members, micEnabled} = state;
            const member = meetingUtils.getMemberFromList(myId, members)
            if(micEnabled){ // true  开mic ---> 静mic
                member.stream.getAudioTracks()[0].enabled = false
            }else{// false  静mic ---> 开mic 
                member.stream.getAudioTracks()[0].enabled = true
            }
            
            return {
                ...state,
                'micEnabled': !micEnabled, // 覆盖前面的数据，所有需要放后面
            }
        },
    },
}
