import React, { Component } from 'react'
import { Table, Button, Card, message } from 'antd';
import { getTransportHistory } from '@/services/transport.ts';
import { connect } from 'dva';
import router from 'umi/router';
import { generateTimezoneText, tranTimeToStr, tranTimeToUtcStr } from '@/utils/helper'
import { formatMessage } from 'umi/locale';
import styles from './history.less'


@connect(({ user }) => ({
    user
}), null, null, { withRef: true })
export default class TransportHistory extends Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            tableData: [],
            selectedRows: [],
            compareDisabled: true
        }
    }
    componentDidMount() {
        const { currentPage, pageSize } = this.state;
        this.getHistoryData(currentPage, pageSize);
    }

    componentDidUpdate(prevProps) {
        if (this.props.transport.transportId != prevProps.transport.transportId) {
            this.getHistoryData(1, this.state.pageSize);
        }
    }

    getHistoryData = async (currentPage, pageSize) => {
        if (this.props.transport.transportId) {
            const start = (currentPage - 1) * pageSize;
            this.setState({
                loading: true,
                currentPage,
                pageSize,
            })

            const data = await getTransportHistory(this.props.user, { start, limit: pageSize, transportId: this.props.transport.transportId });
            const tableData = data[dataRoot].data;
            const total = data[dataRoot].count;
            tableData.forEach((item, index) => {
                item.versionNumber = 'Version ' + (total - (currentPage - 1) * pageSize - index);
            })

            if (tableData.length > 0 && (total - (currentPage - 1) * pageSize) === tableData.length) {
                tableData[tableData.length - 1].isCreate = true;
            }
            this.props.onSetVersion('Version ' + total);
            this.setState({
                tableData,
                total,
                loading: false,
            })
        }
    }
    onPageChange = ({ current, pageSize }) => {
        this.getHistoryData(current, pageSize);
    }
    //对比数据
    handlerCompare = () => {
        const { selectedRows } = this.state;
        if (selectedRows.length < 2) {
            message.warning('Please select at least two data');
        } else {
            this.gotoCompare(selectedRows);
        }
    }
    //回滚数据
    handleRollback = (data) => {
        const dbData = [this.props.transport, data];
        this.gotoCompare(dbData, 1);
    }

    //跳转到对比页面
    gotoCompare = (dbData, saveIndex) => {
        const { user: { timezone }, transport: { transportId }, onCompare } = this.props;

        const data = dbData.reduce((result, item) => {
            var time = tranTimeToUtcStr(item.deployDt, timezone);
            var title = `${item.versionNumber} -${time}`;
            result[title] = item;
            return result;
        }, {})

        const keys = Object.keys(data);
        let state = { select1: keys[0], select2: keys[1], dataList: data, keyToSave: keys[saveIndex] };
        if (onCompare) {
            onCompare(transportId, state);
        } else {
            router.push({ pathname: '/transport/history/compare/' + transportId, state });
        }
    }

    render() {
        const { timezone } = this.props.user;
        const columns = [
            {
                title: 'Version',
                dataIndex: 'versionNumber',
                align: 'center',
                render: text => {
                    return text.substring(8);
                }
            },
            {
                title: 'Action',
                dataIndex: 'isCreate',
                render: (text) => {
                    if (text) {
                        return 'Create';
                    } else {
                        return 'Update';
                    }
                }
            },
            {
                title: <span>Request Time<div className={styles.timezone}>{generateTimezoneText(timezone)}</div></span>,
                dataIndex: 'deployDt',
                render: (text) => {
                    return tranTimeToStr(text, timezone);
                }
            },
            {
                title: 'Roll back',
                align: 'center',
                render: (text, record, index) => {
                    if (!(this.state.currentPage === 1 && index === 0)) {
                        return <span>
                            <Button icon='history' onClick={() => { this.handleRollback(record) }}>{formatMessage({ id: 'transport.btn.rollback' })}</Button>
                        </span>
                    }
                },
            },
        ];

        const { currentPage, pageSize, total, tableData, selectedRows } = this.state;
        const pagination = {
            showSizeChanger: true,
            pageSize: pageSize,
            current: currentPage,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            total: total
        };

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let compareDisabled = true;
                if (selectedRows.length >= 2) {
                    compareDisabled = false;
                }
                this.setState({ selectedRows: [...selectedRows], compareDisabled })
            },
            selectedRowKeys: selectedRows.map(item => item.deployId)
        };

        return (
            <div className={styles.history}>
                <div className="custom-card-title custom-mb8">
                    {this.props.showTitle ? formatMessage({ id: `transport.form.title.history` }) : ''}
                    <Button type='primary' disabled={this.state.compareDisabled} onClick={this.handlerCompare}>Compare Selected Versions</Button>
                </div>
                <div className="custom-graph-bg custom-mb16">
                    <Card bordered={false} className="qtl-card custom-card-app-detail">
                        <Table size={this.props.size} columns={columns} rowSelection={rowSelection} dataSource={tableData}
                            pagination={pagination} onChange={this.onPageChange}
                            loading={this.state.loading}
                            rowKey={record => record.deployId} />
                    </Card>
                </div>
            </div>
        )
    }
}
