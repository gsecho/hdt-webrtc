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

@connect(({ loading }) => ({
    loading
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
      const { form: { validateFields} } = this.props;
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
          }
        });
      
  };

  render(){
    const {
        form: { getFieldDecorator },
      } = this.props;
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
          <div className="custom-mb2" style={{ color: "red", display: 'none' }}>login failure</div>
        </Form>
      </>
    )
  }
} 

export default GlobalHeaderEnterMeeting;
