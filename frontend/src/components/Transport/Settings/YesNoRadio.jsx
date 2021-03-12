import React, { Component } from 'react'
import { Input, Radio, InputNumber } from 'antd';
import { noYesList } from '@/utils/Constants'
import styles from './settings.less'
import lodash from 'lodash';

export default class YesNoRadio extends Component {
    handleRadioChange = (e) => {
        const { onChange } = this.props;
        const fix = e.target.value;
        if (fix) {
            onChange({ fix, text: this.oldValue })
        } else {//清空数据
            onChange({ fix, text: '' })
        }
    }
    handleInputChange = (e) => {
        const text = e.target ? e.target.value : e;
        this.oldValue = text;
        this.props.onChange({ ...this.props.value, text });
    }

    componentWillReceiveProps({value}) {
        let fix = 0,text = '';
        if (!lodash.isObject(value)) {
            if (value) {
                fix = 1;
                text = value;
            }
            this.props.onChange({ fix, text })
        }
    }
    

    render() {
        const { value = { fix: 0, text: '' }, unit, isNumber } = this.props;
        const unitSpan = unit && fix ? <span>{unit}</span> : "";
        const { fix, text } = value;

        return (
            <div className={styles.formItem}>
                <Radio.Group value={fix} onChange={this.handleRadioChange}>
                    {noYesList.map(item => <Radio key={item.value} value={item.value}>{item.text}</Radio>)}
                </Radio.Group>
                <div>
                    {isNumber ? <InputNumber style={{ display: (fix ? 'inline-block' : 'none') }} min={0} value={text} onChange={this.handleInputChange}></InputNumber> :
                        <Input type={fix ? 'text' : 'hidden'} value={text} onChange={this.handleInputChange}></Input>}
                </div>
                {unit && fix ? <span className={styles.unit}>{unit}</span> : ""}
            </div>
        )
    }
}
