/* eslint-disable react/jsx-indent */
import React from 'react';
import logo from '@/assets/loginLogo.svg';
import faviconUtils from  '@/utils/faviconUtils'

class LoginLayout extends React.Component {

  componentDidMount(){
    faviconUtils();
  }

  render(){
    const { children } = this.props;

    return  <div className="custom-login-view">
              <div className="custom-login-logo-view">
                <img alt="logo" src={logo} className="custom-login-logo" />
              </div>
              <div className="custom-login-left">
                {children}
              </div>
            </div>;
  }
}

export default LoginLayout;
