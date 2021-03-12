import React, { Component } from 'react'
import { Divider, Form, Input, Radio, Popover, Icon, InputNumber, notification } from 'antd';
import { wrapTextForApplicationTooltip } from '@/utils/wrapper';
import styles from '@/styles/module.less';
import { formatMessage } from 'umi/locale';
import { layerProtocolList, noYesList } from '@/utils/Constants'
import { connect } from 'dva';
import lodash from 'lodash';
import TargetPort from './TargetPort'
import { checkAccessDomain, checkDomain } from '@/utils/transport';
import { checkIp } from '@/utils/helper';


function getLocalMsg(key) {
    return formatMessage({ id: `transport.${key}` })
}

export default class Ipport extends Component {
    rangeType = 1;
    constructor() {
        super();
        this.state = {
            portType: 0,
            domainDirty: false,
        };
    }

    checkPortRange = (rule, portRange, callback) => {
        if (portRange && portRange.value) {
            let error = false;
            //验证port范围
            if (portRange.type === 1) {
                let ranges = portRange.value.split(",");

                for (let i in ranges) {
                    var range = ranges[i].split('|')[0];
                    if (!new RegExp("^[0-9-]+$").test(range)) {
                        error = true;
                        break;
                    }
                    if (range.indexOf("-") != -1) {//范围
                        var rangeArr = range.split("-");
                        if (rangeArr.length != 2) {
                            error = true;
                            break;
                        }
                        var rangeFrom = Number(rangeArr[0]);
                        var rangeTo = Number(rangeArr[1]);
                        if (rangeFrom > rangeTo
                            || rangeFrom < 1 || rangeFrom > 65535
                            || rangeTo < 1 || rangeTo > 65535) {
                            error = true;
                            break;
                        }
                    } else {
                        if (Number(range) < 1 || Number(range) > 65535) {
                            error = true;
                            break;
                        }
                    }
                }
            }
            if (error) {
                return callback(getLocalMsg('error.range.targetPort'));
            } else {
                return callback();
            }
        }
        callback(getLocalMsg('form.empty.targetPort'));
    };

    handlePortChange = e => {
        const { portType } = this.state;
        if (e && e.type != portType) {
            this.setState({ portType: e.type });
            if (e.type === this.rangeType) {
                const { form } = this.props;
                if (form.getFieldValue('accessPort')) {
                    form.setFieldsValue({ 'accessPort': '' });
                    notification['warning']({
                        message: 'Notification',
                        description: getLocalMsg('error.range.accessPort')
                    });
                }
            }
        }
    }

    validateTargetDomain = (rule, value, callback) => {
        //与accessDomain对比
        const { form } = this.props;
        if (value && this.state.domainDirty) {
            form.validateFields(['accessDomain'], { force: true });
        }

        const isIp = checkIp(value)
        if (!isIp) {
            let error = checkDomain(value, formatMessage({ id: 'transport.error.targetDomain' }));
            callback(error);
        } else {
            callback();
        }
    };

    validateAccessDomain = (rule, value, callback) => {
        //与targetDomain对比
        const { form } = this.props;
        const targetDomain = form.getFieldValue('targetDomain');
        if (value && targetDomain && value.trim() === targetDomain.trim()) {
            callback(getLocalMsg('error.same.accessDomain'));
        }
        const error = checkAccessDomain(value);//校验accessDomain内容
        callback(error);
    };

    handleAccessDomainBlur = e => {
        const { value } = e.target;
        this.setState({ domainDirty: this.state.domainDirty || !!value });
    };

    render() {
        const { form: { getFieldDecorator }, isPortReuse, edit } = this.props;

        const targetHtml = edit ? getFieldDecorator('targetPort', {
            rules: [{ required: true, message: getLocalMsg('form.empty.targetDomain') }]
        })(
            <InputNumber min={1} max={65535} />
        ) : getFieldDecorator('portRange', {
            rules: [{ validator: this.checkPortRange }],
        })(
            <TargetPort isPortReuse={isPortReuse} onChange={this.handlePortChange}></TargetPort>
        )

        return (
            <>
                <div className={styles.cardSubTitle}>
                    <div className={styles.subTitle}>{getLocalMsg('form.title.ipport')}</div>
                    <Divider></Divider>
                    <Form.Item label={getLocalMsg('form.label.targetDomain')} className="custom-form-label">
                        {getFieldDecorator('targetDomain', {
                            rules: [
                                { required: true, message: getLocalMsg('form.empty.targetDomain') },
                                { validator: this.validateTargetDomain },
                            ]
                        })(
                            <Input placeholder={getLocalMsg('placeholder.targetDomain')} />
                        )}
                    </Form.Item>
                    <Form.Item label={
                        <span>{getLocalMsg('form.label.targetPort')}&nbsp;
                            <Popover placement="bottom" content={wrapTextForApplicationTooltip(getLocalMsg('tooltip.detail.targetPort'))} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label" >
                        {targetHtml}
                    </Form.Item>
                    {edit ? <Form.Item label={
                        <span>{getLocalMsg('form.label.layerProtocol')}&nbsp;
                            <Popover placement="bottom" content={wrapTextForApplicationTooltip(getLocalMsg('tooltip.detail.layerProtocol'), true)} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label">
                        {getFieldDecorator('layerProtocol', { initialValue: 0 })(
                            <Radio.Group>
                                {Object.keys(layerProtocolList).map(item => <Radio value={item} key={item}>{layerProtocolList[item].text}</Radio>)}
                            </Radio.Group>
                        )}
                    </Form.Item> : ''}
                    <Form.Item label={getLocalMsg('form.label.accessDomain')} className="custom-form-label">
                        {getFieldDecorator('accessDomain', {
                            rules: [
                                { required: true, message: getLocalMsg('form.empty.accessDomain') },
                                { validator: this.validateAccessDomain },
                            ]
                        })(
                            <Input placeholder={getLocalMsg('placeholder.accessDomain')} onBlur={this.handleAccessDomainBlur} />
                        )}
                    </Form.Item>
                    <Form.Item label={
                        <span>{getLocalMsg('form.label.accessPort')}&nbsp;
                            <Popover placement="bottom" content={wrapTextForApplicationTooltip(getLocalMsg('tooltip.detail.accessPort'), true)} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label">
                        {getFieldDecorator('accessPort')(
                            <InputNumber disabled={isPortReuse || (!edit && this.state.portType === this.rangeType)} min={1} max={65535} />
                        )}
                    </Form.Item>
                    <Form.Item label={
                        <span>{getLocalMsg('form.label.verifyPsb')}&nbsp;
                            <Popover placement="bottom" content={wrapTextForApplicationTooltip(getLocalMsg('tooltip.detail.verifyPsb'), false)} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label">
                        {getFieldDecorator('verifyPsb', { initialValue: 0 })(
                            <Radio.Group>
                                {noYesList.map(item => <Radio key={item.value} value={item.value}>{item.text}</Radio>)}
                            </Radio.Group>
                        )}
                    </Form.Item>
                </div>
            </>
        )
    }
}
