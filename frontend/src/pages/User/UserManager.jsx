/*
 * @Author: chenrf
 * @Date: 2021-05-17 15:09
 */
import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Card, Modal, Popconfirm } from 'antd';
import QtlTable from '@/components/QtlTable';
import lodash from 'lodash'
import CreateUser from './CreateUser'

@connect(({ loading, user }) => ({
    loading, user,
}))
class UserManager extends React.Component {

    componentDidMount(){
        const { dispatch, user: { users: { pageNum, pageSize } } } =  this.props;
        dispatch({
          type: 'user/getUserlist',
          payload:{
              'pageSize':pageSize,
              'pageNum': pageNum,
          }
        })
    }

    /**
     * 分页、排序、筛选变化时触发
     * @param {*} pagination :页面变化的时候，传入的是页码 类型是number,然后会传入object,携带的是分页参数
     * @param {*} filters 
     * @param {*} sorter 
     * @param {*} extra 数据变化的时候传入表格数据{ currentDataSource: [] }
     */
    tablePageChange = (pagination, filters, sorter, extra) => {
        // 重新发起请求
        const {dispatch} =  this.props;
        if(lodash.isPlainObject(pagination)){
        const { current, pageSize } = pagination;
        dispatch({
            type: 'user/getUserlist',
            payload: { 
            'pageNum': current , 
            'pageSize': pageSize,
            },
        })
        }
    }

    // 删除单行处理
    deleteLine = (info) => {
        // 请求后端删除
        // 重新加载数据.
        const { dispatch } =  this.props;
        const {id} = info;
        dispatch({
        type: 'user/deleteUser',
        payload: { 'id': id},
        })
    }

    createButtonHandler = () => {
        const { dispatch } =  this.props;
        dispatch({
            type: 'user/setCreateUserVisible',
            payload: true // 显示
        })
    }

    createPageButtonOk = e => {
        e.preventDefault();
        this.addformRef.handleSubmit()// 调用下级组件的方法
    }

    createPageButtonCancel = () => {
        const { dispatch } =  this.props;
        dispatch({
            type: 'user/setCreateUserVisible',
            payload: false // 隐藏
        })
    }

    render() {
        const userColumns = [
            {
                title: 'Id',
                dataIndex: 'id',
            },
            {
              title: 'Username',
              dataIndex: 'username',
            },
            {
              title: 'Roles',
              dataIndex: 'roles',
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) =>
              (
                <>
                  {/* <Button type="link" onClick={()=>this.editButtonHandler(record)}>Edit</Button> */}
                  {/* <Button type="link" onClick={()=>this.gotoButtonHandler(record)}>Goto</Button> */}
                  {/* <Divider type="vertical" /> */}
                  <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteLine(record)}>
                    <a>Delete</a>
                  </Popconfirm>
                </>
              ),
            }      
        ];

        const { user: {users: { pageSize, pageNum, total, list: tableList }}} = this.props;
        // 分页按键效果
        const paginationProps = {
            current: pageNum,       // 当前页
            defaultCurrent: 1,      // 默认的当前页数
            pageSize: pageSize || 10, // 每页数量
            total: total || 0,  // 数量
            size: 'large',
            onChange : (page) => this.tablePageChange(page),
        }
        const { user: { createVisible } }= this.props;
        return (
          <div>
            <PageHeaderWrapper pageHeaderClass="no-border">
              <div className="custom-content-view">
                <Card className="qtl-card">
                  <div className="custom-mb16">
                    <Button type='primary' icon="plus" style={{ lineHeight: '1.5' }} onClick={this.createButtonHandler}>create</Button>
                  </div>

                  <QtlTable
                //   loading={meetingListFlag}
                    dataSource={tableList || []}
                // scroll={{}}
                    columns={userColumns}
                    pagination={paginationProps}
                    onChange={this.tablePageChange}
                //   rowSelection={rowSelection}
                    size="middle"
                  />
                  <Modal
                    title="modify"
                    visible={createVisible}
                    onOk={this.createPageButtonOk}
                    onCancel={this.createPageButtonCancel}
              // style={{ top: 30 }}
                    width={640}
                  >
                    <CreateUser wrappedComponentRef={(form) => {this.addformRef = form}} />
                  </Modal>
                </Card>
              </div>
            </PageHeaderWrapper>
          </div>
        )
    }
}

export default UserManager;
