import React, { PureComponent } from 'react';
import { Tabs, Skeleton, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import BreadcrumbView from './breadcrumb';

const { TabPane } = Tabs;
export default class PageHeader extends PureComponent {
  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      loading = false,
      wide = false,
      hiddenBreadcrumb = false,
      titleContent,
    } = this.props;

    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    // 动态计算pageHeader的left和width
    let cssLeft = this.props.left + 'px';
    let cssWidth = '100%';

    return (
      <div className={clsString} style={{ left: cssLeft, width: cssWidth }}>
        <div className={`${wide ? styles.wide : ''} custom-top-breadcrumb-view`}>
          <Skeleton
            loading={loading}
            title={false}
            active
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}
          >
            <Row>
              <Col xl={12} lg={12} md={10} sm={24} xs={24}>
                {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />}
                {titleContent && <div className={styles.content}>{titleContent}</div>}
              </Col>
              {this.props.topRightWrapper ?
                <Col xl={12} lg={12} md={14} sm={24} xs={24} className="custom-page-header-right">
                  {this.props.topRightWrapper}
                </Col> : ''}
            </Row>

            <div className={styles.detail}>
              {logo && <div className={styles.logo}>{logo}</div>}
              <div className={styles.main}>
                <div className={styles.row}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                  {action && <div className={styles.action}>{action}</div>}
                </div>
                <div className={styles.row}>
                  {content && <div className={styles.content}>{content}</div>}
                  {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                </div>
              </div>
            </div>
            {tabList && tabList.length ? (
              <Tabs
                className={styles.tabs}
                {...activeKeyProps}
                onChange={this.onChange}
                tabBarExtraContent={tabBarExtraContent}
              >
                {tabList.map(item => (
                  <TabPane tab={item.tab} key={item.key} />
                ))}
              </Tabs>
            ) : null}
          </Skeleton>
        </div>
      </div>
    );
  }
}
