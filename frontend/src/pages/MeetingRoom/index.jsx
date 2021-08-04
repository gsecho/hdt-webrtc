/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import {Card, Result, Spin, Form, Button, Tooltip, Modal, message } from 'antd'
import lodash from 'lodash'
import * as redirect from '@/utils/redirect'
import MicOffSvg from '@/assets/micOff.svg';
import MicOnSvg from '@/assets/micOn.svg';
import cameraOffSvg from '@/assets/cameraOff.svg';
import cameraOnSvg from '@/assets/cameraOn.svg';
import DesktopSvg from '@/assets/desktop.svg';
import DesktopShareSvg from '@/assets/desktopShare.svg';
import stomp from 'stompjs'
import * as utils  from '@/utils/utils'
import * as meetingUtils  from '@/services/meetingUtils'
import VideoOutput from './VideoOutput'
import InputName from './InputName'
import backend from '../../../config/backend';

import './styles.less'

const wsUri = backend.ws.uri
const wsUserChannel = `${backend.ws.userPrefix}${backend.ws.userChannel}` // 订阅通道
const curModlePrefix = 'meetingRoom'

@connect(({ loading, meetingRoom, global }) => ({
  loading, meetingRoom, global
}))
@Form.create()
class MeetingRoom extends React.Component {

  state={
    // videosWidth: '0px',
    timerId: undefined, // 定时器ID
    // inputNameFormRef: undefined,
    lackName: false,
  }
  
  componentDidMount(){
    const { location } = this.props;
    const statsFlag = location.query.stats === 'display'// 是否显示统计数据 传输速度
    if(statsFlag){
      const id = setInterval(this.timer1s , 1000)
      this.setState({
        timerId: id
      })
    }
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount(){
    const {timerId} = this.state
    const { dispatch } = this.props;
    if(timerId){
      clearInterval(timerId)
    }
    this.closeStomp()
    dispatch({type: `${curModlePrefix}/clearMeetingRoomState`})
  }

  onResize = () => {
    const { dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/refreshState`})
  }

  inputNameButtonOk = e => {
    e.preventDefault();
    const promiseFun = this.inputNameFormRef.handleSubmit()// 调用下级组件的方法
    promiseFun.then(values=>{
      console.log("-----values then:", values);
      this.startStomp(values.name)
    })
  }

  inputNameButtonCancel = e => {
    e.preventDefault();
    this.setState({ lackName: true })
    const { dispatch } = this.props;
    if (e.currentTarget.localName === "button"){
      dispatch({
        type: `${curModlePrefix}/setMeetingRoomState`,
        payload: { roomAuthed:2 }
      })
    }
  }

  timer1s = ()=>{ // 每s发送一条消息
    const { dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/caculateStats`})
  }

  // peerTrackOnMuteOperate = (ev) => {
  //   console.log("---peerTrackOnMuteOperate:", ev);
  //   console.log("---peerTrackOnMuteOperate type:", ev.type);
  //   console.log("---peerTrackOnMuteOperate target id:", ev.target.id );
  //   console.log("---peerTrackOnMuteOperate target enabled:", ev.target.enabled );
  //   console.log("---peerTrackOnMuteOperate target muted:", ev.target.muted );
  //   const { dispatch } = this.props;
  //   dispatch({type: `${curModlePrefix}/peerOnMuteEventRefreshStream`, event: { 'type':ev.type, 'track': ev.target}})
  // }

  /**
   * 远端加入track，并且完成offer/answer+ice流程,以后的回调
   */
  peerOnTrack = ev =>{
    // ev: RTCTrackEvent
    // console.log('peerOnTrack-------ev:', ev);
    // console.log('peerOnTrack-------enabled:', ev.track.enabled);
    // console.log('peerOnTrack-------muted:', ev.track.muted);
    // ev.track.onmute = this.peerTrackOnMuteOperate 
    // ev.track.onunmute = this.peerTrackOnMuteOperate
    // ev.track.onend = this.peerTrackOnEnd

    const { dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/peerOnTrackEventRefreshStream`, event: ev})
  }

  startStomp = (nickname) =>{
    const { location, dispatch } = this.props;
    const roomId = location.query.id // 如果没有该参数值是undefined, 需要显示输入用户名和密码的界面
    const roomPwd = location.query.pwd
    const clientId =  meetingUtils.getRandomClientName(roomId, nickname)
    if(lodash.isUndefined(roomId) || lodash.isUndefined(roomPwd)){
        // 错误情况
    }else{
        const headers = {
            'roomId': roomId,
            'password': roomPwd,
            'clientId': clientId,
        };
        const ws = new WebSocket(`wss://${window.location.host}${wsUri}`);
        const stompClient = stomp.over(ws);
        const successFunction = ()=>{
          // console.log("-------------------------successFunction-------------------------------");
            stompClient.subscribe(wsUserChannel, respnose => {
                // 展示返回的信息，只要订阅了 /user/getResponse 目标，都可以接收到服务端返回的信息
                // console.log(respnose.body)
                const data = JSON.parse(respnose.body);
                switch(data.type){
                    case 'currentMeeting':
                        dispatch({ type : `${curModlePrefix}/wbMessageCurrentMeeting`, payload: data });
                        break;
                    case 'reqSendOffer':
                      dispatch({ type : `${curModlePrefix}/wbRtcSendOffer`, payload: {myId:data.to, peerId:data.from, mediaType: data.content} });
                      break;
                    case 'offer':
                        dispatch({ type : `${curModlePrefix}/wbMessageOffer`, payload: data });
                        break;
                    case 'answer':
                        dispatch({ type : `${curModlePrefix}/wbMessageAnswer`, payload: data});
                        break;
                    case 'candidate':
                        dispatch({ type : `${curModlePrefix}/wbMessageCandidate`, payload: data});
                        break;
                    case 'peerTrackStatusChange':
                      dispatch({ type : `${curModlePrefix}/peerTrackStatusChange`, payload: data});
                      break;
                    case 'enter':
                        dispatch({ type : `${curModlePrefix}/createMeetingMember`, payload: data});
                        break;
                    case 'leave':
                        dispatch({ type : `${curModlePrefix}/removeMeetingMember`, payload: data});
                        break;
                    default:
                        console.log('default');
                        break;
                }
            });
            dispatch({
                type: `${curModlePrefix}/checkSocketWork`, // 开启连接校验定时器
            });
            dispatch({
                type: `${curModlePrefix}/wbOpenedHander`,
                payload: { 
                    'ws' : ws, // websocket连接
                    'stompClient': stompClient,// stomp连接
                    'roomId': roomId,
                    'password': roomPwd,
                    'myId': clientId,
                    'onTrack': this.peerOnTrack,
                }
            });
        }
        stompClient.connect(headers, successFunction, this.closeStomp);
    }
  }

  closeStomp = () =>{
    const { dispatch } = this.props;
    dispatch({
        type: `${curModlePrefix}/STOP_TIME_TASK`
    })
    dispatch({
        type: `${curModlePrefix}/setMeetingRoomState`,
        payload: {
          'roomAuthed': 2,
        }
    })
  }

  getVideosWidth = () => document.body.clientWidth-20*4
    // const { global: { isMobile} } = this.props;
    // if(isMobile){
    //   return document.body.clientWidth
    // }
  
  getFlexDisplayInfo = (total) =>{
    // 计算行类情况
    const sqrRoot = Math.sqrt(total);
    const columnNum = Math.ceil(sqrRoot);
    let rowNum = Math.floor(sqrRoot);
    rowNum = (columnNum * rowNum )>=total ? rowNum : columnNum;
    const basis = `${Math.floor((1.00/columnNum)*10000)/100}%`;
    
    return {
      'rowNum': rowNum, // 行数
      'columnNum': columnNum, // 列数
      'basis': basis, // 等分情况 50%, 33.33%
    }
  }

  exitMeetingButtonHandle= () => {
    redirect.push("dashboard")
  }

  currentRequestFullscreen = (de) => {
    let flag = true;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }else if(de.msRequestFullscreen){
      de.msRequestFullscreen();
    }else{
      flag = false;
    }
    return flag;
  }

  currentExitFullscreen = (de) => {
    let flag = true;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }else if (de.msExitFullscreen) {
      de.msExitFullscreen();
    } else{
      flag = false;
    }
    return flag;
  }

  ondblclickHandler = (event)=>{
    const { global: { isMobile } } = this.props;
    const localBrowser = utils.detectBrowser(window)
    if(localBrowser.browser === "safari" && isMobile){// iphone手机会开启controls，这里就不处理双击事件
      // nothing
    }else if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) { // 全屏中
          // this.currentExitFullscreen() -- 不需要执行这个
          console.log("-- exit full screen");
    }else if (!this.currentRequestFullscreen(event.target)) {
        this.currentRequestFullscreen(event.target.parentNode)//  发现没用
    }
    
  }

  cameraScreenSourceChange = () =>{
    const { dispatch, meetingRoom: { curSource, videoEnabled }} = this.props
    if(curSource === 'screen'){ // 屏幕分享模式
      // 只需要close-screen / replace-camera-stream
      if(videoEnabled){
        navigator.mediaDevices.getUserMedia({video: true}).then(cameraStream =>{
          dispatch({
            type: `${curModlePrefix}/openLocalTrackStream`,
            payload: { 'stream' :cameraStream, 'mediaKind': 'screen', targetSource: 'camera' }
          });
        })
      }else{
        dispatch({
          type: `${curModlePrefix}/closeLocalTrackStream`,
          payload: { 'mediaKind': 'screen', targetSource: 'camera' }
        });
      }
    }else{
      // 当前状态：摄像头 模式
      navigator.mediaDevices.getDisplayMedia({
        video:{'width': { ideal: 1280 }, 'height': { ideal: 720 }}
      }).then(stream =>{
        console.log("----cameraScreenSourceChange tracks:", stream.getTracks());
        stream.getTracks()[0].onended = () => { // 关闭video回调（使用浏览器自带的按键才会进来这里）
          if(videoEnabled){
            navigator.mediaDevices.getUserMedia({video: true}).then(cameraStream =>{
              dispatch({
                type: `${curModlePrefix}/openLocalTrackStream`,
                payload: { 'stream' :cameraStream, 'mediaKind': 'screen', targetSource: 'camera' }
              });
            })
          }else{
            dispatch({
              type: `${curModlePrefix}/closeLocalTrackStream`,
              payload: { 'mediaKind': 'screen', targetSource: 'camera' }
            });
          }
        }
        dispatch({
          type: `${curModlePrefix}/openLocalTrackStream`,
          payload: { 'stream' :stream, 'mediaKind': 'screen',  'targetSource': 'screen' }
        });
      }).catch( error =>{
          console.log("---", error);
          // 没有流返回undefined
      })
    }
  }

  /**
   * 麦克风控制
   */
  micStatusOnChange =  () =>{
    const {dispatch, meetingRoom: {micEnabled} } = this.props;
    if(micEnabled){
      dispatch({
        type: `${curModlePrefix}/closeLocalTrackStream`,
        payload: { 'mediaKind': 'microphone', targetState: false }
      });
    }else{
      navigator.mediaDevices.getUserMedia({audio: true}).then( stream =>{
          console.log("----cameraStatusOnChange tracks:", stream.getTracks());
          dispatch({
            type: `${curModlePrefix}/openLocalTrackStream`,
            payload: { 'stream' :stream, 'mediaKind': 'microphone', targetState: true }
          });
        });
    }
  }

  /**
   * 摄像头控制
   */
  cameraStatusOnChange =  () =>{
    const {dispatch, global: { isMobile }, meetingRoom: { videoEnabled, curSource } } = this.props;

    if(curSource === 'screen'){
      message.warn('Screen sharing!')
      return;
    }

    if(videoEnabled){
      dispatch({
        type: `${curModlePrefix}/closeLocalTrackStream`,
        payload: { 'mediaKind': 'camera', targetState: false }
      });
    }else{
      const videoConfig = {
        'width': { ideal: 640 },
        'height': { ideal: 480 }
      }
      if(isMobile){
          videoConfig.facingMode = "user"
      }
      navigator.mediaDevices.getUserMedia({video: videoConfig}).then( stream =>{
          console.log("----cameraStatusOnChange tracks:", stream.getTracks());
          dispatch({
            type: `${curModlePrefix}/openLocalTrackStream`,
            // payload: { 'stream' :stream,'mediaType': 'video',targetState:{ 'videoEnabled': true} }
            payload: { 'stream' :stream, 'mediaKind': 'camera', targetState: true }
          });
        });
    }
  }

  // TODO : for test
  printLog = ()=>{
    const {dispatch } = this.props;
    dispatch({
      type: `${curModlePrefix}/printState`,
      payload: 'test'
  })
  }

  render() {
    const { meetingRoom: {roomAuthed, maxMembers: total, members, curSource, videoEnabled, micEnabled } } = this.props
    const {global: {isMobile}, location } = this.props;

    const localBrowser = utils.detectBrowser(window)
    let controlsDisplay = false;
    if(localBrowser.browser === "safari" && isMobile){// iphone手机会开启controls，这里就不处理双击事件
      controlsDisplay= true;
    }

    const statsFlag = location.query.stats === 'display'// 是否显示统计数据 传输速度
    const videosWidth = this.getVideosWidth();
    
    // 我们这里的视频长宽比
    const lengthWidthRatio = 16/9;

    const videos = []
    for (let i=0; i<members.length; i+=1){
      const member = members[i]
    // members.forEach( (member, i) => {
      const video = {};
      if((!lodash.isEmpty(member)) && (!lodash.isUndefined(member.stream))){
        video.src = member.stream;
        video.id = member.id;
        video.muted = member.audioOutputMuted
        if(statsFlag){
          if(member.bitRate){
            video.bitRate = member.bitRate
          }else{
            video.bitRate = "0"
          }
        }
      }else if(statsFlag){
        video.id = `empty_${i}`
        video.bitRate = '0'
      }else{
        video.id = `empty_${i}`
      }
      video.username = member.username;
      videos.push(video);
    }
    
    for(let i=videos.length; i< total; i+=1){
      const video = {};
      video.id = `substitution_${i}`
      if(statsFlag){
        video.bitRate = '0'
      }
      videos.push(video);
    }
    // console.log(videos);
    const flexInfo = this.getFlexDisplayInfo(videos.length);  
    const videoHeight = (videosWidth/lengthWidthRatio)/(flexInfo.columnNum)*0.75;
    // console.log(videos);
    const micIcon = micEnabled ? MicOnSvg : MicOffSvg;
    const cameraIcon = videoEnabled ? cameraOnSvg : cameraOffSvg;
    
    let desktopIcon;
    if(curSource === 'screen'){
      desktopIcon = DesktopShareSvg;
    }else{
      desktopIcon = DesktopSvg;
    }

    let pageBg;
    if(roomAuthed === 0){// 输入昵称阶段
      pageBg =<Modal
        title="nickname"
        visible={roomAuthed === 0}
        onOk={this.inputNameButtonOk}
        onCancel={this.inputNameButtonCancel}
              // style={{ top: 30 }}
        width={640}
      >
        <InputName wrappedComponentRef={(form) => {this.inputNameFormRef = form}} />
      </Modal>
    }else if(roomAuthed === 2){ // 校验失败
      const {lackName} = this.state 
      let localTitle;
      if(lackName){
        localTitle = "Please input nickname.";
      }else{
        localTitle = "room id or password error.";
      }
      pageBg =<Result
        status="500"
        title="notice"
        style={{
                  background: 'none',
                }}
        subTitle={localTitle}
      />
    }else if(!total){
        pageBg = <Spin spinning> </Spin>
    } else {
      pageBg=<div className="custom-content-room-view">
        <Card style={{ padding: '0px' }}>
          <div className='custom-video-grid' id="video-views">
            {
              videos.map((video) => 
                <div className="custom-videoflex" style={{  flexBasis: flexInfo.basis}} key={video.id} onDoubleClick={this.ondblclickHandler}>
                  { video.bitRate ? <p style={{ 'position': 'absolute' }}>{video.bitRate} kbits/sec</p> : <></> }
                  { video.username? <p style={{ 'position': 'absolute', 'left': 0, 'bottom': 0 }}>{video.username}</p> : <></> }
                  <VideoOutput 
                    muted={video.muted}
                    video={video.src} 
                    height={videoHeight}
                    controls={controlsDisplay}
                  />
                </div>
              )
            }
          </div>
        </Card>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}> 
          {
            !isMobile &&
            <Tooltip placement="bottom" title="share">
              <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.cameraScreenSourceChange}> 
                <img className="custom-left-menu-icon" src={desktopIcon} style={{ width: '20px', height: '20px' }} />
              </Button>
            </Tooltip>
          }
          <Tooltip placement="bottom" title="mic">
            <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.micStatusOnChange}> 
              <img className="custom-left-menu-icon" src={micIcon} style={{ width: '20px', height: '20px' }} />
            </Button>
          </Tooltip>
          <Tooltip placement="bottom" title="camera">
            <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.cameraStatusOnChange} disabled={curSource === 'screen'}> 
              <img className="custom-left-menu-icon" src={cameraIcon} style={{ width: '20px', height: '20px' }} />
            </Button>
          </Tooltip>
          {/* <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.printLog}>测试</Button> */}
        </div>
      </div> 
    }
    
    return(
      <>
        {pageBg}
      </>
    )
  }
}
export default MeetingRoom;