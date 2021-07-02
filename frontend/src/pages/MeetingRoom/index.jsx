/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import {Card, Result, Spin, Form, Button, Tooltip } from 'antd'
import lodash from 'lodash'
import * as redirect from '@/utils/redirect'
import MicOffSvg from '@/assets/micOff.svg';
import MicOnSvg from '@/assets/micOn.svg';
import DesktopSvg from '@/assets/desktop.svg';
import DesktopShareSvg from '@/assets/desktopShare.svg';
import stomp from 'stompjs'
import * as tokenUtils  from '@/utils/tokenUtils'
import * as meetingUtils  from '@/services/meetingUtils'
import VideoOutput from './VideoOutput'
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
    timerId: undefined,
  }
  
  componentDidMount(){
    const id = setInterval(this.timer1s , 1000)
    this.setState({
      timerId: id
    })
    this.startStomp()
  }

  componentWillUnmount(){
    const {timerId} = this.state
    clearInterval(timerId)
    this.closeStomp()
  }
  
  timer1s = ()=>{
    const { dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/caculateStat`})
  }

  peerOnaddStream = (ev) =>{
    // ev: RtcTrackEvent
    console.log('peerOnaddStream-------ev:', ev);
    const { dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/refreshStream`, event: ev})
  }

  startStomp = () =>{
    const { location, dispatch } = this.props;
    dispatch({type: `${curModlePrefix}/clearMeetingRoomState`})
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
          // console.log("-------------------------successFunction-------------------------------");
            stompClient.subscribe(wsUserChannel, respnose => {
                // 展示返回的信息，只要订阅了 /user/getResponse 目标，都可以接收到服务端返回的信息
                // console.log(respnose.body)
                const data = JSON.parse(respnose.body);
                switch(data.type){
                    case 'current-meeting':
                        dispatch({ type : `${curModlePrefix}/wbMessageCurrentMeeting`, payload: data, callback: this.peerOnaddStream });
                        break;
                    case 'offer':
                        dispatch({ type : `${curModlePrefix}/wbMessageOffer`, payload: data, callback: this.peerOnaddStream });
                        break;
                    case 'answer':
                        dispatch({ type : `${curModlePrefix}/wbMessageAnswer`, payload: data});
                        break;
                    case 'candidate':
                        dispatch({ type : `${curModlePrefix}/wbMessageCandidate`, payload: data});
                        break;
                    case 'enter':
                        dispatch({ type : `${curModlePrefix}/createMeetingMember`, payload: data});
                        break;
                    case 'leave':
                        dispatch({ type : `${curModlePrefix}/removeMeetingMember`, payload: data});
                        break;
                    case 'close':
                        dispatch({ type : `${curModlePrefix}/closeMeeting`, payload: data});
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
        type: `${curModlePrefix}/closeMeeting`
    })
    dispatch({
        type: `${curModlePrefix}/setMeetingRoomState`,
        payload: {
          'roomAuthed': false,
        }
    })
  }

  getVideosWidth = () => {
    const { global: { collapsed, isMobile} } = this.props;
    if(isMobile){
      return (document.body.clientWidth-24*4);
    }
      if(collapsed){
        return (document.body.clientWidth-64-24*4);
      }
        return (document.body.clientWidth-265-24*4);
  }

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

  ondblclickHandler = (event)=>{
    // console.log("double click", event.target);
    const de = event.target
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  }

  videoScreenSourceChange = () =>{
    const { dispatch, meetingRoom: { curSource }} = this.props
    if(curSource !== 'screen'){
      dispatch({
        'type': 'meetingRoom/replaceTrack',
        payload: {
          'target': 'screen'
        },
        callback: (mediaStreamTrack) => {
          // eslint-disable-next-line no-param-reassign
          mediaStreamTrack.onended = () => {
            dispatch({
                type: 'meetingRoom/replaceTrack',
                payload: {
                    'target': 'camera'
                }
            });
          }
        }
      })
    }else{
      // message.warning('Is already shared!');
      dispatch({
          type: 'meetingRoom/replaceTrack',
          payload: {
              'target': 'camera'
          }
      });
    }
  }

  /** 移动设备：
   * 前置摄像头： { 'video': { facingMode: "user" } }
   * 后置摄像头： {  video: { facingMode: { exact: "environment" } } }
   */
  cameraSourceChange = (deviceId) => {
    // { audio: true, video: { facingMode: { exact: "environment" } } }
    console.log('cameraSourceChange: ', deviceId);
  }

  videoInputSourceChange = (sources) =>{
    const { global: isMobile } = this.props;
    // if(sources.length){
    //   return <Select defaultValue={sources[0].deviceId} style={{ width: 110, flexGrow: 1 }} size="large" dropdownMatchSelectWidth={false} onSelect={this.cameraSourceChange}>
    //     { sources.map(item => <Option value={item.deviceId} key={item.deviceId}>{item.label}</Option>) }
    //   </Select>
    // }
    
    return <></>
  }

  /**
   * 麦克风控制
   */
  micStatusOnChange =  () =>{
    const { dispatch } = this.props
    dispatch({
      type: 'meetingRoom/micControl',
    });
  }

  render() {
    // console.log(this.props);
    
    const { meetingRoom: {roomAuthed, maxMembers: total, members, curSource, micEnabled } } = this.props
    const {global: {isMobile}, location } = this.props;
    const statsFlag = location.query.stats === 'display'// 是否显示统计数据 传输速度
    const videosWidth = this.getVideosWidth();
    
    // 我们这里的视频长宽比
    const lengthWidthRatio = 16/9;

    const videos = []
    members.forEach( (member, i) => {
      const video = {};
      if((!lodash.isEmpty(member)) && (!lodash.isUndefined(member.stream))){
        if(member.screenStream){
          video.src = member.screenStream;
        }else{
          video.src = member.stream;
        }
        video.id = member.id;
        video.muted = member.outputMuted
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
      videos.push(video);
    })

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
    const videoHeight = (videosWidth/lengthWidthRatio)/(flexInfo.columnNum)*0.8;
    // console.log(videos);
    let micIcon;
    if(micEnabled){
      micIcon = MicOnSvg;
    }else{
      micIcon = MicOffSvg;
    }
    
    let desktopIcon;
    if(curSource === 'screen'){
      desktopIcon = DesktopShareSvg;
    }else{
      desktopIcon = DesktopSvg;
    }

    let pageBg;
    if (lodash.isUndefined(roomAuthed)){
      pageBg = <Spin spinning> </Spin>
    }else if (roomAuthed){
      if(!total){
        pageBg = <Spin spinning> </Spin>
      } else {
        pageBg=<div className="custom-content-room-view">
          <Card style={{ padding: '0px' }}>
            <div className='custom-video-grid' id="video-views">
              {
                videos.map((video) => 
                  <div className="custom-videoflex" style={{  flexBasis: flexInfo.basis}} key={video.id} onDoubleClick={this.ondblclickHandler}>
                    { video.bitRate ? <p style={{ "position":"relative" }}>{video.bitRate} kbits/sec</p> : <></> }
                    <VideoOutput 
                      muted={video.muted}
                      video={video.src} 
                      height={videoHeight}
                    />
                  </div>
                )
              }
            </div>
          </Card>
          <div style={{display: 'flex', flexDirection: 'row-reverse'}}> 
            <Tooltip placement="bottom" title="exit">
              <Button type="primary" icon="export" size="large" style={{marginLeft: '10px '}} onClick={this.exitMeetingButtonHandle} />
            </Tooltip>
            {
              !isMobile &&
              <Tooltip placement="bottom" title="share">
                <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.videoScreenSourceChange}> 
                  <img className="custom-left-menu-icon" src={desktopIcon} style={{ width: '20px', height: '20px' }} />
                </Button>
              </Tooltip>
            }
            <Tooltip placement="bottom" title="mic">
              <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.micStatusOnChange}> 
                <img className="custom-left-menu-icon" src={micIcon} style={{ width: '20px', height: '20px' }} />
              </Button>
            </Tooltip>
            {/* <Tooltip placement="bottom" title="mic">
              <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.videoInputSourceChange}> 
                <img className="custom-left-menu-icon" src={CameraSourceChange} style={{ width: '20px', height: '20px' }} />
              </Button>
            </Tooltip> */}
          </div>
        </div> 
      }
    }
    else {
      pageBg =  <>
        <Result
          status="500"
          title="notice"
          style={{
                  background: 'none',
                }}
          subTitle="Please input room id and password."
        />
      </>
    }
    
    return(
      // <PageHeaderWrapper topRightWrapper={newButton} pageHeaderClass="no-border" childrenClass="custom-mt116">
      <>
        {pageBg}
      </>
      // </PageHeaderWrapper>
    )
  }
}
export default MeetingRoom;