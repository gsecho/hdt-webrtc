import React, { Component } from 'react';
import { Input } from 'antd';
import lodash from 'lodash';

export default class DomainInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            suffix: '',
            prefix: ''
        }
    }

    componentDidMount() {
        this.setFix(this.props.value);
    }
    componentWillReceiveProps(newProps) {
        this.setFix(newProps.value);
    }
    setFix = (value) => {
        const { defaultDomainName, allSuffixs } = this.props;
        const suffixs = allSuffixs.split(',');
        let suffix = defaultDomainName;
        let prefix = value;

        if (!lodash.isEmpty(value)) {
            suffix = suffixs.find(item => value.endsWith(item));

            prefix = value.substring(0, value.lastIndexOf(suffix) - 1);
        }

        this.setState({ suffix: `.${suffix}`, prefix });
    }
    handleInputChange = (e) => {
        this.setState({ prefix: e.target.value });
        if (e.target.value) {
            this.props.onChange(e.target.value + this.state.suffix);
        } else {
            this.props.onChange('');
        }
    }
    render() {
        return (
            <Input addonAfter={this.state.suffix} value={this.state.prefix} onChange={this.handleInputChange} placeholder={this.props.placeholder} />
        )
    }
}
