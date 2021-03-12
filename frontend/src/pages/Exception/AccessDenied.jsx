import React, { PureComponent } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from "dva";
import QtlException from '@/components/QtlException';


@connect(({ user }) => ({
  user,
}))
class AccessDenied extends PureComponent{

  render() {
    const { location } = this.props;
    const { currentUser } = this.props.user;
    let params = location.query;
    let url = params.url;
    const showBack = currentUser.accountForbidden == true?false:true;

    return (

      <QtlException
                errCode="Access Denied"
                showBack={showBack}
                inMain={true}
                errText='Notice'
                codeStyle={{fontSize:'45px',lineHeight:1.61}}
                errMessage={<span>You don't have access to <span style={{color: '#512da8'}}>{url}</span><br />
                If you believe this is an error, please contact our support team.</span>}
            />
    );
  }
}

export default AccessDenied;
