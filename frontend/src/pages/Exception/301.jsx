import React, { PureComponent } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';


@connect()
class Exception301 extends PureComponent {
  state = {
    url: '',
    timer: '',
  };

  componentDidMount() {
    let str = sessionStorage.getItem('user');
    let user = JSON.parse(str);
    const { dispatch } = this.props;

    if (!lodash.isEmpty(user)) {
      let logoutUrl = user.logoutUrl;
      this.setState({ url: logoutUrl });
      // 清空登录信息
      dispatch({
        type: 'user/logout'
      }).then((resp) => {
        // 跳转
        window.location.href = logoutUrl;
      });
    } else {
      // 通过发送请求的方式让页面重定向
      dispatch({
        type: 'user/logout'
      });
    }

    // 设置定时器
    let t = setTimeout(() => {
      // 清空登录信息
      const { dispatch } = this.props;
      dispatch({
        type: 'user/logout'
      });
    }, 3000);
    this.setState({ timer: t });
  }

  componentWillUnmount() {
    // 销毁定时器
    const { timer } = this.state;
    if (timer != '') {
      clearTimeout(timer);
    }
  }

  render() {
    return (
        <QtlException
          errCode="Session Expired"
          codeStyle={{ fontSize: '60px', lineHeight: 1.61 }}
          errText='Notice'
          showBack={false}
          showContact={false}
          showRelogin={true}
          logoutUrl={this.state.url}
          errMessage={formatMessage({ id: 'app.exception.description.301' })}
        />
    );
  }
}

export default Exception301;
