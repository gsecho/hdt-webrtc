/*
 * @Author: chenrf
 * @Date: 2021-04-22 09:38
 */
import moment from 'moment'

/**
 *   对moment简单封装，方便使用（与后台交互的数据都使用utc时间）
 */
// 统一使用格式
const defaultDateFormat = 'YYYY-MM-DD HH:mm:ss';// 大写是HH是24小时制，hh是12小时制

/**
 * 得到utc时间
 * return 时间字符串 比如：2021/04/23 06:43:45
 */
export function getUtcString(format=defaultDateFormat){
    return moment.utc().format(format);
}

export function converMomentToFomatString(rawMoment ,format=defaultDateFormat){
    return rawMoment.format(format)
}

/**
 * 传入本地moment时间，生成 utc时间字符串返回
 */
export function momentToUtcString(rawMoment, format=defaultDateFormat){
    const curZoneOffsetMin = rawMoment.utcOffset();  // 这个得到的是分钟数
    rawMoment.utcOffset(0)
    const currentTime = rawMoment.format(format)
    rawMoment.utcOffset(curZoneOffsetMin) // 恢复时区
    return currentTime
}

/**
 * 传入utc时间转成目标时区时间
 * utcTime： 时间字符串
 * dstTimeZone 目标时区 东八区（+8），西八区（-8）
 */
export function convertUtcStringToZoneString(utcTime, dstTimeZone, format=defaultDateFormat){
    const zoneMoment = convertUtcStringToZoneMoment(utcTime, dstTimeZone, format=defaultDateFormat)
    return zoneMoment.format(format);
}

export function convertUtcStringToZoneMoment(utcTime, dstTimeZone, format=defaultDateFormat){
    const tempMoment = moment.utc(utcTime, format);
    // utcOffset 如果输入小于 16 且大于 -16，则会将输入解释为小时
    tempMoment.utcOffset(dstTimeZone*60);
    return tempMoment;
}

/**
 * localTime: 字符串
 * dstTimeZone: 目标时区，比如东八区（+8），西八区（-8）
 * 本地时间转换到目标时区
 */
export function convertLocalStringToUtcString(localTime, dstTimeZone, format=defaultDateFormat){
    const curZoneOffsetMin = moment().utcOffset();  // 这个得到的是分钟数
    const dstZoneOffsetMin =  dstTimeZone*60;
    const dtMin = dstZoneOffsetMin-curZoneOffsetMin;// 得到相差时间
    return moment(localTime).utcOffset(dtMin).format(format);
}

export function convertLocalStringToUtcMoment(localTime, dstTimeZone, format=defaultDateFormat){
    const curZoneOffsetMin = moment().utcOffset();  // 这个得到的是分钟数
    const dstZoneOffsetMin =  dstTimeZone*60;
    const dtMin = dstZoneOffsetMin-curZoneOffsetMin;// 得到相差时间
    return moment(localTime).utcOffset(dtMin).format(format);
}

export function convertUtcStringToLocalMoment(utcString, format=defaultDateFormat){
    const tempMoment = moment.utc(utcString, format);
    const curZoneOffsetMin = moment().utcOffset();  // 这个得到的是分钟数
    tempMoment.utcOffset(curZoneOffsetMin);
    return tempMoment;
}

export function convertUtcStringToLocalString(utcString, format=defaultDateFormat){
    const tempMoment = convertUtcStringToLocalMoment(utcString, format);
    return tempMoment.format(format);
}


