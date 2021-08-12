import React from 'react';
import { connect } from 'dva';
import { DatePicker, Form, Input, Select, Switch, Icon } from 'antd';
import * as utils from '@/utils/utils';
import * as momentUtils from '@/utils/momentUtils';

const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
    labelCol: { 
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: { 
        xs: { span: 24 },
        sm: { span: 13 },
    },
    layout: 'horizontal',
    colon: false
};
const dateFormat = 'YYYY-MM-DD HH:mm';

@connect(({ loading }) => ({
    loading
}))
@Form.create()
class EditMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            durationItems: [],
            maxMemberList: [2, 4, 6 , 9, 12 , 16 , 20 , 25]
        };
    }
    
    componentDidMount(){
      // console.log(this.props);
        const tempItems = []
        for(let i =0; i<24; i+=1){
            tempItems.push(i);
        }
        this.setState({
            durationItems: tempItems
        })
    }
    
    dateChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }
      
    dateOk = value =>{
        console.log('onOk: ', value);
    }

    handleSelectChange = value => {
        console.log(value);
    };
    
    handleSubmit = () => {
      const { form: { validateFields} } = this.props;
       validateFields((err, values) => {
          if (err) {
            console.log('Received values of form: ', values);
          }else{
              const currentTime = momentUtils.convertLocalStringToUtcString(values.start)
              const { dispatch } =  this.props;
              console.log('Received values of form: ', values);
              dispatch({
                  type: 'meetingManager/updateMeeting',
                  payload: { 
                    'id': values.id,
                    'subject': values.subject,
                    'startTime': currentTime , 
                    'durationMin': utils.meetingDurationIndexToMin(values.duration),
                    'content': values.content,
                    'maxMember': values.maxMember,
                    'password': values.password,
                    'adminPassword': values.adminPassword,
                    'status': values.switchStatus ? 0: 1,
                },
              })
          }
        });
      
  };

    render(){
      
        const {durationItems, maxMemberList} = this.state;
        const {
            form: { getFieldDecorator },
            data: editData,
        } = this.props;
        const switchStatus = editData.status === 0;
        editData.switchStatus = switchStatus
        return(
          <>
            <Form {...formLayout}>
              <Form.Item label="Id">
                {getFieldDecorator('id', {
                    initialValue: editData.id,
                })(
                  <Input disabled />
                )}
              </Form.Item>

              <Form.Item label="Subject">
                {getFieldDecorator('subject', {
                    rules: [{ required: true}],
                    initialValue: editData.subject,
                })(
                  <Input />
                )}
              </Form.Item>
              
              <Form.Item label="Start">
                {getFieldDecorator('start', {
                        rules: [{ required: true, message: 'Please select your start time!' }],
                        initialValue: editData.start,
                    })(
                      <DatePicker showTime placeholder="Select Time" style={{minWidth: 320}} format={dateFormat} onChange={this.dateChange} onOk={this.dateOk} />
                    )
                }
              </Form.Item>
              
              <Form.Item label="Duration">
                {getFieldDecorator('duration', {
                    rules: [{ required: true, message: 'Please select your duration!' }],
                    initialValue: editData.duration,
                })(
                  <Select 
                    key='0'
                    placeholder="Select a option"
                    onChange={this.handleSelectChange}
                  >
                    { 
                        durationItems.map( val => {
                            if(val === 0 ){
                              return <Option key={val} value={val}>30 minutes</Option>
                            }if(val === 1 ){
                                return <Option key={val} value={val}>{val} hour</Option>
                            }
                                return  <Option key={val} value={val}>{val} hours</Option>
                        } ) 
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="Attendance">
                {getFieldDecorator('maxMember', {
                    rules: [{ required: true, message: 'Please select your attendance !' }],
                    initialValue: editData.maxMember,
                })(
                  <Select 
                    key='0'
                    onChange={this.handleSelectAttendance}
                  >
                    { 
                        maxMemberList.map( val => <Option key={val} value={val}>{val} </Option> )
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                    initialValue: editData.password,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="AdminPassword">
                {getFieldDecorator('adminPassword', {
                    initialValue: editData.adminPassword,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="Status">
                {getFieldDecorator('switchStatus', {
                        rules: [{ required: true}],
                        valuePropName: 'checked', initialValue: editData.switchStatus
                    })(
                      <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                      // <Switch checkedChildren="active" unCheckedChildren="suspended" defaultChecked />
                    )
                }
              </Form.Item>
              <Form.Item label="Content">
                {getFieldDecorator('content', {
                    rules: [{ required: true, message: 'Please input meeting content!' }],
                    initialValue: editData.content,
                })(
                  <TextArea rows={4} placeholder="Please input meeting content" />
                )}
              </Form.Item>
            </Form>
          </>
        )
    }
} 

export default EditMeeting;
