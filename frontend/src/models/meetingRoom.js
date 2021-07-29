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
        videoConfig: undefined,// 进入页面以后 设置
        stompClient: undefined,
        roomAuthed: 0, // roomid和passwd校验结果(http) 0:未请求，1：校验成功，2：校验失败
        curSource: undefined, // 当前发送的流，camera、screen 
        videoEnabled: false, // video状态
        micEnabled: false, // 麦克风状态
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
        // {'id': 2, 'name': 'xiaoming', 'avatar': '/..../path/2.png', 'online': true, 'video': true, "audio": false, audioPc: {}, videoPc: {}, 
        //        stream: undefined, ices:[], audioOutputMuted: false, audioOffered: 1(sended),2(received), videoOffered: 1(sended),2(received) }
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
                'type': 'setMeetingRoomState',
                'payload': {
                    ...payload,
                    'roomAuthed': 1,
                }
            });
            const response = yield call(getClientIp);
            if (response.httpCode === 200) {
                const {body: { content } } = response
                stompClient.send(`${wsSendPrefix}/currentMeeting`, {} , JSON.stringify({'content': content}));// 上次自己的ip，同时请求当前room的连接信息
            }
        },
        /**
         * 请求currentMeeting后的应答，如果有连接，需要逐个发起webrtc请求
         */
        *wbMessageCurrentMeeting( {payload} , { put,select }){
            // 获取到当前room已经连接的用户信息
            // 发起连接
            const {to:myId, content, content:{members}} = payload
            const {stompClient} = yield select(state => state.meetingRoom)
            // 先存储currentMeeting信息
            yield put({
                type: 'setMeetingRoomState',
                payload: {
                    ...content,
                }
            });
            // eslint-disable-next-line no-restricted-syntax
            for (const member of members) {
                if(myId !== member.id){ // 自己不需要创建peerConnection
                    member.audioPc = new RTCPeerConnection()
                    member.videoPc = new RTCPeerConnection()
                    member.ices = []

                    // 登陆的时候audio和video都是没有的，所以对方有就让对方发起offer  
                    if(member.audio){
                        stompClient.send(`${wsSendPrefix}/reqSendOffer`, {}, JSON.stringify({"from": myId, "to": member.id, "content": 'audio'}));
                    }
                    if(member.video){
                        stompClient.send(`${wsSendPrefix}/reqSendOffer`, {}, JSON.stringify({"from": myId, "to": member.id, "content": 'video'}));
                    }
                }
            }
        },
        /**
         * 替换流数据操作（ camera <--> screen， camera1 <--> camera2）
         */
        *shareTrack( {payload, callback} , { select, put } ){
            let videoStream;
            const {target} = payload
            if(target === 'camera'){
                const {isMobile} = yield select(state => state.global)
                const {videoConfig} = yield select(state => state.meetingRoom)
                if(isMobile){
                    videoConfig.facingMode = "user" 
                }
                console.log("---shareTrack:", '2-1');
                videoStream = yield navigator.mediaDevices.getUserMedia({
                    video: videoConfig
                }).catch(error => {
                    console.log("---", error);
                    return new MediaStream()
                });
                console.log("---shareTrack:", '2-2');
            }else if(target === 'screen'){
                console.log("---shareTrack:", '3-1');
                videoStream = yield navigator.mediaDevices.getDisplayMedia({
                    video:{
                        'width': { ideal: 1280 },
                        'height': { ideal: 720 }
                    }
                }).catch( error =>{
                    console.log("---", error);
                    // 没有流返回undefined
                })
                console.log("---shareTrack:", '3-2');
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
            yield put({ type: 'setMeetingRoomState', payload: { curSource: target } });
        },
        /** 对端发起的offer */
        *wbMessageOffer( {payload} , { select}){
            const {from: peerId, to: myId, content: { offerDesc, mediaType}} = payload
            const meetingRoom = yield select(state => state.meetingRoom)
            const {stompClient, members, onTrack} = meetingRoom;
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index === -1) return

            const peerMember = members[index]
            const pc = mediaType === 'audio' ? peerMember.audioPc : peerMember.videoPc
            pc.onicecandidate = e=> { // 事件触发执行 
                console.log(`onicecandidate: -----------------`);
                if (e.candidate != null) {
                    console.log(`onicecandidate: send candidate${e.candidate}`);
                    stompClient.send(`${wsSendPrefix}/candidate`, {}, JSON.stringify({"from": myId, "to": peerId, "content": { 'mediaType': mediaType, 'candidate':e.candidate}}));
                }else{
                    // 所有candidate发送完会出现这个
                    stompClient.send(`${wsSendPrefix}/candidateEnd`, {}, JSON.stringify({"from": myId, "to": peerId, "content": { 'mediaType': mediaType }}));
                }
            };

            // 应答 offer 
            pc.ontrack = onTrack
            
            yield pc.setRemoteDescription(offerDesc);// 必须等到remote处理完成才能加入ice
            yield peerMember.ices.forEach(
                ice => pc.addIceCandidate(ice)
                .then(console.log("---success01:"))
                .catch(e=>console.log("---error01:", e))
            )// 加入缓存的candidate
            const config = mediaType === 'audio'? {offerToReceiveAudio: true}: {offerToReceiveVideo: true}
            pc.createAnswer(config)
                .then(desc =>{
                stompClient.send(`${wsSendPrefix}/answer`, {}, 
                    JSON.stringify({"from": myId, "to": peerId, "content": { 'answerDesc': desc, 'mediaType': mediaType}}));
                pc.setLocalDescription(desc);// 搜集candidate，触发onicecandidate事件
            })
        },
        /**
         * 处理对端的offer应答
         * @param {*} param0 
         * @param {*} param1 
         */
        *wbMessageAnswer( {payload} , { select}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            const {from: peerId, content: {mediaType, answerDesc}} = payload
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index > -1){
                const member = members[index]
                const pc = mediaType === 'audio' ? member.audioPc : member.videoPc
                yield pc.setRemoteDescription(answerDesc);
                member.ices.forEach(
                    ice => pc.addIceCandidate(ice)
                    .then(console.log("---success01:"))
                    .catch(e=>console.log("---error01:", e))
                )// 加入缓存的candidate
            }
        },
        *wbMessageCandidate( {payload} , { select}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            const {from: peerId, content:{mediaType, candidate}} = payload
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index === -1){
                return;
            }
            const peerMember = members[index]
            const pc = mediaType === 'audio' ? peerMember.audioPc : peerMember.videoPc
            
            if(pc && pc.remoteDescription && pc.remoteDescription.type){
                pc.addIceCandidate(candidate)
                .then(console.log("---success:"))
                .catch(e => console.log("---error:", e));
            }else if(peerMember.ices){
                // 加入数组中，设置setRemoteDescription以后需要再add
                peerMember.ices.push(candidate)
            }
        },
        // 打开 camera或者 mic
        *openLocalTrackStream({payload} , { select, put }) {
            const meetingRoom = yield select(state => state.meetingRoom)
            const {myId, members, stompClient } = meetingRoom;
            const {stream, mediaKind, targetState, targetSource} = payload;
            // mediaKind: screen, camera, microphone
            // mediaType: video, audio 
            const mediaType = mediaKind === 'microphone' ? 'audio' : 'video'

            const localTrack = stream.getTracks()[0]
            const index = lodash.findIndex(members, member => member.id === myId )
            if(index > -1){
                // 每次都使用新的stream，避免removeTrack导致的数组里面有 null 的情况
                if(members[index].stream){
                    yield members[index].stream.getTracks().forEach(track =>{
                        if (track.kind === mediaType) {
                            track.stop()
                        }else{
                            stream.addTrack(track)
                        }
                    })
                }
                members[index].stream = stream
                members[index].audioOutputMuted = true
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const member of members) {
                if(myId !== member.id){ 
                    yield put({
                        type: 'wbRtcSendOffer',
                        payload: {
                            'myId' : myId,
                            'peerId': member.id,
                            'mediaType': mediaType,
                            'track': localTrack
                        }
                    })
                }
            }
            // 更改服务器段的audio和video标志
            if(mediaKind === 'microphone'){
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { micEnabled: targetState}
                })
                stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {audio: targetState}}));
            }else if(mediaKind === 'camera'){
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { videoEnabled: targetState}
                })
                stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {video: targetState}}));
            }else{
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { 'curSource': targetSource}
                })
                const {videoEnabled} = meetingRoom
                if(videoEnabled || targetSource === 'screen'){
                    stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {video: true}}));
                }else {
                    stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {video: false}}));
                }
            }
        },
        *closeLocalTrackStream({payload} , { select, put }) {
            const meetingRoom = yield select(state => state.meetingRoom)
            const {myId, members, stompClient } = meetingRoom;
            const { mediaKind, targetState, targetSource } = payload
            const mediaType = mediaKind === 'microphone' ? 'audio' : 'video'

            yield members.forEach(member =>{
                if(member.id === myId){
                    member.stream.getTracks().forEach(track =>{
                        if (track.kind === mediaType) {
                            track.stop()
                        }
                    })
                }
                // 关闭的时候不remove，下次再次打开直接调用 sender.replaceTrack
            })
            // 更改服务器段的audio和video标志
            if(mediaKind === 'microphone'){
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { micEnabled: targetState}
                })
                stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {audio: targetState}}));
            }else if(mediaKind === 'camera'){
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { videoEnabled: targetState}
                })
                stompClient.send(`${wsSendPrefix}/mediaStatus`, {}, JSON.stringify({"from": myId, "to": '0', "content": {video: targetState}}));
            }else{
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { 'curSource': targetSource}
                })
            }
            
        },
        *wbRtcSendOffer( {payload} , { select, put }){
            const meetingRoom = yield select(state => state.meetingRoom)
            const { stompClient, members, onTrack } = meetingRoom
            const {myId, peerId, mediaType, track: localTrack} = payload
            
            const index = lodash.findIndex(members, member => member.id === peerId )
            if(index === -1) return
            const peerMember = members[index]

            const myIndex = lodash.findIndex(members, member => member.id === myId )
            if(myIndex === -1) return 
            const {stream: myStream} = members[myIndex]

            // console.log("----------------------------------------offered----------------------------");
            // if((index === -1) || (peerMember.offered)){
            //     console.log("----------------------------------------offered:", peerMember.offered);
            //     return;
            // }
            // peerMember.offered = true
            let pc = mediaType === 'audio' ? peerMember.audioPc : peerMember.videoPc
            
            if(!pc){
                console.log("---error:", pc);
                return
            }
            if(pc.remoteDescription){
                // 如果已经有track则 replaceTrack
                console.log("pc.getSenders:", pc.getSenders());
                if(pc.getSenders().length !== 0 && pc.getSenders()[0].track){ // 已经create则直接发送,并且有track
                    yield put({ type: 'replaceSenderTrack', payload:{ 'mediaType': mediaType, track: localTrack} });
                    return
                }
                // 如果没有track则新建RTCPeerConnection 
                pc.close()
                // console.log("-----:", pc.getReceivers()[0].track.muted);
                yield put({
                    type: 'setMeetingRoomState',
                    payload: { 'tempPc': pc}
                })
                if(mediaType === 'audio'){
                    peerMember.audioPc = new RTCPeerConnection()
                    pc = peerMember.audioPc
                }else{
                    peerMember.videoPc = new RTCPeerConnection()
                    pc = peerMember.videoPc
                }
            }
            
            pc.onicecandidate = e=> { // 事件触发执行 
                if(pc.remoteDescription){
                    console.error("--- onicecandidate send offer after")
                    return
                }
                if (e.candidate != null) {
                    console.log(`onicecandidate: send candidate${e.candidate}`)
                    stompClient.send(`${wsSendPrefix}/candidate`, {}, 
                        JSON.stringify({"from": myId, "to": peerId, "content": { 'mediaType': mediaType, 'candidate':e.candidate} }))
                }else{
                    console.log(`-------------------onicecandidate: send candidate${e.candidate}`);
                }
            };
            
            pc.ontrack = onTrack
            
            if(mediaType === 'audio' && myStream.getAudioTracks()[0]){
                pc.addTrack(myStream.getAudioTracks()[0], myStream)
            }else if(mediaType === 'video' && myStream.getVideoTracks()[0]){
                pc.addTrack(myStream.getVideoTracks()[0], myStream)
            }else{
                console.error("--- no found track")
                // return
            }

            // https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC
            // 发送offer之前必须准备好流
            pc.onnegotiationneeded = e =>{
                console.log('---onnegotiationneeded: ', e);
                if(pc.localDescription){ // 已经create则直接发送
                    stompClient.send(`${wsSendPrefix}/offer`, {}, 
                                JSON.stringify({"from": myId, "to": peerId, "content": {'offerDesc':pc.localDescription, 'mediaType': mediaType} }));
                }else{
                    const config = mediaType === 'audio'? {offerToReceiveAudio: true}: {offerToReceiveVideo: true}
                    pc.createOffer(config)
                    .then( desc => {
                        // 先发送offer再发送candidate 
                        stompClient.send(`${wsSendPrefix}/offer`, {}, 
                                JSON.stringify({"from": myId, "to": peerId, "content": {'offerDesc':desc, 'mediaType': mediaType} }));
                        pc.setLocalDescription(desc)// 搜集candidate，触发onicecandidate事件
                    })
                }
            }
        },
        *replaceSenderTrack({payload : {mediaType, track}}, { select, put }) {
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members, myId} = meetingRoom;
            // eslint-disable-next-line no-restricted-syntax
            for (const member of members) {
                const pc = mediaType === 'audio' ? member.audioPc : member.videoPc
                if (member.id !== myId) {
                    const senders = pc.getSenders(); // RTCRtpSender
                    const index = lodash.findIndex(senders, sender =>sender.track && sender.track.kind === mediaType)
                    if(index === -1){
                        pc.addTrack(track)
                    }else{
                        const sender = senders[index]
                        if(sender.track) {
                            sender.track.stop()
                        }
                        sender.replaceTrack(track)
                    }
                    console.log("-----senders:", senders);
                }else{
                    // 
                }
            }
            yield put({ type: 'refreshState' });
        },
        *peerOnTrackEventRefreshStream( {event} , { select, put }){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom
            yield members.forEach(member =>{
                const pc = event.track.kind === 'audio' ? member.audioPc : member.videoPc
                if(pc){
                    const receivers = pc.getReceivers()
                    console.log("receivers", receivers);
                    const index = lodash.findIndex(receivers, receiver => receiver.track.id === event.track.id )
                    if(index > -1){
                        const tempStream = new MediaStream()
                        if(member.stream) {
                            member.stream.getTracks().forEach(track=>{
                                if(track.enabled && !track.muted){ // 还在发送流数据的
                                    tempStream.addTrack(track)
                                }
                            })
                            // 有audio track  ，这时video变成muted了，这时候只能保留audio track （特殊）
                            const audioTracks = tempStream.getAudioTracks() // audio了
                            if (!(audioTracks.length !== 0 && event.track.muted)){
                                tempStream.addTrack(event.track)
                            }
                        }else{
                            tempStream.addTrack(event.track)
                        }
                        member.stream = tempStream
                        console.log("-----refreshStream-stream:", member.stream.getTracks())
                    }
                }
            })
            yield put({ type: 'refreshState' });
        },
        *caculateStats(_, {select, put}){
            const meetingRoom = yield select(state => state.meetingRoom)
            const {members} = meetingRoom;
            yield members.forEach(member =>{ // 遍历所有
                if( member.videoPc ){ // member.audoPc 只计算video是速度
                    const receivers = member.videoPc.getReceivers()
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
        }
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
                'videoEnabled': false,
                'micEnabled': false,
                'roomAuthed': 0,
                'members': []
            }
        },
        createMeetingMember(state, {payload}) {
            // payload  {  content:{id, username} }
            const {content: member} = payload
            member.audioPc = new RTCPeerConnection()
            member.videoPc = new RTCPeerConnection()
            member.ices = []
            const { members } = state
            meetingUtils.addMemberToList(member, members)
            return {// 触发更新
                ...state
            }
        },
        removeMeetingMember(state, {payload}) {
            const {content: member} = payload
            const { members } = state
            meetingUtils.removeMemberFromList(member, members)
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
                // TODO
                if(member.audioPc){
                    member.audioPc.close()
                }
                if(member.videoPc){
                    member.videoPc.close()
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
                member.audioPc = new RTCPeerConnection()
                member.videoPc = new RTCPeerConnection()
                member.ices = []
            }

            return {
                ...state,
                members: {
                    ...payload
                }
            };
        },
        
        /**
         * 只替换RTCRtpSender流，使用新的videoStream+旧的audioStream替换localStream
         */
        replaceMeetingMemberStream(state, {payload : {mediaType, videoStream: targetStream}}) {
            const { members, myId } = state
            // eslint-disable-next-line no-restricted-syntax
            for (const member of members) {
                const pc = mediaType === 'audio' ? member.audioPc : member.videoPc
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
                    const sends = pc.getSenders(); // RTCRtpSender
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
        // log 
        printState(state) {
            console.log("----:", state);
            return {
                ...state
            }
        }
    },
    
}
