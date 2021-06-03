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
class CreateUser extends React.Component {
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
              const {dispatch } =  this.props;
              dispatch({
                  type: 'user/createUser',
                  payload: { 
                      'username': values.username,
                      'password': values.password,
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
          <Form {...formLayout}>
            <Form.Item label="Username">
              {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input username!'}],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
            </Form.Item>
            <Form.Item label="Password">
              {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input password!' }],
                    })(
                      <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
            </Form.Item>
          </Form>
        )
    }
}

export default CreateUser;
