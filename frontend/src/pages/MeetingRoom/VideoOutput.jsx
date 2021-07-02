import React from 'react';


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
        try {
          videoObj.play(); // safari浏览器如果禁止自动播放会 throw error
        } catch (error) {
          console.log("---", error);
        }
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
          try {
            videoObj.play(); // safari浏览器如果禁止自动播放会 throw error
          } catch (error) {
            console.log("---", error);
          }
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
        return <video ref={this.videoRef} width='100%' height={height} id={key} muted playsInline />;
      }
      // eslint-disable-next-line jsx-a11y/media-has-caption
      return <video ref={this.videoRef} width='100%' height={height} id={key} playsInline />;
    }
  }

export default VideoOutput;
