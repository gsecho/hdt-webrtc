/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import { parse, stringify } from 'qs';


export function getPageQuery(value) {
    const paramConst = "service";
    // var str = "?service=https://myrtc.com:18010/p/meetingroom?id=6&&pwd=fd651518-2049-458c-9415-a4d05fa9ec69";
    const index = value.indexOf(paramConst)
    return value.substring(index+paramConst.length+1)
  // return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}



/**
 * meeting的持续时间换成index,放这里其实不合适 TODO
 * @param {*} value 
 */
export function meetingDurationToIndex(value){
  const index = value / 60;
  return index;
}
export function meetingDurationIndexToMin(index){
  if(index === 0){
    return 30;
  }
    return index*60;
}





