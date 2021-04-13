import React, { Component } from 'react'
import { connect } from 'dva';
import { Button, Divider, Card, Modal, Popconfirm } from 'antd';
import QtlTable from '@/components/QtlTable';
import lodash from 'lodash'
import moment from 'moment'
import AddMeeting from './addMeeting'
import EditMeeting from './editMeeting'

import styles from './styles.less'

@connect(({ meetingManager, loading, user }) => ({
  meetingManager,
  loading,
  user
}))
class MeetingTable extends Component {
  
  state = {
      selectedRowKeys: [], // Check here to configure the default column
      editData: {} 
  };
      
  componentDidMount(){
    const {dispatch } =  this.props;
    dispatch({
      type: 'meetingManager/readMeetingList',
      payload: { pageNum:1 , pageSize: 10 },
    })
    
  }

  addButtonHandler = () => {
    const { dispatch } =  this.props;
    dispatch({
      type: 'meetingManager/updateAddModalVisible',
      payload: true // 关闭
    })
  };

  addPageButtonOk = e => {
    e.preventDefault();
    this.addformRef.handleSubmit()// 调用下级组件的方法
  };

  addPageButtonCancel = () => {
    const { dispatch } =  this.props;
    dispatch({
      type: 'meetingManager/updateAddModalVisible',
      payload: false // 关闭
    })
  };

  editButtonHandler = (lineData) =>{
    console.log("lineData", lineData);
    const { dispatch } =  this.props;
    this.setState({
      editData: lineData
    })
    dispatch({
      type: 'meetingManager/setEditModalVisible',
      payload: true // 开启
    })
  };

  editPageButtonOk = e => {
    e.preventDefault();
    this.editformRef.handleSubmit()// 调用下级组件的方法
  };

  editPageButtonCancel = e => {
    e.preventDefault();
    const { dispatch } =  this.props;
    dispatch({
      type: 'meetingManager/setEditModalVisible',
      payload: false // 关闭
    })
  }; 

  // 删除单行处理
  deleteLine = (info) => {
    // 请求后端删除
    // 重新加载数据.
    // console.log(this.props);
    const { dispatch } =  this.props;
    const {id: mid} = info;
    dispatch({
      type: 'meetingManager/deleteMeetingById',
      payload: { 'id': mid},
    })
  }

  onSelectChange = selectedRowKeys => {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys }); // 修改选中的行
  };
  
  /**
   * 分页、排序、筛选变化时触发
   * @param {*} pagination :页面变化的时候，传入的是页码 类型是number,然后会传入object,携带的是分页参数
   * @param {*} filters 
   * @param {*} sorter 
   * @param {*} extra 数据变化的时候传入表格数据{ currentDataSource: [] }
   */
  tablePageChange = (pagination, filters, sorter, extra) => {
    // console.log(pagination);
    // console.log(filters);
    // console.log(sorter);
    // console.log(extra);
    // 重新发起请求
    const {dispatch} =  this.props;
    if(lodash.isPlainObject(pagination)){
      const { current, pageSize } = pagination;
      dispatch({
        type: 'meetingManager/readMeetingList',
        payload: { 
          'pageNum': current , 
          'pageSize': pageSize,
        },
      })
    }
  }
    
  render(){
    // 显示meeting record的状态，如果要看 现在是 0:active, 1:processing, 2:end, suspended:3 ，这个需要自己实时去算
    // 0:active, 1:processing, 2:end, suspended:3  
    const statusList = (() => [
      { text: <div className={styles.statusDot}><div className={styles.blue} /><span>Active</span> </div>   , name: 'active',   value: 0},
      { text: <div className={styles.statusDot}><div className={styles.red} /><span>Suspended</span> </div> , name: 'suspended',  value: 1},
      { text: <div className={styles.statusDot}><div className={styles.grey} /><span>DeleteD</span> </div> , name: 'deleted',  value: 2},
      // { text: <div className={styles.statusDot}><div className={styles.green} /><span>Processing</span> </div>, name: 'processing', value: 1},
      // { text: <div className={styles.statusDot}><div className={styles.grey} /><span>END</span> </div>      , name: 'end',      value: 2},
      
    ])();
    const meetingColumns = [
      {
          title: 'Id',
          dataIndex: 'id',
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
      },
      {
        title: 'Start',
        dataIndex: 'localTime',
      },
      {
        title: 'Password',
        dataIndex: 'password',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
            // console.log("record", record)
            const statusObj = statusList.find(item => item.value === record.status)
            return (statusObj && statusObj.text) || '';
          }
      },
      {
          title: 'CreateBy',
          dataIndex: 'createBy',
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) =>
        (
          <>
            <Button type="link" onClick={()=>this.editButtonHandler(record)}>
              Edit
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteLine(record)}>
              <a>Delete</a>
            </Popconfirm>
          </>
        ),
      }
        
    ];
       
    // const data = [];
    const { selectedRowKeys, editData } = this.state;
    const { loading} =  this.props;
    const meetingListFlag = loading.effects["meetingManager/readMeetingList"]; // 标志:  false表示异步动作结束，监听已取消
    const {meetingManager: { addModalVisible, editModalVisible, data :{ pageNum, pageSize, total, list: tableRawList } }} = this.props;
    // console.log(this.props)
    // const { done } = this.props;
    const tableList = []
    if (tableRawList){
      for(let i=0; i<tableRawList.length;i+=1){
        const line = tableRawList[i];
        const utcOffset = moment().utcOffset();// 可以改成可设置, 如果时间不准可以调这个 设置到特定时区
        const dateFormate = 'YYYY-MM-DD HH:mm';
        const startMoment = moment.utc(line.start, dateFormate).utcOffset(utcOffset)
        const displayTime = startMoment.format(dateFormate);
        // const serviceStatus = line.status === 0;// 0：正常， 1：挂起， 2：删除 

        tableList.push({
          ... line,
          localTime: displayTime, // 增加字段用于显示 
          start: startMoment, 
        })
      }
    }
    
    

    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
    };
      // 分页按键效果
    const paginationProps = {
      current: pageNum,       // 当前页
      defaultCurrent: 1,      // 默认的当前页数
      pageSize: pageSize || 10, // 每页数量
      total: total || 0,  // 数量
      size: 'large',
      onChange : (page) => this.tablePageChange(page),
    }

      const hasSelected = selectedRowKeys.length > 0; // 使能/置灰 批量删除 按钮
      
      return(
        <>
          <Card className="qtl-card">
            <div className="custom-mb16">
              <Button type='primary' icon="plus" style={{ lineHeight: '1.5' }} onClick={this.addButtonHandler}>新建会议</Button>
              <Button type='primary' icon="delete" style={{ lineHeight: '1.5', marginLeft: '5px' }} onClick={this.batchDelete} disabled={!hasSelected}>批量删除</Button>
            </div>
            <QtlTable
              loading={meetingListFlag}
              dataSource={tableList}
              // scroll={{}}
              columns={meetingColumns}
              pagination={paginationProps}
              onChange={this.tablePageChange}
              rowSelection={rowSelection}
              size="middle"
            />
            <Modal
              title="创建会议"
              visible={addModalVisible}
              onOk={this.addPageButtonOk}
              onCancel={this.addPageButtonCancel}
              // style={{ top: 30 }}
              width={640}
              // bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
            >
              {/* <AddMeeting tempFunc={(form) => {this.addformRef = form}} /> */}
              <AddMeeting wrappedComponentRef={(form) => {this.addformRef = form}} />
            </Modal>
            <Modal
              title="修改会议"
              visible={editModalVisible}
              onOk={this.editPageButtonOk}
              onCancel={this.editPageButtonCancel}
              // style={{ top: 30 }}
              width={640}
              // bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
            >
              <EditMeeting data={editData} wrappedComponentRef={(form) => {this.editformRef = form}} />
            </Modal>
          </Card>
        </>
      )
  }
}
export default MeetingTable;