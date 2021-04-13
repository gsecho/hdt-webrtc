/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
import React, { PureComponent } from 'react';
import { Table } from 'antd';

class QtlTable extends PureComponent {
  
  initData = {
    // 分页默认参数
    pagination: {
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      defaultCurrent: 1,
    },
  };

  // 处理pagination参数
  generatePagination = (oldProps) => {
    let newProps = false;
    if(oldProps !== undefined){
      newProps = { ...this.initData.pagination, ...oldProps };
    }
    return newProps;
  };

  // 如果没有key，则使用该方法生成key，rowKey参数
  generateRowKey = (record) => {
    let key;
    if(record && record.id){
      key = record.id;
    }else{
      key = `key${(new Date()).getTime() + Math.random() * 10}`;
    }
    return key;
  }

  render() {
    const { dataSource, pagination, ...rest} = this.props;

    const paginationProps = this.generatePagination(pagination);

    return (
      <div>
        <Table
          rowKey={record => this.generateRowKey(record)}
          dataSource={dataSource}
          pagination={paginationProps}
          {...rest}
        />
      </div>
    );
  }
}

export default QtlTable;
