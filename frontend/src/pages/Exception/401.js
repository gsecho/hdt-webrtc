import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Exception401 extends PureComponent {
  componentDidMount() {
    let str = sessionStorage.getItem('user');
    console.log(str);
    let user = JSON.parse(str);
    let logoutUrl = user && user.logoutUrl;
    // 清空登录信息
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout'
    });
    // 跳转
    // window.location.href = encodeURI(logoutUrl);
    logoutUrl && (window.location.href = logoutUrl);
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default Exception401;
