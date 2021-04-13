/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MeetingTable from './meetingTable'

@connect(({ loading, user }) => ({
    loading, user,
}))
class MeetingManager extends React.Component {
    
      render() {
        return (
          <div>
            <PageHeaderWrapper pageHeaderClass="no-border" childrenClass="custom-mt116">
              <div className="custom-content-view">
                <MeetingTable />
              </div>
            </PageHeaderWrapper>

          </div>
        )
      }
}
export default MeetingManager;