import React, { PureComponent, Fragment } from 'react';
import { Select } from 'antd';
import './custom.less';

class QtlSelect extends PureComponent {
  constructor(props) {
    super(props);
    const eleName = 'qtlSelect' + (new Date()).getTime();
    this.eleName = eleName;
  }

  componentDidMount() {
    this.initView();
  };

  initView = () => {
    let { prefixTitle } = this.props;
    
    prefixTitle = prefixTitle ? prefixTitle : 'Select';
    let ele = document.getElementsByClassName(this.eleName);
    let subEle = ele[0].getElementsByClassName('ant-select-selection-selected-value');
    if(subEle[0]){
      subEle[0].setAttribute('data-prefix', prefixTitle);
    }
  }

  render() {
    const { children, className, ...restProps} = this.props;

    return (
      <Select {...restProps} className={`custom-select ${this.eleName} ${className}`}>
        {children}
      </Select>
    );
  }
}

export default QtlSelect;
