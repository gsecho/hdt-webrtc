import React from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import * as utils from '@/utils/utils';
import * as momentUtils from '@/utils/momentUtils';

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

@connect(({ loading }) => ({
    loading
}))
@Form.create()
class InputName extends React.Component {

    handleSubmit = () => {
      const { form: { validateFields} } = this.props;
      const promiseFun = validateFields((err, values) => {
        if (err) {
          console.log('Received values of form: ', values);
        }else{
            console.log('Received values of form: ', values);
        }
      });
      return promiseFun;
  };

  render(){
    
    const {
        form: { getFieldDecorator },
    } = this.props;
    
    return(
      <>
        <Form {...formLayout}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
                rules: [{ required: true}],
                // initialValue: editData.subject,
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </>
    )
  }
} 

export default InputName;
