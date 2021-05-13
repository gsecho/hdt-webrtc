/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import {Card, Result, Spin, Form } from 'antd'
import lodash from 'lodash'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './styles.less'

class VideoOutput extends React.Component {
  constructor(props) {
      super(props);
      this.videoRef = React.createRef();
  }

  componentDidMount() {
      const { video } = this.props
      if(video){
        const videoObj = this.videoRef.current;
        videoObj.srcObject = video;
        videoObj.play();
      }
  }

  render() {
    const {height} = this.props;
    return <video ref={this.videoRef} width='100%' height={height} />;
  }
}

@connect(({ loading, meetingRoom }) => ({
  loading, meetingRoom, 
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
  }

  getVideosWidth = () => (document.body.clientWidth-256-24*4);

  handleResize = () => {
    this.setState({
      videosWidth: this.getVideosWidth(),// 有效宽度
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

  render() {
    const { meetingRoom: {roomAuthed, maxMembers: total, members } } = this.props
    const {videosWidth} = this.state;
    // 我们这里的视频长宽比, 程序默认使用480*360
    const lengthWidthRatio = 16/9;

    const videos = []
    members.forEach( (member, i) => {
      if((!lodash.isEmpty(member)) && (!lodash.isUndefined(member.stream))){
        const video = {};
        video.src = member.stream;
        video.id = member.id;
        videos.push(video);
      }else{
        videos.push({'id': -200+i });
      }
    })

    for(let i=videos.length; i< total; i+=1){
      videos.push({'id': -100+i });
    }
    const flexInfo = this.getFlexDisplayInfo(videos.length);  
    const videoHeight = (videosWidth/lengthWidthRatio)/(flexInfo.columnNum);
  
    let pageBg;
    if (lodash.isUndefined(roomAuthed)){
      pageBg = <Spin spinning> </Spin>
    }else if (roomAuthed){
      if(!total){
        pageBg = <Spin spinning> </Spin>
      } else{
        pageBg=<div className="custom-content-view">
          <Card className="qtl-card" style={{ padding: '0px' }}>
            <div className='custom-video-grid'>
              {
                videos.map((video) => 
                  <div className="custom-videoflex" style={{  flexBasis: flexInfo.basis}}>
                    <VideoOutput 
                      key={video.id}
                      video={video.src} 
                      height={videoHeight}
                    />
                  </div>
                )
              }
            </div>
          </Card>
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
      <PageHeaderWrapper pageHeaderClass="no-border" childrenClass="custom-mt116">
        {pageBg}
      </PageHeaderWrapper>
    )
  }
}
export default MeetingRoom;