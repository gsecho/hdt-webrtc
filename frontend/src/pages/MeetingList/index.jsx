/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import {Card, Result, Spin} from 'antd'
import lodash from 'lodash'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MeetingGrid from './components/MeetingGrid'
import styles from './styles.less'


@connect(({ loading, meetingList }) => ({
  loading, meetingList,
}))
class MeetingList extends React.Component {

  state = {
    columnCount: 4, // 默认设置四列，有需要可以动态调整
  }

  componentDidMount(){
    const {dispatch } = this.props
    // 查询前6后24小时的会议
    dispatch({
        type: 'meetingList/readList',
        prev: 6,
        next: 24,
    })
  }

  render() {
    const { columnCount } = this.state;
    const { loading, meetingList: {data: {list: currentList}} } =  this.props;
    let readListFlag = loading.effects["meetingList/readList"]; // 标志:  false表示异步动作结束，监听已取消
    if(lodash.isUndefined(readListFlag)){
      readListFlag = true
    }
    // console.log(readListFlag, currentList);
    let resultDisplay;
    let gridDisplay;
    if(readListFlag){
      resultDisplay = 'none';
      gridDisplay = 'none';
    }else if(currentList && currentList.length !== 0){
      resultDisplay = 'none';
      gridDisplay = 'block';
    }else{
      resultDisplay = 'block';
      gridDisplay = 'none';
    }
    // console.log(readListFlag, resultDisplay, gridDisplay);
    return(
      <PageHeaderWrapper pageHeaderClass="no-border" childrenClass="custom-mt116">
        <div className="custom-content-view">
          <Card className="qtl-card">
            <div className="custom-content-view">
              <Spin spinning={readListFlag} size='large' delay='300'>
                <div className="custom-meeting-card">
                  <Result 
                    style={{ height: '70vh', display: resultDisplay }}
                    status="500"
                    title="Hi,"
                    subTitle="you don't having meeting."
                  />
                  <MeetingGrid 
                    columnCount={columnCount} 
                    data={currentList} 
                    style={{ display: gridDisplay }}
                  />
                </div>
              </Spin>
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default MeetingList;