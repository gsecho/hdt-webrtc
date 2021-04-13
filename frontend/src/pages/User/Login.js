import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Checkbox, Drawer, Form, Icon, Input} from 'antd';
import logoWord from '@/assets/cdnw.svg';
import logo from '@/assets/cdnwLogo.svg';


@connect(({ userLogin, loading }) => ({
  userLogin,
  loading,
}))
@Form.create()
class LoginPage extends PureComponent {
  state = {
    loginDrawer: true,
    drawerWidth: 400
  };
  
  toggleLeftView = () => {
    this.toggleLogin();
    this.toggleForgetPassword();
  };

  // 切换忘记密码组件
  // toggleForgetPassword = (status='') => {
  //   const { forgetDrawer } = this.state;
  //   let state = !forgetDrawer;
  //   if(status !== ''){
  //     state = status;
  //   }
  //   this.setState({forgetDrawer: state});
  // };

  // 切换显示登录组件
  // toggleLogin = (status='') => {
  //   // let state = !this.state.loginDrawer;
  //   // if(status !== ''){
  //   //   state = status;
  //   // }
  //   this.setState( (state) => {
  //     let localState = !state.loginDrawer;
  //     if(status !== ''){
  //         localState = status;
  //     }
  //     return {loginDrawer: localState}
      
  //   });
  //   // this.setState( () => ( {loginDrawer: state} ) ); // 函数式
  //   // this.setState({loginDrawer: state});// 直接setState是不能立刻取到状态的
  // };

  // 登录事件 操作
  handleLogin = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      // 发起登陆请求
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/login',
        payload: {...values}
      });
    });
  };

  // 忘记密码
  // handleForgetPassword = (e) => {
  //   e.preventDefault();
  //   const { form } = this.props;
  //   form.validateFields((err, values) => {
  //     if(err){

  //     }
  //     // const params = {...values};
  //     // TODO: dev
  //   });
  // }

  render() {
    const {
      form: { getFieldDecorator },
      userLogin: { authFailureDisplay },
    } = this.props;
    
    const { loginDrawer, drawerWidth } = this.state;
    return (
      <Fragment>
        <Drawer
          placement="left" 
          closable={false}
          visible={loginDrawer}
          mask={false}
          width={drawerWidth}
        >
          <div className="custom-login-left-view">
            <div className="custom-login-left-logo"><img alt="logo" src={logo} /></div>
            <div className="custom-login-left-logoword"><img alt="logo" src={logoWord} /></div>
            <div className="custom-mt32">
              <Form onSubmit={this.handleLogin}>
                <div className="custom-mb16">Portal Login</div>
                <Form.Item>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input your username !' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password !' }],
                })(
                  <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
                </Form.Item>
                <div className="custom-mb2" style={{ color: "red", display: authFailureDisplay }}>Authentication failure</div>
                <Form.Item>
                  {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox>Remember me</Checkbox>
                )}
                  
                  <Button type="primary" htmlType="submit" className="login-form-button custom-float-r custom-login-left-btn">Log in</Button>
                </Form.Item>
                {/* <a className="custom-login-form-forgot" href="#" onClick={this.toggleLeftView}>Forgot password</a> */}
              </Form>
            </div>
          </div>
        </Drawer>
      </Fragment>
    );
  };
}

export default LoginPage;
