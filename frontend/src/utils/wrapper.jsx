import { Fragment } from 'react';
import { Tag, Badge, Tooltip, Icon, Popover, Spin, Row, Col } from 'antd';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import * as helper from '@/utils/helper';
import { tranWord } from "./helper";
import maintenance from '@/assets/maintenance.svg';
import online from '@/assets/online.svg';

// 生成application status 标签
export function wrapApplicationStatus(text, record) {
    if (record) {
        let status = record.status;
        if (status) {
            let res = '';
            switch (status.toLowerCase()) {
                case 'deployed':
                    res = <Tag color="green">{helper.tranWord(status)}</Tag>;
                    break;
                case 'deploying':
                    res = <Tag color="blue">{helper.tranWord(status)}</Tag>;
                    break;
                case 'waiting':
                    res = <Tag color="gold">{helper.tranWord(status)}</Tag>;
                    break;
                case 'failed':
                    res = <Tag color="red">{helper.tranWord(status)}</Tag>;
                    break;
                case 'aborted':
                    res = <Tag color="magenta">{helper.tranWord(status)}</Tag>;
                    break;
            }
            return res;
        }
    }
    return '';
}

// 生成pod phase标签
export function wrapPodPhase(record) {
    if (record) {
        let res = '';
        let phase = record.phase ? record.phase.toLowerCase() : '';
        switch (phase) {
            case 'running':
                res = <Tag color="green">{helper.tranWord(phase)}</Tag>;
                break;
            case 'pending':
                res = <Tag color="orange">{helper.tranWord(phase)}</Tag>;
                break;
            case 'succeeded':
                res = <Tag color="cyan">{helper.tranWord(phase)}</Tag>;
                break;
            case 'failed':
                res = <Tag color="red">{helper.tranWord(phase)}</Tag>;
                break;
            case 'unknown':
                res = <Tag color="magenta">{helper.tranWord(phase)}</Tag>;
                break;
            // 其他情况
            default:
                res = <Tag color="magenta">{helper.tranWord(phase)}</Tag>;
                break;
        }

        return res;
    }
    return '';
}

/**
 * 封装application status
 * @param reactDom
 * @param text
 * @param record        application data
 * @param clickFun      点击事件
 * @param visibleFun    控制显示事件
 * @param state         visible state
 * @param loading       loading状态
 * @returns {string}
 */
export function wrapApplicationStatusPopover(reactDom, text, record) {
    // let message = s.message;
    let message = record.message;
    let status = record.status ? record.status.toLowerCase() : '';
    let color = '';
    switch (status) {
        case 'deployed':
            color = '#52c41a';
            break;
        case 'deploying':
            color = '#1890ff';
            break;
        case 'waiting':
            color = '#faad14';
            break;
        case 'failed':
            color = '#f5222d';
            break;
        case 'aborted':
            color = '#eb2f96';
            break;
    }
    let content = (
        <div style={{ maxWidth: '300px' }}>
            <p><Icon type="info-circle" theme="filled" filledColor={color} style={{ color: color }} />&nbsp;&nbsp;{message}</p>
        </div>
    );
    let res = <Fragment>
        {reactDom}
        {!lodash.isEmpty(message) ? <Popover placement="bottom" content={content} title="" overlayClassName="custom-table-pop">
            <Icon type="info-circle" theme="filled" filledColor={color} style={{ color: color }} />
        </Popover> : ''}
    </Fragment>;
    return res;
}

// application lb4Used
export function wrapLb4Used(text, record) {
    if (record) {
        let lb4Used = record.isLoadBalanced;
        if (lb4Used !== undefined) {
            if (lb4Used.toString().toLowerCase() === 'true') {
                return <Badge status="success" text={helper.tranWord(lb4Used.toString())} />;
            } else {
                return <Badge status="default" text={helper.tranWord(lb4Used.toString())} />;
            }
        }
    }
    return '';
}

export function wrapPopForReview(text, record) {
    if (record) {
        let pop = record.pop;
        if (pop && pop.length > 0) {
            let str = record.pop ? record.pop : '';
            if (str) {
                let a = str.split(',');
                let len = a.length;
                let country = <span className="custom-tag-grey">{a[len - 1].toUpperCase()}</span>;
                let node = a.slice(0, len - 1).join(' ');
                let html = <span><span>{helper.tranWord(node)}</span>{country}</span>;
                return html;
            }
        }
    }
    return '';
}

// 生成pop
export function wrapPoP(text, record) {
    if (record) {
        let pop = record.pop;
        if (pop && pop.length > 0) {
            let arr = record.pop ? record.pop : [];
            let tmp = [];
            if (arr.length > 0) {
                arr.map((item, index) => {
                    let a = item.split(' ');
                    let len = a.length;
                    let country = <span className="custom-tag-grey">{a[len - 1]}</span>;
                    let node = a.slice(0, len - 1).join(' ');
                    let html = <span><span>{node}</span>{country}</span>;
                    tmp.push(html);
                    tmp.push(' , ');
                });
            }
            if (tmp.length > 0) {
                return tmp.slice(0, tmp.length - 1);
            }
        }
    }
    return '';
}

// 生成pop
export function wrapNodeDesc(text, code) {
    let tmp = text;
    if (text) {
        tmp = tranWord(text);
    }
    if (code) {
        let country = <span className="custom-tag-grey">{code.toUpperCase()}</span>;
        let html = <Fragment>
            {tmp}{country}
        </Fragment>;
        return html;
    }
    return tmp;
}

export function wrapPopStatus(text, record) {
    if (record) {
        let res = '';
        let status = record.status;

        switch (status) {
            case 'online':
                res = <Fragment><img style={{ width: '20px', height: '20px', marginRight: '4px' }} src={online} /><span>&nbsp;Service Up</span></Fragment>;
                break;
            case 'offline':
                res = <Fragment><img style={{ width: '20px', height: '20px', marginRight: '4px' }} src={maintenance} /><span>&nbsp;Maintenance</span></Fragment>;
                break;
            default:
                break;
        }

        return res;
    }
    return '';
}

/**
 * 截取字段
 * @param str
 * @param length
 * @returns {string}
 */
export function wrapPodName(str = '', length = 20) {
    let res = str;
    if (str.length > 0 && str.length > length) {
        let newStr = str.substr(0, length) + '...';
        res = <Fragment>
            <Tooltip title={str} placement="bottom">
                <span>{newStr}</span>
            </Tooltip>
        </Fragment>;
    }

    return res;
}

export function generateTableHeaderForInstances() {
    let content = <Fragment>
        <Row gutter={8}>
            <Col span={3}><Icon type="info-circle" /></Col>
            <Col span={21}>{formatMessage({ id: 'tooltip.application.list.instance' })}</Col>
        </Row>
    </Fragment>;
    let html = <span>{formatMessage({ id: 'table.applicationList.header.instance' })}&nbsp;<Popover overlayClassName="custom-pop-white" placement="bottom" content={content}><Icon type="info-circle" style={{ marginTop: '3px' }} /></Popover></span>;
    return html;
}

export function wrapVolume(volumes = [], unit = []) {
    let res = [];
    if (volumes.length > 0 && unit.length > 0) {
        volumes.map((item, index) => {
            let name = item.metadata.name;
            let storage = item.metadata.annotations['volume.beta.kubernetes.io/storage-class'];
            let resource = item.spec.resources.requests.storage + '' + unit[index];

            let html = <div>- Name: {name}, Storage Class: {storage}, Capacity: {resource}</div>;
            res.push(html);
        });
    }

    return res;
}


export function wrapTextForHttpHeader(header = []) {
    let res = [];
    if (header.length > 0) {
        header.map((item, index) => {
            let d = <div>
                - Name: {item.name}, Value: {item.value}
            </div>;

            res.push(d);
        });
    }
    return res;
}



export function wrapTextForCommand(str = '') {
    let res = [];
    if (str && str.length > 0) {
        let pat = /\n/g;
        let replacement = ',';
        let newStr = str.replace(pat, replacement);
        let arr = newStr.split(',');
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].length > 0) {
                    let obj = <div>{arr[i]}</div>;
                    res.push(obj);
                }
            }
        }
    }

    return res;
}

export function wrapTextForArgs(str = '') {
    let res = [];
    if (str && str.length > 0) {
        let pat = /\n/g;
        let replacement = ',';
        let newStr = str.replace(pat, replacement);
        let arr = newStr.split(',');
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].length > 0) {
                    let obj = <div>{arr[i]}</div>;
                    res.push(obj);
                }
            }
        }
    }

    return res;
}

export function wrapTextForHttpError(error = '', message = '') {
    let res = [];
    if (error) {
        let err = error.toLowerCase();

        switch (err) {
            case 'invalidspecification':
            case 'invalidresourcekind':
                // 根据换行符，按行划分
                let arr = message.split(/\n/g);
                if (arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        let item = arr[i];
                        // 以* /- 开头
                        let pat = /^[\*\-]\s?.*/g;
                        if (item && item.length > 0) {
                            item = lodash.trim(item);
                            let flag = pat.test(item);
                            let html = '';
                            if (flag) {
                                // 匹配正文
                                html = <div className="custom-err-modal-text">{item}</div>;
                            } else {
                                // 匹配小标题
                                html = <div className="custom-err-modal-title">
                                    <span className="custom-err-modal-icon">x</span>&nbsp;{item}
                                </div>;
                            }
                            res.push(html);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    return res;
}

export function wrapTextForApplicationTooltip(message = '', learnMore = false) {
    learnMore = false;
    let res = <Fragment>
        <div className="custom-form-popover-item custom-mr8">
            <Icon type="info-circle" />
        </div>
        <div className="custom-form-popover-item custom-form-popover-item-r">
            {message}&nbsp;&nbsp;{learnMore ? <a>Learn More</a> : ''}
        </div>

    </Fragment>;
    return res;
}
