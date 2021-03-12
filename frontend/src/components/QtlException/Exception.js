import React, { Fragment, PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi/locale';
import logo from '@/assets/cdnw.svg';
import Footer from '@/layouts/Footer';
import * as pop from '@/utils/pop';
import router from 'umi/router';

export default class QtlEx extends PureComponent{

  // 重新登录
  handleRelogin = () => {
    const { logoutUrl } = this.props;
    window.location.href = logoutUrl;
  };

  handleContact = () => {
    pop.showInfo(formatMessage({id: 'hdt.info.exception'}));

    setTimeout(() => {
      this.handleBack();
    }, 5000);
  };

  render () {
    const { errCode, errMessage, logoutUrl, ...restProps} = this.props;

    return (
      <Fragment>
        <div className="custom-exception-top-divider"></div>

        <div className="custom-exception-view">
          <div className="custom-exception-content">
            <div className="custom-exception-view2">
              <div className="custom-exception-code2">{errCode}</div>
              <div className="custom-exception-text">Notice</div>
              <div className="custom-exception-message2">{errMessage}</div>
              <div className="custom-mt24">
                <Button type="primary" className="custom-exception-btn" onClick={this.handleRelogin}>Relogin</Button>
                {/*<Button type="primary" className="custom-exception-btn custom-ml16" onClick={this.handleContact}>Contact Us</Button>*/}
              </div>
            </div>
          </div>
        </div>

        <div className="custom-footer">
          <Footer />
        </div>
      </Fragment>
    );
  }

}
