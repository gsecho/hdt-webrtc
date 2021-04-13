import React from 'react';
import { connect } from 'dva';
import { DatePicker, Form, Input, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD HH:mm';

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
    colon: true
};

@connect(({ loading }) => ({
    loading
}))
@Form.create()
class AddMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            durationItems: []
        };
    }
    
    componentDidMount(){
        const tempItems = []
        for(let i =0; i<24; i+=1){
            tempItems.push(i);
        }
        this.setState({
            durationItems: tempItems
        })
    }

    dateChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
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
                dispatch({
                    type: 'meetingManager/createMeeting',
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
        const {durationItems} = this.state;
        const {
            form: { getFieldDecorator },
          } = this.props;
        // const { form: { getFieldValue } } = this.props;
        // const startTimer = getFieldValue('start');
        // const valueTimer = helper.tranMomentToUtcStr(startTimer);
        // console.log(valueTimer);
        return(
          <>
            <Form {...formLayout}>
              <Form.Item label="Subject">
                {getFieldDecorator('subject', {
                    rules: [{ required: true, message: 'Please input subject !'}],
                })(
                  <Input />
                )}
              </Form.Item>
              
              <Form.Item label="Start">
                {getFieldDecorator('start', {
                        rules: [{ required: true, message: 'Please select your start time!' }],
                    })(
                      <DatePicker showTime placeholder="Select Start Time" style={{minWidth: 300}} format={dateFormat} onChange={this.dateChange} onOk={this.dateOk} />
                    )
                }
              </Form.Item>
              
              <Form.Item label="duration">
                {getFieldDecorator('duration', {
                    rules: [{ required: true, message: 'Please select your duration!' }],
                })(
                  <Select 
                    key='0'
                    // placeholder="Select a option"
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
              <Form.Item label="会议内容">
                {getFieldDecorator('content', {
                    rules: [{ required: true, message: 'Please input meeting content!' }],
                })(
                  <TextArea rows={4} placeholder="请输入至少五个字符" />
                )}
              </Form.Item>
            </Form>
          </>
        )
    }
} 

export default AddMeeting;
