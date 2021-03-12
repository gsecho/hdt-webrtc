import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, notification, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import QtlTable from '@/components/QtlTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import * as pop from '@/utils/pop';
import * as helper from '@/utils/helper';
import router from 'umi/router';
import lodash from 'lodash';
import { statusList } from '@/utils/Constants'

const Search = Input.Search;

@connect(({ application, user, loading }) => ({
  application,
  user,
  loading,
}))
@Form.create()
class Index extends PureComponent {
  state = {
    applicationModal: {
      visible: false,
      title: '',
      type: '',
    },

    // 搜索关键词
    search: '',
    // 分页参数
    pageSize: 10,
    page: 1,
    status: ''
  };

  initData = {
    // 表头
    columns: [
      {
        align: 'center',
        title: formatMessage({ id: 'user.customerList.header.customerId' }),
        dataIndex: 'cId',
      },
      {
        title: formatMessage({ id: 'user.customerList.header.customerName' }),
        dataIndex: 'name',
        width: 300,
      },
      {
        align: 'left',
        title: formatMessage({ id: 'user.customerList.header.customerStatus' }),
        dataIndex: 'status',
        filters: statusList,
        filterMultiple: false,
        width: 100,
        render: (text, record) => {
          const { status } = record;

          const statusObj = statusList.find(item => item.value == status);
          return statusObj ? statusObj.text : '';
        }
      },
      {
        align: 'center',
        title: formatMessage({ id: 'user.customerList.header.action' }),
        render: (text, record) => {
          const { proxyUser, currentUser } = this.props.user;
          if (proxyUser && proxyUser.cId === record.cId) {
            return <>
              <Button type="primary" onClick={() => this.handleStopImpersonation(text, record)}>{formatMessage({ id: 'user.customerList.btn.stop' })}</Button>
            </>
          } else {
            let disabled = currentUser.cid == record.cId;
            return <>
              <Button onClick={() => this.handleImpersonation(text, record)} disabled={disabled}>{formatMessage({ id: 'user.customerList.btn.impersonate' })}</Button>
            </>
          }

        },
      },
    ],
  };

  componentDidMount() {
    const { user } = this.props;
    if (!lodash.isEmpty(user.currentUser)) {
      this.showNotice();
      this.initView();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // 代理用户发生变化时
    const { user } = this.props;
    if ((!lodash.isEmpty(user.currentUser) && !lodash.isEqual(user.proxyUser, prevProps.user.proxyUser))
      || !lodash.isEqual(user.currentUser, prevProps.user.currentUser)) {
      this.showNotice();
      this.initView();
    }
  }

  initView = (page = 1, pageSize = 10, search = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getCustomerList',
      payload: {
        start: parseInt((page - 1) * pageSize),
        length: parseInt(pageSize),
        search: search || this.state.search,
        status: this.state.status
      },
    });
  }

  showNotice = () => {
    const { isSuperAdmin, hasAccount } = this.props.user;
    if (isSuperAdmin && !hasAccount) {
      pop.showWarning(formatMessage({ id: 'hdt.info.login.superAdmin' }), 0, formatMessage({ id: 'hdt.info.login.superAdmin.title' }));
    }
  };

  hideNotice = () => {
    notification.destroy();
  };

  handleTableChange = (pagination, filters = {}, sorter) => {
    let page = pagination.current;
    let pageSize = pagination.pageSize;
    const { status } = filters;
    this.setState({ status: status && !isNaN(status[0]) ? status[0] : '', pageSize: pageSize, page: page }, state => {
      this.initView(page, pageSize);
    });

  };

  // 搜索框
  handleSearch = (value) => {
    this.setState({ page: 1 });
    this.initView(1, this.state.pageSize, value);
  };

  handleSearchChange = (e) => {
    let value = e.target.value;
    this.setState({ search: value });
  };

  // 停止授权
  handleStopImpersonation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/refreshProxyUser'
    });
  };

  handleImpersonation = (text, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/refreshProxyUser',
      payload: record,
    });
    dispatch({
      type: 'user/getCustomer',
      payload: {
        id: record.id,
      },
    });
    // 关闭
    this.hideNotice();
    // 跳转
    router.push('/dashboard');
  };

  render() {
    let loading = this.props.loading.models.user;
    let dataSource = this.props.user.customerList;
    let breadcrumbParam = 'Customer List';
    let pagination = {
      current: this.state.page,
      defaultCurrent: 1,
      pageSize: this.state.pageSize || 10,
      total: this.props.user.customerRecordCount || 0,
    };

    return (
      <div>
        <PageHeaderWrapper breadcrumbParam={breadcrumbParam} pageHeaderClass="no-border">
          <div className="custom-content-view">
            <Card className="qtl-card">
              <div className="custom-mb16">
                <Search placeholder="Enter a customer name" onSearch={this.handleSearch} style={{ width: 240 }} value={this.state.search} onChange={this.handleSearchChange} />
              </div>

              <div className="custom-pb8">
                <QtlTable
                  loading={loading}
                  dataSource={dataSource}
                  columns={this.initData.columns}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  size="middle"
                />
              </div>
            </Card>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Index;
