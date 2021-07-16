/* eslint-disable react/jsx-indent */
import React from 'react';
import { Layout } from 'antd';
import faviconUtils from  '@/utils/faviconUtils'
import Footer from './Footer';

const { Header, Content } = Layout;

class LoginLayout extends React.Component {

  componentDidMount(){
    faviconUtils();
  }

  render(){
    const { children } = this.props;

    return <Layout className="layout">
    <Header>
      <div className="logo" />
    </Header>
    <Content style={{ padding: '0 50px' }}>
  <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center' }}>{children}</div>
    </Content>
    <Footer />
           </Layout>
  }
}

export default LoginLayout;
