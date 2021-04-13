import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Radio } from 'antd';
// import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import QtlMetric from '@/components/QtlMetric';
import * as chartUtil from '@/utils/chart';
import { rangeTypeList, vplList } from '@/utils/Constants';
import VplPopup from '@/components/VplPopup';
import styles from './styles.less'

@connect(({ report, loading, user }) => ({
  ...report, loading, user,
}))
class Dashboard extends PureComponent {
  bandwidthMetric = []

  trafficMetric = []

  requestsMetric = []

  constructor(props) {
    super(props);
    this.state = {
      searchVpl: false,
      vpl: '',
    };
  }

  

  componentDidMount() {
    // const { user } = this.props;
    // if (hdtAuthority.checkCurrent(user.currentUser)) {
    //   this.initView();
    // }
  };

  componentDidUpdate(prevProps) {
    // const { user } = this.props;
    // const { searchVpl } = this.state;
    // if (hdtAuthority.isUserChange(user, prevProps.user)) {
    //   if (!user.useVPL && searchVpl) {
    //     this.setVpl(false)
    //   } else {
    //     this.initView();
    //   }
    // }
  }

  initView = () => {
    const { dispatch, user: { timezone } } = this.props;
    const { vpl } = this.state;
    // 默认获取最近24h的数据
    const timeRange = chartUtil.generateSearchTimeRange(rangeTypeList[0]); // 24h

    // trafficAndBand
    dispatch({
      type: 'report/getTrafficAndBand',
      payload: { ...timeRange, timezone, vpl },
    })

    dispatch({
      type: 'report/getRequests',
      payload: { ...timeRange, timezone, vpl },
    })
  };

  // 刷新memory metric
  handleDurationChangeForTraffic = (startTime, endTime, interval) => {
    const { dispatch, user: { timezone } } = this.props;
    const { vpl: tVpl } = this.state;
    dispatch({
      type: 'report/getTraffic',
      payload: {
        startTime, endTime, interval, timezone, vpl: tVpl
      },
    })
  }

  // 刷新memory metric
  handleDurationChangeForBand = (startTime, endTime, interval) => {
    const { dispatch, user: { timezone } } = this.props;
    dispatch({
      type: 'report/getBandwidth',
      payload: {
        startTime, endTime, interval, timezone, vpl: this.state.vpl
      },
    })
  }

  // 刷新memory metric
  handleDurationChangeForRequests = (startTime, endTime, interval) => {
    const { dispatch, user: { timezone } } = this.props;
    dispatch({
      type: 'report/getRequests',
      payload: {
        startTime, endTime, interval, timezone, vpl: this.state.vpl
      },
    })
  }

  handleVplChange = e => {
    const searchVpl = e.target.value;
    this.setVpl(searchVpl);
  }

  setVpl = searchVpl => {
    let vpl = '';
    if (searchVpl) {
      vpl = Object.keys(vplList)[0];
    }
    this.setState({ searchVpl, vpl }, () => {
      this.initView();
    });
  }

  render() {
    const { loading, user: { useVPL } } =  this.props;
    const {searchVpl } = this.state
    const trafficLoading = loading.effects["report/getTraffic"] || loading.effects["report/getTrafficAndBand"];
    const bandLoading = loading.effects["report/getBandwidth"] || loading.effects["report/getTrafficAndBand"];
    const requestLoading = loading.effects["report/getRequests"];

    // const topRightRadio = (
    //   <VplPopup disabled={useVPL}>
    //     <Radio.Group className={styles.radio} value={searchVpl} buttonStyle="solid" onChange={this.handleVplChange} disabled={!useVPL}>
    //       <Radio.Button value={false}>{formatMessage({ id: 'report.btn.total' })}</Radio.Button>
    //       <Radio.Button value>{formatMessage({ id: 'report.btn.vpl' })}</Radio.Button>
    //     </Radio.Group>
    //   </VplPopup>);
    const topRightRadio =(<div />);

    return (
      <div>
        <PageHeaderWrapper topRightWrapper={topRightRadio}>
          <div className="custom-content-view">
            <Card bordered={false} className="custom-card-nobg">
              <Row gutter={16}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24} className="custom-graph-mb16">
                  <div className="custom-graph-bg">
                    <QtlMetric type="band" virDom={this.bandwidthMetric} loading={bandLoading} onDurationChange={this.handleDurationChangeForBand} title={formatMessage({ id: 'report.list.label.bandwidth' })} data={this.props.bandData} />
                  </div>
                </Col>
              </Row>
            </Card>
            <Card bordered={false} className="custom-card-nobg" style={{ 'marginTop': '16px' }}>
              <Row gutter={16}>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                  <div className="custom-graph-bg custom-mb8">
                    <QtlMetric size="small" type="traffic" loading={trafficLoading} virDom={this.trafficMetric} onDurationChange={this.handleDurationChangeForTraffic} title={formatMessage({ id: 'report.list.label.trafficVolume' })} data={this.props.trafficData} />
                  </div>
                </Col>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                  <div className="custom-graph-bg custom-mb8">
                    <QtlMetric size="small" type="requests" loading={requestLoading} virDom={this.requestsMetric} onDurationChange={this.handleDurationChangeForRequests} title={formatMessage({ id: 'report.list.label.requests' })} data={this.props.requestData} />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Dashboard;
