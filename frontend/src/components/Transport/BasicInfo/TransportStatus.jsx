import React, { Component } from 'react'
import { Button } from 'antd';

import { statusList } from '@/utils/Constants'

export default class TransportStatus extends Component {
    handleChange = () => {
        const value = 1 ^ this.props.value;
        this.props.onChange(value);
    }

    render() {
        const { value } = this.props;
        const statusHtml = statusList.find(item => item.value === value)
        return (
            <>
                <div style={{ display: 'inline-block', width: '100px' }}>{statusHtml ? statusHtml.text : ''}</div><Button onClick={this.handleChange} icon={value === 1 ? 'stop' : 'check-circle'}>{statusHtml.oper}</Button>
            </>
        )
    }
}
