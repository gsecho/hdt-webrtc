import React, { Component } from 'react'
import { formItemLayout } from '@/utils/Constants'
import { Row, Col, Input, Form } from 'antd';
import { formatMessage } from 'umi/locale';
import { checkIpv4List, checkIpv6List, checkMaxList } from '@/utils/helper'

const { TextArea } = Input;

export default class Security extends Component {

    checkIpList = (rule, value, callback) => {
        const { ipVersion } = this.props;

        let verifyMethod = checkIpv4List;
        let formatMessageId = 'transport.error.ipv4List';
        if (ipVersion == 2) {//ipv6
            verifyMethod = checkIpv6List;
            formatMessageId = 'transport.error.ipv6List';
        } else if (ipVersion == 3) {//ipv4+ipv6
            verifyMethod = checkMaxList;
            formatMessageId = 'transport.error.ipMaxList';
        }
        if (verifyMethod(value)) {
            callback();
        } else {
            callback(formatMessage({ id: formatMessageId }));
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.ipVersion != prevProps.ipVersion) {
          this.props.form.validateFields(['ipWhiteList'], { force: true });
          this.props.form.validateFields(['ipBlackList'], { force: true });
        }
      }

    render() {
        const { form: { getFieldDecorator } } = this.props;

        return (
            <>
                <Row className="custom-mb24">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        For security, you can specify IP addresses by the end-user IP allowlisting, and end-user IP
                        blocklisting.
                    </Col>
                </Row>
                <Form.Item label={formatMessage({ id: 'transport.form.label.ipWhiteList' })} className="custom-form-label">
                    {getFieldDecorator('ipWhiteList', { rules: [{ validator: this.checkIpList }] })(
                        <TextArea rows={4} placeholder={formatMessage({ id: 'transport.placeholder.ipWhiteList' })} />
                    )}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'transport.form.label.ipBlackList' })} className="custom-form-label">
                    {getFieldDecorator('ipBlackList', { rules: [{ validator: this.checkIpList }] })(
                        <TextArea rows={4} placeholder={formatMessage({ id: 'transport.placeholder.ipBlackList' })} />
                    )}
                </Form.Item>

            </>
        )
    }
}
