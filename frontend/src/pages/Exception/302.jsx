import React, { PureComponent } from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';

@connect()
class Exception302 extends PureComponent {
    state = {
        url: '',
        timer: '',
    };

    componentDidMount() {
        let str = sessionStorage.getItem('user');
        let user = JSON.parse(str);

        if (!lodash.isEmpty(user)) {
            let logoutUrl = user.logoutUrl;
            this.setState({ url: logoutUrl });
            // 清空登录信息
            const { dispatch } = this.props;
            dispatch({
                type: 'user/logout'
            }).then((resp) => {
                // 跳转
                // window.location.href = encodeURI(logoutUrl);
                window.location.href = logoutUrl;
            });
        } else {
            // 通过发送请求的方式让页面重定向
            const { dispatch } = this.props;
            dispatch({
                type: 'user/logout'
            });
        }

        // 设置定时器
        let t = setTimeout(() => {
            // 清空登录信息
            const { dispatch } = this.props;
            dispatch({
                type: 'user/logout'
            });
        }, 3000);
        this.setState({ timer: t });
    }

    componentWillUnmount() {
        // 销毁定时器
        const { timer } = this.state;
        if (timer != '') {
            clearTimeout(timer);
        }
    }

    render() {
        return (
            <QtlException errCode="302"
                errMessage={formatMessage({ id: 'app.exception.description.302' })}
            />
        );
    }
}

export default Exception302;