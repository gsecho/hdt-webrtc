import React from 'react';
import { formatMessage } from 'umi/locale';
import logo from '@/assets/loginLogo.svg';

const LoginLayout = ({ children }) => {
  return <div className="custom-login-view">
    <div className="custom-login-logo-view">
      <img alt="logo" src={logo} className="custom-login-logo"/>
    </div>

    <div className="custom-login-left">
      {children}
    </div>
  </div>;
};


export default LoginLayout;
