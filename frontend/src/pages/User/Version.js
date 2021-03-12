import React, { PureComponent } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';

@connect(({ user, loading }) => ({
  user,
  loading,
}))
class Index extends PureComponent {
  state = {
    apiVersion: 'v0.0.0',
    backVersion: 'v0.0.0',
    frontVersion: 'v0.0.0',
  };

  componentDidMount() {
    const { user } = this.props;
    if (lodash.isEmpty(user.currentUser)) {
      this.initView();
    } else {
      this.refreshVersion();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    if (!lodash.isEqual(user.currentUser, prevProps.user.currentUser) && !lodash.isEmpty(user.currentUser)) {
      this.refreshVersion();
    }
  }

  initView = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getCurrent',
    });
  }

  refreshVersion = () => {
    const { user } = this.props;
    let currentUser = user.currentUser;
    if (!lodash.isEmpty(currentUser)) {
      let version = currentUser.version;
      let apiVersion = version.api;
      let backVersion = version.backend;
      // 前端版本直接从git中获取
      let frontVersion = gitTag;

      this.setState({
        apiVersion: apiVersion,
        backVersion: backVersion,
        frontVersion: frontVersion ? frontVersion : 'v0.0.0',
      });
    }
  }

  render() {
    return (<div>
      <p> Api Version: {this.state.apiVersion} </p>
      <p> Back - end Version: {this.state.backVersion} </p>
      <p> Front - end Version: {this.state.frontVersion} </p>
    </div>);
  }
}

export default Index;