import React from 'react';
import Media from 'react-media';
// 引入自定义样式
import '@/styles/qtlcommon.less';
import '@/styles/ng.less';
import { connect } from "dva";

class BlankLayout extends React.Component {

  render() {
    const {
      children,
    } = this.props;

    return (
      <div>{children}</div>
    );
  }
}

export default connect(({ user, loading }) => ({
  user,
  loading,
}))(props => (
  <Media query="(max-width: 599px)">
    {() => <BlankLayout {...props} />}
  </Media>
));
