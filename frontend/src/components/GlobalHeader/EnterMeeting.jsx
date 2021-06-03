import React from 'react';
import { connect } from 'dva';
import { Form, Input, Icon } from 'antd';


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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 13,
      offset: 7,
    },
  },
};

@connect(({ loading, meetingEnter }) => ({
    loading, meetingEnter
}))
@Form.create()
class GlobalHeaderEnterMeeting extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          
      };
  }
  
  componentDidMount(){
      
  }

  handleSubmit = () => {
    const { form, form: { validateFields} } = this.props;
      validateFields((err, values) => {
        if (err) {
          console.log('Received values of form: ', values);
        }else{
            // const currentTime = values.start.utc().format(dateFormat)
            const {dispatch } =  this.props;
            dispatch({
                type: 'meetingEnter/auth',
                payload: { 
                    'id': values.roomId,
                    'password': values.roomPassword,
                },
            })
            form.resetFields();
        }
      });
  };

  render(){
    const {
        form: { getFieldDecorator }, meetingEnter: { enterAuthFailFlag }
      } = this.props;
      let authResultDispaly = 'none';
      if(enterAuthFailFlag){
        authResultDispaly = ''
      }

    return(
      <>
        <Form {...formLayout}>
          <Form.Item label="RoomId">
            {getFieldDecorator('roomId', {
                rules: [{ required: true, message: 'Please input Room Id !'}],
            })(
              <Input prefix={<Icon type="video-camera" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            )}
          </Form.Item>
          <Form.Item label="Password">
            {getFieldDecorator('roomPassword', {
                rules: [{ required: true, message: 'Please input Password !'}],
            })(
              <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <div className="custom-mb2" style={{ color: "red", display: authResultDispaly }}>username or password error</div>
          </Form.Item>
          
        </Form>
      </>
    )
  }
} 

export default GlobalHeaderEnterMeeting;
