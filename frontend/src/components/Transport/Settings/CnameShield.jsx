import React, { Component } from 'react'
import { Divider, Form, Input, Radio, Popover, Icon } from 'antd';
import styles from '@/styles/module.less';
import { formatMessage } from 'umi/locale';
import { layerProtocolList, noYesList } from '@/utils/Constants'
import YesNoRadio from './YesNoRadio'
import { wrapTextForApplicationTooltip } from '@/utils/wrapper';
import { connect } from 'dva';
import lodash from 'lodash';
import DomainInput from './DomainInput';
import { getSuffixs } from '@/services/transport.ts';
import { checkDomain } from '@/utils/transport';

@connect(({ user, transportCommon }) => ({
    user, transportCommon
}))
export default class CnameShield extends Component {

    constructor() {
        super();
        this.state = {
            cNameRules: {},
        }
    }

    componentDidMount() {
        this.setCNameRules(this.props.isPortReuse);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isPortReuse != this.props.isPortReuse) {
            this.setCNameRules(newProps.isPortReuse);
        }
    }

    setCNameRules(isPortReuse) {
        const rules = [{ validator: this.validateCName }];
        if (!isPortReuse || this.props.edit) {//非端口复用或者修改状态下 cname必填
            rules.push({ required: true, message: formatMessage({ id: 'transport.form.empty.cName' }) });
        }

        if (!isPortReuse) {//非端口复用 cname必填 
            this.setState({
                cNameRules: { rules }
            });
        } else {
            //端口复用
            this.props.form.setFieldsValue({ 'vip': 0 });

            this.setState({
                cNameRules: { rules }
            }, () => {
                this.props.form.validateFields(['cName'], { force: true });
            });
        }
    }

    validateFixData = (_, value, callback) => {
        const { form } = this.props;
        if (!value || !value.fix || (value && value.text)) {
            callback();
        } else {
            callback(formatMessage({ id: "transport.error.empty.shield" }));
        }

    };

    validateCName = (rule, value, callback) => {
        let error = checkDomain(value, formatMessage({ id: 'transport.error.cName' }));
        callback(error);
    };

    render() {

        const { isPortReuse, form: { getFieldDecorator }, edit } = this.props;
        const { allSuffix, cnameDomainName } = this.props.transportCommon;


        return (
            <>
                <div className={styles.cardSubTitle}>
                    <div className={styles.subTitle}>CNAME & Shield</div>
                    <Divider></Divider>
                    <Form.Item label={
                        <span>{formatMessage({ id: 'transport.form.label.cName' })}&nbsp;
                            <Popover placement="bottom" content={wrapTextForApplicationTooltip(formatMessage({ id: 'transport.tooltip.detail.cName' }))} overlayClassName="custom-popover-width280">
                                <Icon type="info-circle" />
                            </Popover>
                        </span>
                    } className="custom-form-label">
                        {getFieldDecorator('cName', this.state.cNameRules)(
                            <DomainInput defaultDomainName={cnameDomainName} allSuffixs={allSuffix} placeholder={formatMessage({ id: 'transport.placeholder.cName' })} ></DomainInput>
                        )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'transport.form.label.shield' })} className="custom-form-label">
                        {getFieldDecorator('exitIp', {
                            rules: [
                                { validator: this.validateFixData },
                            ]
                        })(
                            <YesNoRadio></YesNoRadio>
                        )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'transport.form.label.vip' })} className="custom-form-label">
                        {getFieldDecorator('vip', { initialValue: 0 })(
                            <Radio.Group disabled={edit || (isPortReuse ? true : false)}>
                                {noYesList.map(item => <Radio key={item.value} value={item.value}>{item.text}</Radio>)}
                            </Radio.Group>
                        )}
                    </Form.Item>
                </div>
            </>
        )
    }
}
