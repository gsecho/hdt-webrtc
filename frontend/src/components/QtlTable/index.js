import React, { PureComponent } from 'react';
import { Table } from 'antd';

class QtlTable extends PureComponent {
  // static getDerivedStateFromProps(nextProps, preState) {
  //   return null;
  // }

  initData = {
    // 分页默认参数
    pagination: {
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      defaultCurrent: 1,
    },
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  // 处理pagination参数
  generatePagination = (oldProps) => {
    let newProps = false;
    if(oldProps !== undefined){
      newProps = { ...this.initData.pagination, ...oldProps };
    }
    return newProps;
  };

  // 处理rowKey参数
  generateRowKey = (record) => {
    let key = 'key' + (new Date()).getTime() + Math.random() * 10;
    if(record && record.id){
      key = record.id;
    }
    return key;
  }

  render() {
    const { dataSource, pagination, ...rest} = this.props;

    let paginationProps = this.generatePagination(pagination);

    return (
      <div>
        <Table
          rowKey={record => this.generateRowKey(record)}
          dataSource={dataSource}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default QtlTable;
