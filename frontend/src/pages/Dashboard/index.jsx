import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ report, loading, user }) => ({
  ...report, loading, user,
}))
class Dashboard extends PureComponent {
  

  render() {
    const topRightRadio =(<div />);

    return (
      <div>
        <PageHeaderWrapper topRightWrapper={topRightRadio}>
          <div className="custom-content-view">
            <p>hello</p>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Dashboard;
