/* eslint-disable react/jsx-indent */
import React from 'react';
import { Layout, Icon } from 'antd';
import { connect } from 'dva';
import faviconUtils from  '@/utils/faviconUtils'
import disableSvg from '@/assets/disable.svg';
import Footer from './Footer';

const { Header, Content } = Layout;

@connect(({ meetingRoom }) => ({
  meetingRoom
}))
class LoginLayout extends React.Component {

  componentDidMount(){
    faviconUtils();
  }

  render(){
    const { children, meetingRoom: { nickname, accelerate }  } = this.props;

    return <Layout className="layout">
    <Header style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 'auto'}}>
      {
        accelerate ? <div style={{color: '#e8e8e8' }}> <img src={disableSvg} alt="" style={{ width: '20px', height: '20px' }} /> {" "}HDT</div> : <></>
      }
      {
        nickname ?<div style={{color: '#e8e8e8', marginLeft:'auto'}}> <Icon type="user" /> {nickname}</div> : <></>
      }
      
    </Header>
    <Content style={{ padding: '0 0px' }}>
        <div style={{ background: '#fff', padding: '10px 20px', minHeight: 100, textAlign: 'center' }}>{children}</div>
    </Content>
    <Footer />
           </Layout>
  }
}

export default LoginLayout;
