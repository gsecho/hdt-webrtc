import React, { Component } from 'react'
import { Divider, Form, Select, Popover, Icon } from 'antd';
import { wrapTextForApplicationTooltip } from '@/utils/wrapper';
import styles from '@/styles/module.less';
import { formatMessage } from 'umi/locale';
import { carryClientIpList } from '@/utils/Constants'
import YesNoRadio from './YesNoRadio'
import { connect } from 'dva';
import { getStrategys } from '@/services/transport.ts';

@connect(({ transportCommon, user }) => ({
    transportCommon, user
}))
export default class AdvancedSettings extends Component {
    validateFixData = (value, callback, field) => {
        if (!value || !value.fix || (value && value.text)) {
            callback();
        } else {
            callback(formatMessage({ id: "transport.error.empty." + field }));
        }

    };
    render() {

        const { form: { getFieldDecorator }, transportCommon: { strategyList } } = this.props;

        return (
            <>
                <div className={styles.cardSubTitle}>
                    <div className={styles.subTitle}>Advanced Settings</div>
                    <Divider></Divider>
                    <Form.Item label={
                        <span>{formatMessage({ id: 'transport.form.label.carryClientIp' })}&nbsp;
                        <Popover placement="bottom" content={wrapTextForApplicationTooltip(formatMessage({ id: 'transport.tooltip.detail.carryClientIp' }))} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label">
                        {getFieldDecorator('carryClientIp', { initialValue: Object.keys(carryClientIpList)[0] })(
                            <Select className="custom-form-select">
                                {Object.keys(carryClientIpList).map(item => <Select.Option key={item} value={item}>{carryClientIpList[item]}</Select.Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'transport.form.label.transportStrategy' })} className="custom-form-label">
                        {getFieldDecorator('transportStrategy', {
                            initialValue: 'topspeed'
                        })(
                            <Select className="custom-form-select">
                                {strategyList.map(item => <Select.Option key={item} value={item.value}>{item.text}</Select.Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'transport.form.label.speedLimit' })} className="custom-form-label">
                        {getFieldDecorator('speedLimit', {
                            rules: [
                                { validator: (rule, value, callback) => { this.validateFixData(value, callback, 'speedLimit') } },
                            ]
                        })(
                            <YesNoRadio unit="Mbps" isNumber={true}></YesNoRadio>
                        )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'transport.form.label.concurrentLimit' })} className="custom-form-label">
                        {getFieldDecorator('concurrentLimit', {
                            rules: [
                                { validator: (rule, value, callback) => { this.validateFixData(value, callback, 'concurrentLimit') } },
                            ]
                        })(
                            <YesNoRadio isNumber={true}></YesNoRadio>
                        )}
                    </Form.Item>

                </div>
            </>
        )
    }
}
