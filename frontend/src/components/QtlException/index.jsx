import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import logo from '@/assets/cdnw.svg';
import logoText from '@/assets/cdnwText.svg';
import Footer from '@/layouts/Footer';
import * as pop from '@/utils/pop';
import router from 'umi/router';
import styles from './exception.less'


export default class QtlException extends PureComponent {

    handleBack = () => {
        const { logoutUrl } = this.props;
        if (logoutUrl) {
            window.location.href = logoutUrl;
        } else {
            // 跳转回首页
            router.push('/');
        }
    };

    handleContact = () => {
        router.push('/contacts');
    };

    handleRelogin = () => {
        const { logoutUrl } = this.props;
        logoutUrl && (window.location.href = logoutUrl);
    }

    render() {
        const { errCode, errMessage, errText, codeStyle, showBack = true, showContact = true, inMain = false, showRelogin = false, ...restProps } = this.props;

        return (
            <>
                <div className={`${styles.exception} ${inMain ? styles.inMain : ''}`}>
                    <div>
                        <div className={styles.logo}><img src={logoText}></img></div>
                        <Card className={styles.content} style={{ width: 800 }}>
                            <div className={styles.code} style={codeStyle ? codeStyle : {}}>{errCode}</div>
                            <div className={styles.text}>{errText ? errText : 'Error Code'}</div>
                            <div className={styles.message}>{errMessage}</div>
                            {showBack ? <Button type="primary" className="{button}" onClick={this.handleBack}>Back</Button> : ''}
                            {showContact ? <Button type="primary" className="custom-exception-btn custom-ml16" onClick={this.handleContact}>Contact Us</Button> : ''}
                            {showRelogin ? <Button type="primary" className="custom-exception-btn" onClick={this.handleRelogin}>Relogin</Button> : ''}

                        </Card>
                    </div>
                    <div className="custom-footer">
                        <Footer />
                    </div>
                </div>

            </>
        );
    }

}
