import * as report from '@/services/report';
import * as chartUtil from '@/utils/chart';

/**
 * byte转成bps
 * @param {byte为单位的值} byte 
 * @param {时间区间} interval 
 */
function toBps(byte, interval) {
    return byte ? parseFloat((byte * 8 / interval).toFixed(4)) : 0;
}


export default {
    namespace: 'report',

    state: {
        trafficData: {},
        bandData: {},
        requestData: {},
    },

    effects: {
        // 流量
        * getTraffic({ payload, callback }, { call, put, select }) {
            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(report.getMetrics, '/report/flow', u, payload);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshTraffic',
                    payload: {
                        data: response[dataRoot],
                        interval: payload.interval
                    },
                });
            }
            return response;
        },
        // 流量和带宽
        * getTrafficAndBand({ payload, callback }, { call, put, select }) {
            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(report.getMetrics, '/report/flow', u, payload);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshTrafficAndBand',
                    payload: {
                        data: response[dataRoot],
                        interval: payload.interval
                    },
                });
            }
            return response;
        },
        // 带宽
        * getBandwidth({ payload, callback }, { call, put, select }) {
            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(report.getMetrics, '/report/flow', u, payload);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshBand',
                    payload: {
                        data: response[dataRoot],
                        interval: payload.interval
                    },
                });
            }
            return response;
        },
        // 请求数
        * getRequests({ payload, callback }, { call, put, select }) {
            // 获取user
            let u = yield select(state => state.user);
            let response = yield call(report.getMetrics, '/report/requests', u, payload);
            if (response) {
                // 成功
                yield put({
                    type: 'refreshRequests',
                    payload: {
                        data: response[dataRoot]
                    },
                });
            }
            return response;
        },
    },

    reducers: {
        refreshTrafficAndBand(state, obj) {
            const { interval, data } = obj.payload;
            let { intervalSecond } = chartUtil.tranInterval(interval);
            if (data) {
                const trafficUpload = [];
                const trafficDownload = [];
                const trafficTotal = [];
                const bandUpload = [];
                const bandDownload = [];
                const bandTotal = [];
                data["flow-data"].forEach(item => {

                    trafficUpload.push([item.timestamp, item.upload]);
                    trafficDownload.push([item.timestamp, item.download]);
                    trafficTotal.push([item.timestamp, item.upload + item.download]);

                    const uploadBW = toBps(item.upload, intervalSecond);
                    const downloadBW = toBps(item.download, intervalSecond);
                    bandUpload.push([item.timestamp, uploadBW]);
                    bandDownload.push([item.timestamp, downloadBW]);
                    bandTotal.push([item.timestamp, uploadBW + downloadBW]);
                })
                return {
                    ...state,
                    trafficData: {
                        upload: trafficUpload,
                        download: trafficDownload,
                        total: trafficTotal
                    },
                    bandData: {
                        upload: bandUpload,
                        download: bandDownload,
                        total: bandTotal
                    }
                };
            }
            return {
                ...state
            }
        },
        refreshTraffic(state, obj) {
            const { interval, data } = obj.payload;
            if (data) {
                const trafficUpload = [];
                const trafficDownload = [];
                const trafficTotal = [];
                data["flow-data"].forEach(item => {

                    trafficUpload.push([item.timestamp, item.upload]);
                    trafficDownload.push([item.timestamp, item.download]);
                    trafficTotal.push([item.timestamp, item.upload + item.download]);

                })
                return {
                    ...state,
                    trafficData: {
                        uploadSummary: data['upload-summary'],
                        downloadSummary: data['download-summary'],
                        upload: trafficUpload,
                        download: trafficDownload,
                        total: trafficTotal
                    },
                };
            }
            return {
                ...state
            }
        },
        refreshBand(state, { payload }) {
            const { interval, data } = payload;
            let { intervalSecond } = chartUtil.tranInterval(interval);
            if (data) {
                const bandUpload = [];
                const bandDownload = [];
                const bandTotal = [];
                let uploadSummary = data['upload-summary'];
                let downloadSummary = data['download-summary'];
                let recordsCount = data['records-count'];

                let averageUpload = toBps(uploadSummary, intervalSecond * recordsCount);
                let averageDownload = toBps(downloadSummary, intervalSecond * recordsCount);

                data["flow-data"].forEach(item => {
                    const uploadBW = toBps(item.upload, intervalSecond);
                    const downloadBW = toBps(item.download, intervalSecond);
                    bandUpload.push([item.timestamp, uploadBW]);
                    bandDownload.push([item.timestamp, downloadBW]);
                    bandTotal.push([item.timestamp, uploadBW + downloadBW]);
                })

                return {
                    ...state,
                    bandData: {
                        averageUpload,
                        averageDownload,
                        upload: bandUpload,
                        download: bandDownload,
                        total: bandTotal
                    }
                };
            }
            return { ...state }
        },
        refreshRequests(state, { payload }) {
            const { data } = payload;
            if (data) {
                const total = [];
                const success = [];
                data["requests-data"].forEach(item => {
                    total.push([item.timestamp, item.total]);
                    success.push([item.timestamp, item.success]);
                })
                return {
                    ...state,
                    requestData: {
                        total,
                        success,
                        totalSummary: data["total-summary"],
                        successSummary: data["success-summary"]
                    }
                };
            }
            return { ...state }
        },
    },
};