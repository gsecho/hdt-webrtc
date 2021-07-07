import React from 'react';

class VideoOutput extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.streamIdRef = React.createRef();
    }
  
    componentDidMount() {
      const { video, controls, muted } = this.props
      if(video && video.active){
        const videoObj = this.videoRef.current;
        this.streamIdRef.current = video.id;
        videoObj.srcObject = video;
        videoObj.controls = controls;
        videoObj.muted = {muted};

        videoObj.play()
          .catch(error => {
            // safari浏览器如果禁止自动播放会 throw error
            // chrome部分版本也会
            // 如果audio和video都被禁止了，也就是浏览器认为没有交互，也会报错
            console.log("---error:", error);
            // message.error('audio/video play failed!')  
          }); 
      }
    }
  
    componentDidUpdate(){
      const { video } = this.props
      if(video && video.active){
        if(this.streamIdRef.current !== video.id){
          this.streamIdRef.current = video.id
  
          const videoObj = this.videoRef.current;
          videoObj.srcObject = video;
          videoObj.load();
          // try {
          //   videoObj.play(); // safari浏览器如果禁止自动播放会 throw error
          // } catch (error) {
          //   console.log("---", error);
          // }
          videoObj.play()
            .catch(error => {
              console.log("---error:", error);
              // message.error('failed:', error)
            });
        }
      }
    }
    
    render() {     
      let {height} = this.props;
      if(!height){
        height = 10
      }

      // if(muted){
      //   videoElement=<video ref={this.videoRef} width='100%' height={height}  playsInline />;
      // }
      // eslint-disable-next-line jsx-a11y/media-has-caption
      return <video ref={this.videoRef} width='100%' height={height} playsInline />;
      
    }
  }

export default VideoOutput;
