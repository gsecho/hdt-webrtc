import { rangeTypeList } from '@/utils/Constants';
import moment from 'moment';
import lodash from 'lodash';

// 生成Series
export function generateSeries(type, data) {
  const series = [];
  const template = {
    type: 'line',
    symbol: 'none',
  };

  if (data) {
    switch (type) {
      case 'traffic':
      case 'band':
        series.push(
          {
            ...template,
            name: 'Incoming',
            data: data.download || [],
            areaStyle: {}
          },
          {
            ...template,
            name: 'Outgoing',
            data: data.upload || [],
            areaStyle: {}
          }, {
          ...template,
          name: 'Total',
          data: data.total || [],
        }
        );
        break;
      case 'requests':
        series.push(
          {
            ...template,
            name: 'Total',
            data: data.total || [],
            areaStyle: {}
          }, {
          ...template,
          name: 'Success',
          data: data.success || [],
          areaStyle: {}
        }
        );
        break;
    }
  }

  return series;
}

/**
 * 根据range type 获取搜索时间区间
 */
export function generateSearchTimeRange(type, aheadTime = - 1000 * 60 * 10) {//默认取10分钟前
  let end = (new Date()).getTime() + aheadTime;
  let endTime = moment(end).utc().format();
  let start = 0;
  let interval = '';

  switch (type) {
    case rangeTypeList[0]://'last 24 hours'
      start = parseInt(end) - 1000 * 24 * 3600;
      interval = '5m';
      break;
    case rangeTypeList[1]://last 7 days
      start = parseInt(end) - 7 * 1000 * 24 * 3600;
      interval = '1h';
      break;
    case rangeTypeList[2]://last month
      start = parseInt(end) - 30 * 1000 * 24 * 3600;
      // 转换成utc时间 rfc3339
      interval = '24h';
      break;
  }
  start = start + aheadTime;
  const startTime = moment(start).utc().format();
  return { startTime, endTime, interval, start, end }
}


export function tranInterval(interval = '') {
  const oneMin = 60
  let res = {
    '1m': { interval: 'oneminute', intervalSecond: oneMin },
    '5m': { interval: 'fiveminutes', intervalSecond: oneMin * 5 },
    '1h': { interval: 'hourly', intervalSecond: oneMin * 60 },
    '24h': { interval: 'daily', intervalSecond: oneMin * 60 * 24 },
    '7d': { interval: 'weekly', intervalSecond: oneMin * 60 * 24 * 7 },
    '30d': { interval: 'monthly', intervalSecond: oneMin * 60 * 24 * 30 },
  };
  return res[interval];
}

// 快速设置日期
export function setRange(type, time) {

  // 获取已有时间范围
  let start = '';
  let end = '';
  if (!lodash.isEmpty(time)) {
    start = time[0];
    end = time[1];
  }
  // 新的表单参数
  let startTime = '';
  let endTime = '';

  switch (type) {
    // 当前月，不能超过当天
    case 'now':
      startTime = moment().startOf('month');
      endTime = moment().endOf('day');
      break;
    // 往前一个月
    case 'prev':
      if (lodash.isEmpty(time)) {
        // 表单参数不存在
        startTime = moment().subtract(1, 'M').startOf('month');
        endTime = moment().subtract(1, 'M').endOf('month');
      } else {
        // 表单参数存在
        startTime = start.subtract(1, 'M').startOf('month');
        endTime = end.subtract(1, 'M').endOf('month');
      }
      break;
    // 往后一个月，不得超过当前月
    case 'next':
      let nowDay = moment().unix();
      let nowMonth = moment().month();
      let nowYear = moment().year();

      if (!lodash.isEmpty(start) && !lodash.isEmpty(end) && ((start.year() === nowYear && start.month() < nowMonth) || (start.year() < nowYear))) {
        startTime = start.add(1, 'M').startOf('month');
        let tmp = end.add(1, 'M').endOf('month');
        endTime = tmp.unix() < nowDay ? tmp : moment().endOf('day');
      }
      break;
  }

  return { startTime, endTime };
}
