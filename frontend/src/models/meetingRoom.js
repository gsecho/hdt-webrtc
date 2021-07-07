/*
 * @Author: chenrf
 * @Date: 2021-03-26 15:18
 */
import * as tokenUtils  from '@/utils/tokenUtils'
import lodash from 'lodash'
import { getClientIp } from '@/services/meetingRoom';
import * as meetingUtils  from '@/services/meetingUtils'
import * as utils from '@/utils/utils'
import backend from '../../config/backend';

const wsSendPrefix = backend.ws.sendPrefix

export default {
    namespace: 'meetingRoom',
  
    /**
     * 这里的数据， effects和reducers是需要用select获取的 
     * const data = yield select(state =>state.meetingManager.data)
     */
    state: {
        myTempStream: undefined, // 临时存储，stomp交互以后，这个就无效了
        videoConfig: undefined,// 进入页面以后 设置
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
        // {'id': 2, 'name': 'xiaoming', 'avatar': '/..../path/2.png', 'online': true, 'video': true, "audio": false, peerConnect: {}, 
        //        stream: undefined, ices:[], outputMuted: false, screenStream: undefined, offered: 1(sended),2(received) }
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
                    yield delay(600);// 60s
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
            const {myTempStream} = yield select(state => state.meetingRoom)
            // 先存储currentMeeting信息
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    ...content,
                }
            });
            
            // 先存一份myId和stream数据
            // 存储自己的流数据
            yield put({
                type: 'setMeetingMemberStream',
                payload: {
                    'id': myId,
                    'stream' :myTempStream ,
                    'outputMuted': true, // 自己的播放器，要静音，不然会听到自己的声音
                }
            });
            // mic静音
            yield put({
                type: 'micControl'
            });
            // eslint-disable-next-line no-restricted-syntax
            for(const member of members) {
                const peerId = member.id
                if(myId === peerId){ // 自己不需要创建peerConnection
                    // eslint-disable-next-line no-continue
                    continue;
                }
                member.peerConnect = new RTCPeerConnection()
                member.ices = []
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
            let videoStream;
            console.log("---replaceTrack:", 1);
            if(payload.target === 'camera'){
                const {isMobile} = yield select(state => state.global)
                const {videoConfig} = yield select(state => state.meetingRoom)
                if(isMobile){
                    videoConfig.facingMode = "user" 
                }
                console.log("---replaceTrack:", '2-1');
                videoStream = yield navigator.mediaDevices.getUserMedia({
                    video: videoConfig
                }).catch(error => {
                    console.log("---", error);
                    return new MediaStream()
                });
                console.log("---replaceTrack:", '2-2');
            }else if(payload.target === 'screen'){
                console.log("---replaceTrack:", '3-1');
                videoStream = yield navigator.mediaDevices.getDisplayMedia({
                    video:{
                        'width': { ideal: 1280 },
                        'height': { ideal: 720 }
                    }
                }).catch( error =>{
                    console.log("---", error);
                    // 没有流返回undefined
                })
                console.log("---replaceTrack:", '3-2');
                if(videoStream){
                    const videoTracks = videoStream.getVideoTracks() // 如果没有数据则是empty
                    if(!lodash.isEmpty(videoTracks)){
                        callback(videoTracks[0]) // 把流数据返回给前端，停止的时候才能在回调中发送 disaptch 
                    }
                }else{
                    return;
                }
            }
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
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index > -1){
                const { peerConnect } = members[index]
                peerConnect.setRemoteDescription(new RTCSessionDescription(content));
            }
        },
        *wbMessageCandidate( {payload} , { select}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            const {from: peerId, content} = payload
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index === -1){
                return;
            }
            const member = members[index]
            const { peerConnect } = member
            const ice = new RTCIceCandidate(content);
            if(peerConnect && peerConnect.remoteDescription && peerConnect.remoteDescription.type){
                peerConnect.addIceCandidate(ice)
                .then(console.log("---success:"))
                .catch(e=>console.log("---error:", e));
            }else if(member.ices){
                // 加入数组中，收到offer以后填入
                member.ices.push(ice)
            }
        },
        *wbRtcPeerConnectHandler( {payload, callback} , { select }){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {stompClient, members} = meetingRoom;
            const {myId, peerId, offer} = payload
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index === -1){
                return;
            }
            const peerMember = members[index]            
            const { peerConnect } = peerMember
            if(!peerConnect){
                console.log("---error:", peerMember);
                console.log("---error:", peerConnect);
                return;
            }
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

            const myIndex = lodash.findIndex(members, member => member.id === myId )
            if(myIndex > -1){
                const myInfo = members[myIndex]
                const senders = peerConnect.getSenders()
                if(lodash.isEmpty(senders)){
                    yield myInfo.stream.getTracks().forEach(track=> {
                        peerConnect.addTrack(track, myInfo.stream);
                    });
                }
            }

            peerConnect.ontrack = callback
            if(offer){
                // 应答 offer 
                if(!peerMember.offered && peerMember.offered === 1){
                    return;
                }
                peerMember.offered = 2 // received
                peerConnect.setRemoteDescription(offer);
                peerMember.ices.forEach(
                    ice => peerConnect.addIceCandidate(ice)
                    .then(console.log("---success01:"))
                    .catch(e=>console.log("---error01:", e))
                )// 加入缓存的candidate
                peerConnect.createAnswer({
                    offerToReceiveVideo: 1,
                    offerToReceiveAudio: 1,
                }).then(desc =>{
                    peerConnect.setLocalDescription(desc).then(() => {
                        stompClient.send(`${wsSendPrefix}/answer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                    });
                })
            }else{
                if(!peerMember.offered && peerMember.offered === 2){
                    return;
                }
                peerMember.offered = 1 // sended
                // https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC
                // 发送offer之前必须准备好流
                peerConnect.createOffer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }).then( (desc) => {
                    peerConnect.setLocalDescription(desc).then(()=>{
                        stompClient.send(`${wsSendPrefix}/offer`, {}, JSON.stringify({"from": myId, "to": peerId, "content": desc}));
                    })
                })
            }
        },
        *refreshStream( {event} , { select, put }){
            // event : RtcTrackEvent
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            yield members.forEach(member =>{
                if(member.peerConnect ){
                    const receivers = member.peerConnect.getReceivers()
                    console.log("receivers", receivers);
                    const index = lodash.findIndex(receivers, receiver => receiver.track.id === event.track.id )
                    if(index > -1){
                        if(!member.stream) {
                            // eslint-disable-next-line no-param-reassign
                            member.stream = new MediaStream();
                        }
                        member.stream.addTrack(event.track)
                    }
                }
            })
            yield put({ type: 'refreshState' });
        },
        *caculateStat(_, {select, put}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            yield members.forEach(member =>{ // 遍历所有
                if(member.peerConnect ){
                    const receivers = member.peerConnect.getReceivers()
                    if(!lodash.isEmpty(receivers)){
                        // console.log("-----receivers:", receivers);
                        receivers.forEach( receiver=>{
                            if(receiver.track.kind === 'video') {
                                receiver.getStats().then( res => {
                                    res.forEach(report =>{
                                        if (report.mediaType === 'video' && report.type === 'inbound-rtp') {
                                            if(member.beforeBytesReceived){
                                                const dtReceived = report.bytesReceived - member.beforeBytesReceived
                                                let dtTimeStamp = report.timestamp - member.beforeTimestamp
                                                const localBrower = utils.detectBrowser()
                                                if (localBrower.brower === 'safari'){
                                                    dtTimeStamp /= 1000
                                                }
                                                let bitRate = Math.round(dtReceived * 8 / dtTimeStamp);
                                                if (localBrower.brower === 'safari'){
                                                    bitRate /= 1000
                                                }
                                                member.bitRate = bitRate
                                                // console.log("---", bitRate, ' kbits/sec');
                                            }
                                            member.beforeBytesReceived = report.bytesReceived
                                            member.beforeTimestamp = report.timestamp
                                        }
                                    });
                                });
                            }
                        })
                    }
                }
            })
            yield put({ type: 'refreshState' });
        },
    },

    reducers: {
        refreshState(state) {
            return {
              ...state
            };
        },
        setMeetingRoomState(state, {payload}) {
            return {
              ...state,
              ...payload
            };
        },
        clearMeetingRoomState(){
            return {
                // videoConfig : {
                //     'width': { ideal: 640 },
                //     'height': { ideal: 480 }
                // },
                'micEnabled': true,
                'roomAuthed': true,
                'members': []
            }
        },
        createMeetingMember(state, {payload}) {
            // payload  {  content:{id, username} }
            const {content} = payload
            content.peerConnect = new RTCPeerConnection()
            content.ices = []
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
                member.ices = []
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
            const index = lodash.findIndex(members, member => member.id === payload.id )
            if(index > -1){
                members[index].stream = payload.stream
                members[index].outputMuted = payload.outputMuted
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
                    const videoTracks = member.stream.getVideoTracks() // 如果没有数据则是empty
                    if(!lodash.isEmpty(videoTracks)){
                        videoTracks[0].stop()
                    }
                    const audioTracks = member.stream.getAudioTracks()
                    if(!lodash.isEmpty(audioTracks)){
                        targetStream.addTrack(audioTracks[0])
                    }
                    member.stream = targetStream
                }else{
                    const sends = member.peerConnect.getSenders(); // RTCRtpSender
                    if(sends){
                        const videoTracks = targetStream.getVideoTracks()
                        if(!lodash.isEmpty(videoTracks)){
                            const index = lodash.findIndex(sends, rtpSender=> rtpSender.track !== null && rtpSender.track.kind === 'video' )
                            if(index > -1){
                                sends[index].replaceTrack(videoTracks[0])
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
            const myIndex = lodash.findIndex(members, member => member.id === myId )
            if(myIndex > -1){
                const myMember = members[myIndex]
                const audioTracks = myMember.stream.getAudioTracks()
                if(!lodash.isEmpty(audioTracks)){
                    if(micEnabled){ // true  开mic ---> 静mic
                        audioTracks[0].enabled = false
                    }else{// false  静mic ---> 开mic
                        audioTracks[0].enabled = true
                    }
                }
            }
            
            return {
                ...state,
                'micEnabled': !micEnabled, // 覆盖前面的数据，所有需要放后面
            }
        },
    },
}
