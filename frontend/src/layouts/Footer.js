import React from 'react';
import { Icon, Layout, Row, Col } from 'antd';
import * as helper from '@/utils/helper';

const { Footer } = Layout;

const FooterView = () => {
	const year = (new Date()).getFullYear();
  let versionInfo = '';
  // const v = helper.generateVersion();
  const v = "0001";
  versionInfo += v;

  const {href} = window.location;
  let style = { padding: 0, backgroundColor: '#f9fbff'};
  // TODO: 针对pop 界面，设置特殊样式
  if(href.indexOf('/pop') !== -1){
    style = {...style, backgroundColor: '#fff'};
  }
  // // TODO: 针对wizard 界面，设置特殊样式
  // if(href.indexOf('/wizard') !== -1){
  //   style= {...style, backgroundColor: '#cedef5'};
  // }

  const host = helper.generateHostNameText(0);

	return <Footer style={style}>
  <Row>
    <Col span={24}>
      <div className="custom-page-footer custom-mb16">
        Copyright <Icon type="copyright" /> {year} {host}, Inc. All Rights Reserved. {versionInfo}
      </div>
    </Col>
  </Row>

</Footer>;
};

export default FooterView;
