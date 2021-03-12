import React, { Component } from 'react'
import { Popover, Modal } from 'antd';
import styles from './style.less';
import { formatMessage } from 'umi/locale';
import lock from '@/assets/img-lock.svg';
import Support from '@/components/Support';


export default class VplPopup extends Component {

    getSupport = () => {
        Modal.info({
            content: (
                <div>
                    {formatMessage({ id: 'user.help.content.support' })}
                </div>
            ),
            onOk() { },
        });
    }

    render() {
        const content = (
            <div className={styles.content}>
                <div className={styles.img}>
                    <img src={lock} />
                </div>
                <div className={styles.message}>
                    {formatMessage({ id: 'report.message.content.notVpl1' })}
                    <Support>{formatMessage({ id: 'report.message.content.notVpl2' })}</Support>
                    {formatMessage({ id: 'report.message.content.notVpl3' })}
                </div>
            </div>
        );

        return (
            <>
                {!this.props.disabled ?
                    <Popover content={content} placement={this.props.placement||"bottomRight"} >
                        {this.props.children}
                    </Popover>
                    : this.props.children}
            </>
        )
    }
}
