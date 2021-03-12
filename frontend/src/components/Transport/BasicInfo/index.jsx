import React, { Component } from 'react'
import { Form, Select, Input, Icon, Popover, Radio } from 'antd';
import { formatMessage } from 'umi/locale';
import TextArea from 'antd/lib/input/TextArea';
import { useStandardPortList, ipVersionList } from '@/utils/Constants';
import { isPortReuseChange } from '@/utils/transport';
import { wrapTextForApplicationTooltip } from '@/utils/wrapper';
import TransportStatus from './TransportStatus'

export default class BasicInfo extends Component {
    handleChangePortReuse = (e) => {
        const { form, onCleanValid } = this.props;
        if (isPortReuseChange(form.getFieldValue('portReuse'), e)) {//端口复用情况改变
            onCleanValid && onCleanValid();
        }
    }

    render() {
        const { edit = false, form: { getFieldDecorator } } = this.props;
        return (
            <>
                {edit ? <Form.Item label={formatMessage({ id: 'transport.form.label.transportId' })} className="custom-form-label">
                    {getFieldDecorator('transportId')(
                        <Input disabled />
                    )}
                </Form.Item> : ''}
                <Form.Item label={formatMessage({ id: 'transport.form.label.transportName' })} className="custom-form-label">
                    {getFieldDecorator('transportName')(
                        <Input placeholder={formatMessage({ id: 'transport.placeholder.transportName' })} />
                    )}
                </Form.Item>
                {!edit ? <Form.Item label={formatMessage({ id: 'transport.form.label.versionNumber' })} className="custom-form-label">
                    {getFieldDecorator('versionNumber')(
                        <Input disabled />
                    )}
                </Form.Item> : ''}
                <Form.Item label={formatMessage({ id: 'transport.form.label.comments' })} className="custom-form-label">
                    {getFieldDecorator('comments')(
                        <TextArea placeholder={formatMessage({ id: 'transport.placeholder.comment' })} rows={4} />
                    )}
                </Form.Item>
                <Form.Item label={<span>{formatMessage({ id: 'transport.form.label.transportStatus' })}&nbsp;
                        <Popover placement="bottom" content={wrapTextForApplicationTooltip(formatMessage({ id: 'transport.tooltip.detail.transportStatus' }), true)} overlayClassName="custom-popover-width280">
                        <Icon type="info-circle" />
                    </Popover>
                </span>
                } className="custom-form-label">
                    {getFieldDecorator('transportStatus', { initialValue: 1 })(
                        <TransportStatus></TransportStatus>
                    )}
                </Form.Item>
                <Form.Item label={
                    <span>{formatMessage({ id: 'transport.form.label.portReuse' })}&nbsp;
                        <Popover placement="bottom" content={wrapTextForApplicationTooltip(formatMessage({ id: 'transport.tooltip.detail.portReuse' }), true)} overlayClassName="custom-popover-width280">
                            <Icon type="info-circle" />
                        </Popover>
                    </span>
                } className="custom-form-label">
                    {getFieldDecorator('portReuse', {
                        rules: [
                            { required: true, message: formatMessage({ id: 'transport.form.empty.portReuse' }) },
                        ]
                    })(
                        <Select className="custom-form-select" disabled={edit} onChange={this.handleChangePortReuse}>
                            {Object.keys(useStandardPortList).reduce((total, item) => {
                                if (edit || (!edit && useStandardPortList[item].available)) {
                                    total.push(<Select.Option key={item} value={item}>{useStandardPortList[item].text}</Select.Option>);
                                }
                                return total;
                            }, [])}
                        </Select>

                    )}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'transport.form.label.ipVersion' })} className="custom-form-label">
                    {getFieldDecorator('ipVersion', { initialValue: 1 })(
                        <Radio.Group>
                            {ipVersionList.map(item => <Radio key={item.value} value={item.value}>{item.text}</Radio>)}
                        </Radio.Group>
                    )}
                </Form.Item>
            </>
        )
    }
}
