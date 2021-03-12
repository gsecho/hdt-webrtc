import React, { Component, Fragment } from 'react'
import { Card, Spin, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './transportView.less'
import lodash from 'lodash';
import PortRange from './PortRange.jsx'
import { transTransportData } from '@/utils/transport'
import { connect } from 'dva';

function genDetail(array, dataList) {
    return array.map(item => {
        const label = formatMessage({ id: `transport.form.label.${item}` });
        let diffClass = '';
        const html = dataList.map((data, index) => {
            let text = '', className = '';
            if (data[item]) {
                text = data[item]['text'];
                if (data[item]['diff']) {
                    diffClass = styles.diff;
                }
            } else if (item === 'targetPort' && !lodash.isEmpty(data["portRange"])) {
                text = <PortRange portRange={data['portRange']}></PortRange>;
                className = styles.portContent;
            }


            return <div key={item + index} className={className}><span>{label}</span><span>{text}</span></div>
        })
        return <div key={item} className={diffClass}>{html}</div>
    })
}

const defaultTitles = {
    'basicInfo': [{ detail: ['transportId','transportName', 'versionNumber', 'comments', 'transportStatus', 'portReuse', 'ipVersion'] }],
    'settings': [
        { title: 'ipport', detail: ['targetDomain', 'targetPort', 'layerProtocol', 'accessDomain', 'accessPort', 'verifyPsb'] },
        { title: 'cname', detail: ['cName', 'exitIp', 'vip'] },
        { title: 'advanced', detail: ['carryClientIp', 'transportStrategy', 'speedLimit', 'concurrentLimit'] }
    ],
    'security': [{ detail: ['ipWhiteList', 'ipBlackList'] }]
}

function compareData([data1, data2], titles) {
    Object.keys(titles).forEach(item => {
        titles[item].forEach(attr => {
            attr['detail'].forEach(title => {
                if (data1[title] && data2[title]) {//全都有值
                    if ((data1[title].text || data2[title].text) && !lodash.eq(data1[title].text, data2[title].text)) {
                        data1[title].diff = data2[title].diff = true;
                    }
                } else {//一个有一个没有的情况
                    if (data1[title] && !data2[title]) {
                        if (data1[title].text) {
                            data1[title].diff = true;
                            data2[title] = { text: '', diff: true };
                        }
                    } else if (!data1[title] && data2[title]) {
                        if (data2[title].text) {
                            data2[title].diff = true;
                            data1[title] = { text: '', diff: true };
                        }
                    }
                }
            })
        })
    })
}

function getTitleHtml(item, length) {
    const html = [];
    for (let i = 0; i < length; i++) {
        html.push(<div key={i}>{formatMessage({ id: `transport.form.title.${item}` })}</div>);
    }

    return <div className={styles.title}>{html}</div>;
}

function getEmptyHtml(length) {
    const html = [];
    for (let i = 0; i < length; i++) {
        html.push(<div key={i}></div>);
    }

    return <div className={styles.empty}>{html}</div>;
}

@connect(({ transportCommon, loading }) => ({
    transportCommon, loading
}))
export default class TransportView extends Component {

    constructor() {
        super();
        this.state = {
            transportData: [],
            dataLength: 0,
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.dataList != this.props.dataList) {
            this.initData(newProps.dataList);
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'transportCommon/getStrategyList'
        }).then(() => {
            this.initData(this.props.dataList);
        })
    }

    initData = (dataList) => {
        const { titles = defaultTitles } = this.props;
        if (!lodash.isEmpty(dataList)) {
            const dataLength = dataList.length;

            const transportData = dataList.map(item => !lodash.isEmpty(item)?transTransportData(item, this.props.transportCommon.strategyList):{});
            if (dataLength === 2) {
                compareData(transportData, titles);
            }
            this.setState({ dataLength, transportData: [...transportData] });
        }
    }

    render() {

        const { titles = defaultTitles, theme } = this.props;
        const { dataLength, transportData } = this.state;

        return (
            <div className={`${styles.transportView} ${theme}`}>
                {Object.keys(titles).map(item => {
                    return <Fragment key={item}>
                        {getTitleHtml(item, dataLength)}
                        <div className={styles.content}>
                            {titles[item].map((attr, index) => {
                                return <Fragment key={attr.title + index}>
                                    {getEmptyHtml(dataLength)}
                                    {attr['title'] ? getTitleHtml(attr['title'], dataLength) : ''}
                                    {genDetail(attr['detail'], transportData)}
                                </Fragment>
                            })}
                            {getEmptyHtml(dataLength)}
                        </div>
                    </Fragment>
                })}
            </div>
        )
    }
}

