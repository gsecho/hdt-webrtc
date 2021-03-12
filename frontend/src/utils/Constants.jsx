import moment from 'moment';
import styles from '@/styles/module.less';


// 获取metric 选项列表
export const statusList = (() => [
    { text: <div className={styles.statusDot}><div className={styles.grey}></div>Suspended</div>, value: 0, name: 'suspended', oper: 'Activate' },
    { text: <div className={styles.statusDot}><div className={styles.green}></div>Active</div>, value: 1, name: 'active', oper: 'Suspend' },
])();

// 获取报表时间类型 选项列表
export const rangeTypeList = (() => ['last24h', 'last7d', 'last30d'])();

export const authRangeData = (() => ({
    'self+children': { text: 'All', reportText: 'This Account + Children Account' },
    'self-only': { text: 'This Account', reportText: 'This Account only' },
    'children-only': { text: 'Children Account', reportText: 'Children Account only' },
}))();

// 获取transport 端口复用选项列表
export const transProtocolTypeList = (() => ({
    '': { text: 'All' },
    'http': { text: 'HTTP' },
    'https': { text: 'HTTPS' },
}))();

export const useStandardPortList = (() => ({
    'http': { text: 'HTTP', available: true },
    'sni': { text: 'HTTPS', available: true },
    'https': { text: 'HTTPS without sni', available: false },
    'ftp': { text: 'FTP', available: false },
    ' ': { text: 'Others', available: false },
}))();

export const layerProtocolList = (() => ({
    '0': { text: 'TCP' },
    '1': { text: 'UDP' },
    '2': { text: 'Both' },
}))();

export const noYesList = (() => [
    { text: 'No', value: 0 },
    { text: 'Yes', value: 1 },

])();

export const yesNoList = [...noYesList].sort((item1, item2) => item1.value > item2.value ? -1 : 1);

// 获取metric 选项列表
export const metricOptionList = (() => [
    { text: 'Bandwidth', value: 'band' },
    { text: 'Traffic Volume', value: 'traffic' },
    { text: 'Requests', value: 'requests' },
])();


// 获取interval 选项列表
export const intervalOptionList = (() => ({
    '1m': { text: '1 Minute', reportText: '1-Minute' },
    '5m': { text: '5 Minutes', reportText: '5-Minutes' },
    '1h': { text: '1 Hour', reportText: 'Hourly' },
    '24h': { text: '1 Day', reportText: 'Daily' },
    '30d': { text: '1 Month', reportText: 'Monthly' },
}))();

export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 5 },
        lg: { span: 5 },
        xl: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 10 },
        xl: { span: 10 },
    },
};

export const tailFormItemLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
        md: { span: 16, offset: 4 },
        lg: { span: 16, offset: 4 },
        xl: { span: 16, offset: 4 },
    },
};

export const timeformItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 5 },
        lg: { span: 5 },
        xl: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 16 },
        lg: { span: 16 },
        xl: { span: 16 },
    },
};

export const timezoneItemLayout = {
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 24 },
    },
};

export const carryClientIpList = (() => ({
    "0": "No",
    "1": "TCP Option 0x4e",
    "2": "Proxy Protocol v1",
    "3": "Proxy Protocol v2"
}))();

// 获取区域
export const regionList = (() => ({
    'europe': { text: 'Europe' },
    'asia': { text: 'Asia' },
    'mainlandChina': { text: 'Mainland China' },
    'northAmerica': { text: 'North America' },
    'southAmerica': { text: 'South America' },
    'oceania': { text: 'Oceania' },
}))();

//统一分隔符
export const separator = (() => ';')();

export const vplList = (() => ({
    "all": "All",
    "china-jp": "Mainland china - Japan",
    "china-hk": "Mainland china - Hong Kong",
}))();

export const ipVersionList = (() => [
    {value:1,text:"IPv4"},
    {value:2,text:"IPv6"},
    {value:3,text:"IPv4 + IPv6"},
])();