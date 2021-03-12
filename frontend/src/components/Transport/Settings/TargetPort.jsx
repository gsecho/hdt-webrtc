import React, { Component, Fragment } from 'react'
import { Select, Card, Table, Popover, Icon, InputNumber, Input, Button, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { wrapTextForApplicationTooltip as wrapText } from '@/utils/wrapper';
import { layerProtocolList } from '@/utils/Constants'
import styles from './settings.less'


function getMsg(key) {
    return formatMessage({ id: `transport.${key}` })
}

export default class TargetPort extends Component {
    constructor() {
        super();
        this.defaultValue = { key: 0, protocol: '0', port: '', error: true };//默认数据
        this.state = {
            portType: 0,
            data: [{ ...this.defaultValue }]
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isPortReuse && nextProps.isPortReuse != this.props.isPortReuse) {//端口复用时只能single
            this.handleTypeChange(0);
        }
    }

    protocolColumn = {
        title: <span>{getMsg('targetPort.column.protocol')}&nbsp;&nbsp;
            <Popover placement="bottom" content={wrapText(getMsg('targetPort.column.protocol.tooltip'))} overlayClassName="custom-popover">
                <Icon type="info-circle" />
            </Popover>
        </span>,
        dataIndex: 'protocol',
        render: (text, record, index) =>
        (<Select key={index}
            className="custom-form-select"
            value={text} style={{ width: '100px' }}
            disabled={this.props.isPortReuse}
            onChange={(e) => this.handleProtocolChange(e, index)}>
            {Object.keys(layerProtocolList).map(item => <Select.Option value={item} key={item}>{layerProtocolList[item].text}</Select.Option>)}
        </Select>)
    };

    singleColumns = [
        this.protocolColumn,
        {
            title: <span>{getMsg('targetPort.column.port')}&nbsp;&nbsp;
            <Popover placement="bottom" content={wrapText(getMsg('targetPort.column.port.tooltip'))} overlayClassName="custom-popover">
                    <Icon type="info-circle" />
                </Popover>
            </span>,
            dataIndex: 'port',
            render: (port, record, index) => <Fragment key={index}>
                <InputNumber value={port} className={record.error ? 'hdt-error' : ''}
                    onChange={e => this.handlePortChange(e, index)}
                    placeholder={getMsg('placeholder.targetPort')}
                    min={1} max={65535} style={{ width: '100px' }} />
            </Fragment>

        },
    ]

    changeData = (value) => {
        this.setState({ data: value })
        let result = '';
        let error = false;

        for (var i = 0; i < value.length; i++) {
            if (value[i].error) {
                error = true;
                break;
            }
            result += value[i]['port'] + "|" + value[i]['protocol'] + ";";
        }

        if (error) {
            this.props.onChange({ type: this.state.portType, value: '' });
        } else {
            this.props.onChange({ type: this.state.portType, value: result });
        }
    }

    handleProtocolChange = (e, index) => {
        const portData = [...this.getData()];
        portData[index]['protocol'] = e;
        this.changeData(portData);
    }
    handlePortChange = (port, index) => {
        const portData = [...this.getData()];
        portData[index]['port'] = port;

        if (!port || String(port).trim().length === 0) {
            portData[index]['error'] = true;
        } else {
            portData[index]['error'] = false;
        }
        this.changeData(portData);
    }
    handleTypeChange = (e) => {
        this.setState({ portType: e }, () => {
            let value = [{ ...this.defaultValue }];
            if (e === 1) {//range
                this.singleData = this.getData();
                if (this.rangeData) {
                    value = this.rangeData;
                }
            } else {
                this.rangeData = this.getData();
                if (this.singleData) {
                    value = this.singleData;
                }
            }
            this.changeData(value);
        });
    }
    addPort = () => {
        const date = [...this.getData(), { ...this.defaultValue, key: this.getData().length }];
        this.changeData(date);
    }
    delPort = (index) => {
        const portData = [...this.getData()];
        portData.splice(index, 1);
        this.changeData(portData);

    }
    getData() {
        return this.state.data;
    }
    genColumn = () => {
        if (this.state.portType === 1) {
            return [
                this.protocolColumn,
                {
                    title: <span>{getMsg('targetPort.column.portRange')}&nbsp;&nbsp;
                        <Popover placement="bottom" content={wrapText(getMsg('targetPort.column.portRange.tooltip'))} overlayClassName="custom-popover-width280">
                            <Icon type="info-circle" />
                        </Popover>
                    </span>,
                    dataIndex: 'port',
                    render: (text, record, index) => <Fragment key={index}>
                        <Input placeholder={getMsg('placeholder.targetPortRange')} value={text} className={record.error ? 'hdt-error' : ''}
                            onChange={e => { this.handlePortChange(e.target.value, index) }}
                            style={{ width: '312px' }} />
                        {this.getData().length > 1 ? <Icon type="delete" onClick={() => { this.delPort(index) }} /> : ''}
                        {index === this.getData().length - 1 ? <Icon type="plus" onClick={this.addPort} /> : ''}
                    </Fragment>

                },
            ]
        } else {
            return this.singleColumns;
        }
    }
    render() {
        const { portType } = this.state;
        const { isPortReuse } = this.props;
        return (
            <div className={`targetPort ${styles.targetPort}`}>
                <Select className="custom-form-select" onChange={this.handleTypeChange} disabled={isPortReuse} value={portType} style={{ width: '120px', paddingBottom: '16px' }}>
                    <Select.Option value={0}>Single</Select.Option>
                    <Select.Option value={1}>Range</Select.Option>
                </Select>
                <div className={styles.portTable} style={portType === 1 ? { width: '530px' } : {}}>
                    <Table columns={this.genColumn()}
                        dataSource={this.state.data}
                        pagination={false}
                        size='small'
                        selections={false} />
                </div>
            </div>
        )
    }
}
