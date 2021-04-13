import React from 'react';
import { connect } from 'dva';
import { DatePicker, Form, Input, Select, Switch, Icon } from 'antd';

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
const dateFormat = 'YYYY/MM/DD HH:mm';

@connect(({ loading }) => ({
    loading
}))
@Form.create()
class EditMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // startDate: new Date(),
            durationItems: []
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
              const currentTime = values.start.utc().format(dateFormat)
              const {dispatch } =  this.props;
              console.log('Received values of form: ', values);
              dispatch({
                  type: 'meetingManager/updateMeeting',
                  payload: { 
                      'subject': values.subject,
                      'start': currentTime , 
                      'duration': values.duration,
                      'content': values.content,

                  },
              })
          }
        });
      
  };

    render(){
        // console.log(this.props);
        const {durationItems} = this.state;
        const {
            form: { getFieldDecorator },
            data: editData,
          } = this.props;
        return(
          <>
            <Form {...formLayout} onSubmit={this.handleLogin}>
              <Form.Item label="Id">
                {getFieldDecorator('Id', {
                    initialValue: editData.id,
                })(
                  <Input disabled />
                )}
              </Form.Item>

              <Form.Item label="Subject">
                {getFieldDecorator('Subject', {
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
              
              <Form.Item label="duration">
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
              
              {/* <Form.Item label="status">
                {getFieldDecorator('serviceStatus', {
                        rules: [{ required: true}],
                        valuePropName: 'checked',
                        initialValue: editData.serviceStatus ,
                    })(
                      <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                      />
                    )
                }
              </Form.Item> */}
              <Form.Item label="会议内容">
                {getFieldDecorator('content', {
                    rules: [{ required: true, message: 'Please input meeting content!' }],
                    initialValue: editData.content,
                })(
                  <TextArea rows={4} placeholder="请输入至少五个字符" />
                )}
              </Form.Item>
            </Form>
          </>
        )
    }
} 

export default EditMeeting;
