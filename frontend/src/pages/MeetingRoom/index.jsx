/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import {Card, Result, Spin, Form, Button, Tooltip, Select, message } from 'antd'
import lodash from 'lodash'
import * as redirect from '@/utils/redirect'
import MicOffSvg from '@/assets/micOff.svg';
import MicOnSvg from '@/assets/micOn.svg';
import DesktopSvg from '@/assets/desktop.svg';
import DesktopShareSvg from '@/assets/desktopShare.svg';
import './styles.less'

const { Option } = Select;

class VideoOutput extends React.Component {
  constructor(props) {
      super(props);
      this.videoRef = React.createRef();
      this.streamIdRef = React.createRef();
  }

  componentDidMount() {
      const { video } = this.props
      if(video){
        const videoObj = this.videoRef.current;
        this.streamIdRef.current = video.id;
        videoObj.srcObject = video;
        videoObj.play();
        
      }
  }

  componentDidUpdate(){
    const { video } = this.props
      if(video){
        if(this.streamIdRef.current !== video.id){
          this.streamIdRef.current = video.id

          const videoObj = this.videoRef.current;
          videoObj.srcObject = video;
          videoObj.load();
          videoObj.play();
        }
      }
  }

  render() {
    const { key, muted } = this.props;
    
    let {height} = this.props;
    if(!height){
      height = 10
    }
    
    if(muted){
      return <video ref={this.videoRef} width='100%' height={height} id={key} muted />;
    }
    return <video ref={this.videoRef} width='100%' height={height} id={key} />;
  }
}

@connect(({ loading, meetingRoom, global }) => ({
  loading, meetingRoom, global
}))
@Form.create()
class MeetingRoom extends React.Component {

  state={
    videosWidth: '0px',
  }
  
  componentDidMount(){
    const { location, dispatch} = this.props
    const roomId = location.query.id // 如果没有该参数值是undefined, 需要显示输入用户名和密码的界面
    const roomPwd = location.query.pwd
    dispatch({
      'type': 'meetingRoom/auth',
      payload: { 
        'id': roomId,
        'password': roomPwd,
      },
    })
    this.setState({
      videosWidth: this.getVideosWidth(),
    })
    window.addEventListener('resize', this.handleResize.bind(this));

    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            console.log(devices);
        });
  }

  getVideosWidth = () => {
    const { global: { collapsed} } = this.props;
    if(collapsed){// 收缩
      return (document.body.clientWidth-24*4);
    }
    return (document.body.clientWidth-265-24*4);
  }
  
  handleResize = () => {
    this.setState({
      videosWidth: this.getVideosWidth(),
    })
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

  exitMeetingHandle= () => {
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

  videoSrcOnChange = () =>{
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
      message.warning('Is already shared!');
    }
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
    const { meetingRoom: {roomAuthed, maxMembers: total, members, curSource, micEnabled } } = this.props
    const {videosWidth} = this.state;
    // 我们这里的视频长宽比, 程序默认使用480*360
    const lengthWidthRatio = 16/9;

    const videos = []
    members.forEach( (member, i) => {
      if((!lodash.isEmpty(member)) && (!lodash.isUndefined(member.stream))){
        const video = {};
        if(member.screenStream){
          video.src = member.screenStream;
        }else{
          video.src = member.stream;
        }
        video.id = member.id;
        video.muted = member.muted
        videos.push(video);
      }else{
        videos.push({'id': `empty_${i}` });
      }
    })

    for(let i=videos.length; i< total; i+=1){
      videos.push({'id': `substitution_${i}`});
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
              <Button type="primary" icon="export" size="large" style={{marginLeft: '10px '}} onClick={this.exitMeetingHandle} />
            </Tooltip>
            {/* <Radio.Group value={curSource} size="large" buttonStyle="solid" style={{ marginLeft: '10px'}} onChange={this.videoSrcOnChange}>
              <Radio.Button value="camera">Camera</Radio.Button> 
              <Radio.Button value="screen">screen sharing</Radio.Button>
            </Radio.Group> */}
            <Tooltip placement="bottom" title="share">
              <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.videoSrcOnChange}> 
                <img className="custom-left-menu-icon" src={desktopIcon} style={{ width: '20px', height: '20px' }} />
              </Button>
            </Tooltip>
            <Tooltip placement="bottom" title="mic">
              <Button type="primary" size="large" style={{ marginLeft: '10px'}} onClick={this.micStatusOnChange}> 
                <img className="custom-left-menu-icon" src={micIcon} style={{ width: '20px', height: '20px' }} />
              </Button>
            </Tooltip>
            <Select defaultValue="lucy" style={{ width: 120 }} size="large">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
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