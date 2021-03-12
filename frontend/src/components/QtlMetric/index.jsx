import React, { Fragment, PureComponent } from 'react';
import { Radio, Spin, Tooltip, Icon, Button } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import QtlEchart from '@/components/QtlEchart';
import * as helper from '@/utils/helper';
import * as chartUtil from '@/utils/chart';
import logo from '@/assets/noData.svg';
import style from './qtlMetric.less';
import { rangeTypeList } from '@/utils/Constants';
import router from 'umi/router';
import { connect } from "dva";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ user }) => ({
  user,
}))
export default class QtlMetric extends PureComponent {
  initData = {
    options: {
      color: ['#4dc6c2', '#223B4A', '#FFA908'],
      // 图表标题
      title: {},
      // 提示框
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(245, 245, 245, 0.85)',
        borderWidth: 1,
        borderColor: '#58c2be',
        textStyle: {
          color: '#000'
        },
        padding: [15, 10, 15, 10],
        axisPointer: {
          type: 'cross',
          label: {
            show: false,
          },
        },
      },
      // 图例
      legend: {
        bottom: 0,
      },
      // 网格
      grid: [{
        left: '3%',
        right: '6%',
        bottom: 35,
        top: 10,
        containLabel: true,
      }],
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: ['#e6e6e6'],
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      // 数据
      series: [],
    },

    styles: {
      width: '100%',
      height: this.props.height || '250px',
    },
  };

  // 合并
  generateOption = () => {
    // 生成tooltip和yAxis formatter
    const { data, type, user: { timezone } } = this.props;
    if (lodash.isEmpty(data)) {
      return {};
    }

    let offset = timezone * 60;
    if (!lodash.isEmpty(this.props.formParams)) {
      let timezone = this.props.formParams.timezone;
      offset = timezone * 60;
    }

    let tooltipFun;
    let yAxisFun;
    switch (type) {
      case 'band':
        tooltipFun = helper.generateTooltip('kbps', offset);
        yAxisFun = helper.generateYaxisFomatterInKbps();
        break;
      case 'traffic':
        tooltipFun = helper.generateTooltip('kb', offset);
        yAxisFun = helper.generateYaxisFomatterInKb();
        break;
      default:
        tooltipFun = helper.generateTooltip('', offset);
        break;
    }

    let newOptions = { ...this.initData.options }

    if (tooltipFun) {
      newOptions = { ...newOptions, tooltip: { ...newOptions.tooltip, formatter: tooltipFun } };
    }
    if (yAxisFun) {
      let axisLabel = { ...newOptions.yAxis.axisLabel, formatter: yAxisFun };
      let yAxis = { ...newOptions.yAxis, axisLabel: axisLabel };
      newOptions = { ...newOptions, yAxis: yAxis };
    }

    newOptions.series = chartUtil.generateSeries(type, data)
    return newOptions;
  };


  handleDurationChange = (e) => {
    let type = e.target.value;
    const { endTime, startTime, interval } = chartUtil.generateSearchTimeRange(type);
    // 调用
    const { onDurationChange } = this.props;
    if (onDurationChange) {
      onDurationChange(startTime, endTime, interval);
    }
  };

  render() {
    const { title, type, loading = false, virDom, size, ...restProps } = this.props;
    let newOptions = this.generateOption();

    return (
      <Fragment>

        <div className={size === "small" ? `custom-graph-view ${style.small}` : "custom-graph-view"} >
          <div className="custom-graph-title custom-graph-metrictile custom-mb24">
            {title}
            {this.props.hideFullBtn ? '' : <Tooltip placement="bottom" title="View Full Report">
              <Button size='small' shape="circle" icon="right" onClick={() => router.push('/reports?type=' + type)} />
            </Tooltip>}
          </div>
          <Spin spinning={loading}>
            {this.props.onDurationChange ? <div className="custom-graph-btn custom-mb16">
              <RadioGroup onChange={this.handleDurationChange} defaultValue="last24h" size="small">
                {rangeTypeList.map(item => (
                  <RadioButton key={item} value={item}>{formatMessage({ id: `report.btn.${item}` })}</RadioButton>
                ))}
              </RadioGroup>
            </div> : ''}
            <QtlEchart options={newOptions} virDom={virDom} {...restProps} styles={this.initData.styles} />
            {!loading && lodash.isEmpty(newOptions.series) ? <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <img src={logo} />
              <p>No Data</p>
            </div> : ''}
          </Spin>
        </div >
      </Fragment >
    );
  }

}
