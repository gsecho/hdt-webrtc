import React, { PureComponent } from 'react';
import { Button, Col, Row } from 'antd';
import router from 'umi/router';
import * as helper from '@/utils/helper';
import styles from './style.less';

class Contact extends PureComponent {

  handleBack = () => {
    router.goBack();
  }

  render() {
    let txt = helper.generateHostNameText(1);

    return (
      <div className={styles.contact}>
        <div>
          <div className={styles.title}>Customer Center</div>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>US / Americas</div>
                <div>
                  <div>+1 877 937 4236</div>
                  <div>support@{txt}.com</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>SG / SEA & Pacific</div>
                <div>
                  <div>+65 6908 1198</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>UK / EMEA</div>
                <div>
                  <div>+44 203 657 2727</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>CA / Toronto</div>
                <div>
                  <div>+1 416 546 6905</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>CN / Beijing</div>
                <div>
                  <div>+86 21 5423 4802-102</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>CN / Shanghai</div>
                <div>
                  <div>+86 10 8441 7749</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>KR</div>
                <div>
                  <div>+82-2-3441-0456 </div>
                  <div> cdnsupport@{txt}.co.kr</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div className={styles.item}>
                <div>JP</div>
                <div>
                  <div>+81 3 5909 3373</div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="custom-exception-contact-item-btn custom-pt16" style={{ textAlign: 'right' }}>
            <Button type="primary" shape="circle" icon="arrow-left" onClick={this.handleBack} size="large" />
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
