import React from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, pageHeaderClass, childrenClass, ...restProps }) => {
  // TODO: childClass针对小屏幕优化
  let childClass = childrenClass ? childrenClass : '';
  let phClass = pageHeaderClass ? pageHeaderClass: '';
  let wrapperClass = wrapperClassName ? wrapperClassName : '';

  // TODO: 针对wizard 页面
  let wizardCss = '';
  let location = window.location.href;
  if(location.indexOf('/wizard') !== -1){
    wizardCss = 'custom-form-breadcrumb-bg';
  }

  return <div style={{ margin: '-24px -24px 0' }} className={`${wrapperClass} custom-breadcurmb-fixed-view`}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          className={`custom-breadcrumb-fixed ${phClass} ${wizardCss}`}
          style={{left: value.left}}
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
            }
            return item.title;
          }}
        />
        )
      }
    </MenuContext.Consumer>
    {children ? (
      <div className={`${styles.content} custom-right-content-fixed ${childClass}`}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>;
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
