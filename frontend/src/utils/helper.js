import moment from 'moment';
import crypto from 'crypto';
import lodash from 'lodash';
import XLSX from 'xlsx';
import * as constants from './Constants';

// 单位进制为1000
const base = 1000;
// 单位进制为1024
const normalBase = 1024;


// 获取timezone 选项列表
export function getTimezoneOptionList() {
  const arr = [];
  for (let i = -12; i < 13; i+=1) {
    let obj = {};
    if (i >= 0) {
      obj = { text: `UTC+${  i}`, value: i };
    } else {
      obj = { text: `UTC${  i}`, value: i };
    }
    arr.push(obj);
  }
  return arr;
}

// 生成timezone
export function generateTimezoneText(timezone, preStr = 'UTC') {
  let res = preStr;
  if (timezone >= 0 && timezone < 10) {
    // res += '+0'+ timezone + ':00';
    res += `+${  timezone}`;
  } else if (timezone >= 10) {
    // res += '+'+ timezone + ':00';
    res += `+${  timezone}`;
  } else if (timezone > -10) {
    // res += '-0' + Math.abs(timezone) + ':00';
    res += `-${  Math.abs(timezone)}`;
  } else if (timezone <= -10) {
    res += timezone;
  }
  return res;
}



/**
 * 读取本地文件内容
 * @param  {[type]} file     file
 * @param  {[type]} function 回调函数
 */
export function readLocalFile(file, fun) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    if (content !== '' || content.length > 0) {
      const arr = content.split(',');
      // 文件内容，已base64加密
      const obj = arr[1];
      fun(obj);
    }
  };
  // 以DataURL的形式读取文件
  reader.readAsDataURL(file);
}

/**
 * 生成header参数
 * @param user
 * @param type   0表示生成proxyuser，1表示不生成proxyuser
 * @returns {{headers: {customerId: string, proxyCustomerId: string}}}
 */
export function generateRequestHeaders(user, type = 0) {
  let options = {
    headers: {
      customerId: '',
      proxyCustomerId: '',
    },
  };

  if (localMode === 'dev') {
    // 本地开发环境
    options.headers.customerId = '1';
    options.headers.proxyCustomerId = '5';
  } else {
    // 当前登录用户
    if (user && !lodash.isEmpty(user.currentUser)) {
      let h = {
        customerId: user.currentUser.cId,
      };
      // 授权用户
      if (!lodash.isEmpty(user.proxyUser) && type === 0) {
        h = {
          ...h,
          // proxyCustomerId: user.proxyUser.customerId,
          proxyCustomerId: user.proxyUser.cId,
        };
      }
      options = { ...options, headers: { ...options.headers, ...h } };
    }
  }

  return options;
}

// 首字母转大写
export function tranWord(str) {
  // 特殊处理
  if (str.toLowerCase() === 'band') {
    str = 'bandwidth';
  }
  return str.replace(/^\S/, (s) => s.toUpperCase());
}

// 生成y轴坐标单位显示，用于traffic、bandwidth
export function generateYaxisFomatterInKbps() {
  return function (value, index) {
    // 1 Byte = 8 bits
    // value = value * 8;
    if (value >= 0 && value < base) {
      return `${value  } bps`;
    } if (value < Math.pow(base, 2)) {
      return `${(value / base).toFixed(2)  } Kbps`;
    } if (value < Math.pow(base, 3)) {
      return `${(value / Math.pow(base, 2)).toFixed(2)  } Mbps`;
    } if (value < Math.pow(base, 4)) {
      return `${(value / Math.pow(base, 3)).toFixed(2)  } Gbps`;
    } if (value < Math.pow(base, 5)) {
      return `${(value / Math.pow(base, 4)).toFixed(2)  } Tbps`;
    } if (value < Math.pow(base, 6)) {
      return `${(value / Math.pow(base, 5)).toFixed(2)  } Pbps`;
    } if (value < Math.pow(base, 7)) {
      return `${(value / Math.pow(base, 6)).toFixed(2)  } Ebps`;
    } 
      return `${(value / Math.pow(base, 7)).toFixed(2)  } Zbps`;
    
  }
}

// 生成坐标单位显示，用于memory、storage
export function generateYaxisFomatterInKb() {
  return function (value, index) {
    if (value >= 0 && value < base) {
      return `${value  } byte`;
    } if (value < Math.pow(base, 2)) {
      return `${(value / base).toFixed(2)  } KB`;
    } if (value < Math.pow(base, 3)) {
      return `${(value / Math.pow(base, 2)).toFixed(2)  } MB`;
    } if (value < Math.pow(base, 4)) {
      return `${(value / Math.pow(base, 3)).toFixed(2)  } GB`;
    } if (value < Math.pow(base, 5)) {
      return `${(value / Math.pow(base, 4)).toFixed(2)  } TB`;
    } if (value < Math.pow(base, 6)) {
      return `${(value / Math.pow(base, 5)).toFixed(2)  } PB`;
    } if (value < Math.pow(base, 7)) {
      return `${(value / Math.pow(base, 6)).toFixed(2)  } EB`;
    } 
      return `${(value / Math.pow(base, 7)).toFixed(2)  } ZB`;
    
  }
}

// 生成Tooltip
export function generateTooltip(type, offset = 480) {
  const fun = transUnit;
  return function (params, ticket, callback) {
    if (params.length > 0) {
      // 时间转换
      const time = moment(params[0].value[0]).utcOffset(offset).format();
      let str = `${time  }<br />`;
      const mark = params.map((item, index) => {
        const v = fun(item.value[1], type);
        return `${item.marker + item.seriesName  }: ${  v  }<br />`;
      });
      str += mark.join('');
      return str;
    }
  }
}


// 单位转换
export function transUnit(value, type) {
  let res = '';
  switch (type) {
    case 'kb':
      if (value >= 0 && value < base) {
        res = `${value  } byte`;
      } else if (value < Math.pow(base, 2)) {
        res = `${(value / base).toFixed(2)  } KB`;
      } else if (value < Math.pow(base, 3)) {
        res = `${(value / Math.pow(base, 2)).toFixed(2)  } MB`;
      } else if (value < Math.pow(base, 4)) {
        res = `${(value / Math.pow(base, 3)).toFixed(2)  } GB`;
      } else if (value < Math.pow(base, 5)) {
        res = `${(value / Math.pow(base, 4)).toFixed(2)  } TB`;
      } else if (value < Math.pow(base, 6)) {
        res = `${(value / Math.pow(base, 5)).toFixed(2)  } PB`;
      } else if (value < Math.pow(base, 7)) {
        res = `${(value / Math.pow(base, 6)).toFixed(2)  } EB`;
      } else {
        res = `${(value / Math.pow(base, 7)).toFixed(2)  } ZB`;
      }
      break;
    case 'kbps':
      if (value >= 0 && value < base) {
        res = `${value  } bps`;
      } else if (value < Math.pow(base, 2)) {
        res = `${(value / base).toFixed(2)  } Kbps`;
      } else if (value < Math.pow(base, 3)) {
        res = `${(value / Math.pow(base, 2)).toFixed(2)  } Mbps`;
      } else if (value < Math.pow(base, 4)) {
        res = `${(value / Math.pow(base, 3)).toFixed(2)  } Gbps`;
      } else if (value < Math.pow(base, 5)) {
        res = `${(value / Math.pow(base, 4)).toFixed(2)  } Tbps`;
      } else if (value < Math.pow(base, 6)) {
        res = `${(value / Math.pow(base, 5)).toFixed(2)  } Pbps`;
      } else if (value < Math.pow(base, 7)) {
        res = `${(value / Math.pow(base, 6)).toFixed(2)  } Ebps`;
      } else {
        res = `${(value / Math.pow(base, 7)).toFixed(2)  } Zbps`;
      }
      break;
    default:
      res = value;
      break;
  }
  return res;
}

// 单位转换
export function transUnitInNormal(value, type) {
  let res = '';
  switch (type) {
    case 'kb':
      if (value >= 0 && value < normalBase) {
        res = `${value  } byte`;
      } else if (value < Math.pow(normalBase, 2)) {
        res = `${(value / normalBase).toFixed(2)  } KiB`;
      } else if (value < Math.pow(normalBase, 3)) {
        res = `${(value / Math.pow(normalBase, 2)).toFixed(2)  } MiB`;
      } else if (value < Math.pow(normalBase, 4)) {
        res = `${(value / Math.pow(normalBase, 3)).toFixed(2)  } GiB`;
      } else if (value < Math.pow(normalBase, 5)) {
        res = `${(value / Math.pow(normalBase, 4)).toFixed(2)  } TiB`;
      } else if (value < Math.pow(normalBase, 6)) {
        res = `${(value / Math.pow(normalBase, 5)).toFixed(2)  } PiB`;
      } else if (value < Math.pow(normalBase, 7)) {
        res = `${(value / Math.pow(normalBase, 6)).toFixed(2)  } EiB`;
      } else {
        res = `${(value / Math.pow(normalBase, 7)).toFixed(2)  } ZiB`;
      }
      break;
    case 'kbps':
      if (value >= 0 && value < normalBase) {
        res = `${value  } bps`;
      } else if (value < Math.pow(normalBase, 2)) {
        res = `${(value / normalBase).toFixed(2)  } Kbps`;
      } else if (value < Math.pow(normalBase, 3)) {
        res = `${(value / Math.pow(normalBase, 2)).toFixed(2)  } Mibps`;
      } else if (value < Math.pow(normalBase, 4)) {
        res = `${(value / Math.pow(normalBase, 3)).toFixed(2)  } Gibps`;
      } else if (value < Math.pow(normalBase, 5)) {
        res = `${(value / Math.pow(normalBase, 4)).toFixed(2)  } Tibps`;
      } else if (value < Math.pow(normalBase, 6)) {
        res = `${(value / Math.pow(normalBase, 5)).toFixed(2)  } Pibps`;
      } else if (value < Math.pow(normalBase, 7)) {
        res = `${(value / Math.pow(normalBase, 6)).toFixed(2)  } Eibps`;
      } else {
        res = `${(value / Math.pow(normalBase, 7)).toFixed(2)  } Zibps`;
      }
      break;
    default:
      res = value;
      break;
  }
  return res;
}

// 计算平均值
export function findAvgInfo(arr) {
  let sum = 0;
  let item = [];

  if (arr.length > 0) {
    arr.map((item, index) => {
      const a = item[1];
      const value = a[0];
      sum += value;
    });
    const avg = sum / arr.length;
    item = [new Date().getTime(), avg];
  }

  return item;
}

// 生成tooltip
export function generateTooltipForQuota(type) {
  const fun = transUnit;
  return function (params, ticket, callback) {
    let value = '';
    if (type === 'kb') {
      value = fun(params.value, 'kb');
    } else {
      value = params.value;
    }

    const {name} = params;
    const str = `${params.marker + name  }: ${  value}`;
    return str;
  }
}

// 根据当前时间，生成随机字符串
export function generateRandomStr() {
  const str = `${(new Date()).getTime()  }qtlcdn`;
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
}

// 转化interval参数
export function tranInterval(interval = '') {
  const res = {
    '1m': 'oneminute',
    '5m': 'fiveminutes',
    '1h': 'hourly',
    '24h': 'daily',
    '7d': 'weekly',
    '30d': 'monthly',
  };
  return res[interval];
}

// 根据时区转换时间字符串为moment对象
export function tranTimestrToMoment(timestr, timezone = 0) {
  let res = 0;
  let afterfix = '';
  if (timezone === 0) {
    afterfix = 'Z';
  } else if (timezone >= -9 && timezone <= -1) {
    afterfix = `-0${  timezone * -1  }:00`;
  } else if (timezone >= 1 && timezone <= 9) {
    afterfix = `+0${  timezone  }:00`;
  } else if (timezone > 0) {
    // 10, 11, 12
    afterfix = `+${  timezone  }:00`;
  } else {
    // -10, -11, -12
    afterfix = `${timezone  }:00`;
  }
  // 转时间戳
  res = moment(timestr + afterfix);
  return res;
}

// 根据时区转换时间字符串为时间戳
export function tranTimestrToTimestamp(timestr, timezone = 0) {
  const res = tranTimestrToMoment(timestr, timezone).unix();
  return res;
}

// 根据时区转换时间戳为时间字符串(带时区)
export function tranTimeToUtcStr(timestamp, timezone = 0, format = 'YYYY-MM-DD HH:mm:ss') {
  const utcOffset = timezone * 60;
  return `${moment(timestamp).utcOffset(utcOffset).format(format)  } ${  generateTimezoneText(timezone)}`;
}

// 根据时区转换时间戳为时间字符串
export function tranTimeToStr(timestamp, timezone = 0, format = 'YYYY-MM-DD HH:mm:ss') {
  const utcOffset = timezone * 60;
  return moment(timestamp).utcOffset(utcOffset).format(format);
}

// 根据时区转换时间字符串为UTC字符串
export function tranTimeStrToUtcStr(timeStr, timezone = 0, format = 'YYYY-MM-DD HH:mm:ss') {
  const time = tranTimestrToMoment(timeStr, timezone);
  return time.utc().format(format);
}


// 根据时区转换Moment为UTC字符串
export function tranMomentToUtcStr(moment, timezone = 0, resultFormat = 'YYYY-MM-DDTHH:mm:ss') {
  return tranTimeStrToUtcStr(moment.format('YYYY-MM-DD HH:mm:ss'), timezone, resultFormat);
}


// 导出excel
export function exportExcel(headers = [], data = [], fileName = '') {
  if (headers.length > 0 && data.length > 0) {
    const h = headers.map((v, i) => Object.assign({}, { v, position: String.fromCharCode(65 + i) + 1 }))
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

    const d = data.map((v, i) => {
      const arr = Object.entries(v);
      return arr.map((item, index) => ({ v: item[1], position: String.fromCharCode(65 + index) + (i + 2) }));
    }).reduce((prev, next) => prev.concat(next))
      .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
    // 合并 headers 和 data
    const output = Object.assign({}, h, d);
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围
    const ref = `${outputPos[0]  }:${  outputPos[outputPos.length - 1]}`;
    // 构建 workbook 对象
    const wb = {
      SheetNames: ['application vips'],
      Sheets: {
        'application vips': Object.assign({}, output, { '!ref': ref })
      }
    };
    // 导出 Excel
    if (fileName.length === 0) {
      fileName = generateRandomStr();
    }
    XLSX.writeFile(wb, `${fileName  }.xlsx`);
  }
}



/**
 * 检查request url 是否需要触发计时器刷新
 * @param url
 * @returns {boolean}  true表示需要刷新，false表示不需要刷新
 */
export function checkRequestUrlForTimer(url) {
  let res = true;
  const pat = /(.*)?\/rest\/user\/logout(.*)?/g;
  const flag = pat.test(url);
  res = !flag;
  return res;
}

// 检查窗口大小
export function checkWindow() {
  let winWidth = 0;
  if (window.innerWidth) {
    winWidth = window.innerWidth;
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
  } else if (document.documentElement && document.documentElement.clientWidth) {
    winWidth = document.documentElement.clientWidth;
  }

  if (winWidth.valueOf() <= 1200) {
    // 触发事件
    window.dispatchEvent(new Event('resize'));
  }
}

// 获取浏览器窗口可视区域高度，不包括滚动条
export function getWindowHeight() {
  let height = 0;
  if (window.innerHeight) {
    height = window.innerHeight;
  } else if (document.body && document.body.clientHeight) {
    height = document.body.clientHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) {
    height = document.documentElement.clientHeight;
  }

  return height;
}

/**
 * 根据域名生成文本
 * @param type          0表示大写，1表示全小写
 * @returns {string}
 */
export function generateHostNameText(type = 0) {
  let res = type?'cdnetworks':'CDNetworks';

  const {hostname} = window.location;
  if (hostname.indexOf('.quantil.') !== -1) {
    if (type === 0) {
      res = 'Quantil';
    }
    if (type === 1) {
      res = 'quantil';
    }
  }
  if (hostname.indexOf('.cdnetworks.') !== -1) {
    if (type === 1) {
      res = 'cdnetworks';
    }
  }

  return res;
}

// 返回顶部
export function backTop() {
  if (document.documentElement && document.documentElement.scrollTop) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
}

// 返回底部
export function backBottom(top = 0) {
  if (document.documentElement && document.documentElement.scrollTop) {
    const sh = document.documentElement.scrollTop + top - 120;
    document.documentElement.scrollTop = sh;
  }
  if (document.body) {
    const sh = document.body.scrollTop + top - 120;
    document.body.scrollTop = sh;
  }
}

// 设置wizard form 缓存数据
export function saveWizardFormInStorage(props, changedValues, allValues) {
  const obj = { ...allValues };
  sessionStorage.setItem('wizardForm', JSON.stringify(obj));
}

// 获取wizard form 缓存数据
export function getWizardFormInStorage() {
  const str = sessionStorage.getItem('wizardForm');
  let res = '';
  if (str && str.length > 0) {
    res = JSON.parse(str);
  }
  return res;
}

// 获取wizard state 缓存
export function getWizardStateInStorage() {
  const str = sessionStorage.getItem('wizardState');
  let res = {};
  if (str && str.length > 0) {
    res = JSON.parse(str);
  }
  return res;
}

// 计算滚动条偏移量
export function calcScrollTop(itemLen = 0, delLen = 0) {
  let res = 0;
  if (!Number.isNaN(itemLen) && !Number.isNaN(delLen)) {
    res = (itemLen - delLen - 1) * 40
  }
  return res;
}

// // 生成version
// export function generateVersion() {
//   let res;
//   if (typeof (gitIsTagDirty) !== "undefined") {
//     res = `v1.0.0-${  gitVersion }`;
//   } else if (typeof (gitTag) !== "undefined") {
//       res = gitTag;
//     } else {
//       // 有tag存在
//       res = `v${  new Date().getTime}`;
//     }
//   return res;
// }

/**
 * 设置step 当前状态
 * @param step
 * @param state   状态，true表示完成已通过校验，false表示未完成未通过校验
 */
export function setStepInStorage(step = 0, state = true) {
  const key = 'stepState';
  const str = sessionStorage.getItem(key);
  let arr = [];
  if (str && str.length > 0) {
    arr = JSON.parse(str);
    arr[step] = state;
  } else {
    arr[step] = state;
  }

  sessionStorage.setItem(key, JSON.stringify(arr));
}

/**
 * 获取step 当前状态
 * @param step
 * @returns {boolean}  true表示完成已通过校验，false表示未完成未通过校验
 */
export function getStepInStorage(step = 0) {
  let res = false;
  const key = 'stepState';
  const str = sessionStorage.getItem(key);

  if (str && str.length > 0) {
    const arr = JSON.parse(str);
    res = arr[step];
  }

  return res;
}

// 获取自定义前端过期时间
export function getLogoutTimeInStorage() {
  let res = sessionStorage.getItem('userLogout');
  if (!isNaN(res)) {
    res = parseInt(res);
  }
  return res;
}

/**
 * 设置自定义前端过期时间
 * @param currentUser    当前登录用户信息
 */
export function setLogoutTimeInStorage(currentUser) {
  if (!lodash.isEmpty(currentUser)) {
    const oldV = getLogoutTimeInStorage();
    const newV = currentUser.logoutIdleTime;

    if (!lodash.isEqual(oldV, newV)) {
      sessionStorage.setItem('userLogout', parseInt(newV, 10));
    }
  }
}

// 合并数组，去除重复元素
export function mergeKeys(oldArr = [], newArr = []) {
  const res = [...oldArr];
  if (newArr.length > 0) {
    newArr.map((item, index) => {
      if (oldArr.indexOf(item) === -1) {
        res.push(item);
      }
    });
  }

  return res;
}

// ----------------------------------检查IP列表 start---------------------------------------------------

const IPV4_SEGMENT_TEST = /^(((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))-)?((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
const IPV4_TEST = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
const IPV4_RANGE_TEST = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\/([0-9]|[1-2]\d|3[0-2])$/

const IPV6_TEST = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
const IPV6_RANGE_TEST = /^(([a-f0-9]{0,4}:){0,7}[::]{0,1}[a-f0-9]{0,4})\/\d{0,3}$/;

// 检查IPV4列表
export function checkIpv4List(ipList) {
  if (ipList) {
    const arr = ipList.split(constants.separator);
    for (let i = 0; i < arr.length; i+=1) {
      const ipStr = arr[i];
      if (ipStr && !IPV4_TEST.test(ipStr) && !IPV4_SEGMENT_TEST.test(ipStr) && !IPV4_RANGE_TEST.test(ipStr)) {
        return false;
      }
    }
  }
  return true;
}


// 检查IPV6列表
export function checkIpv6List(ipList) {
  if (ipList) {
    const arr = ipList.split(constants.separator);
    for (let i = 0; i < arr.length; i++) {
      if (!IPV6_TEST.test(arr[i]) && !IPV6_RANGE_TEST.test(arr[i])) {
        return false;
      }
    }
  }
  return true;
}

// 黑白名单  混合
export function checkMaxList(ipList) {
  if (ipList) {
    const arr = ipList.split(constants.separator);
    for (let i = 0; i < arr.length; i+=1) {
      if (!IPV4_TEST.test(arr[i]) && !IPV4_SEGMENT_TEST.test(arr[i]) &&
        !IPV4_RANGE_TEST.test(arr[i]) && !IPV6_TEST.test(arr[i]) && !IPV6_RANGE_TEST.test(arr[i])) {
        return false;
      }
    }
  }
  return true;
}

// 检查是否是单个IP
export function checkIp(ip) {
  if (ip) {
    if (!IPV4_TEST.test(ip) && !IPV6_TEST.test(ip)) {
      return false;
    }
  }
  return true;
}

// ----------------------------------检查IP列表 end---------------------------------------------------

// 去掉对象中的空元素
export function trimObject(object = {}) {
  const res = {};
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (typeof value === 'string' && value.trim().length === 0) {
      // empty
    } else if (value !== undefined && value != null) {
      res[key] = value;
    }
  });
  return res;
}