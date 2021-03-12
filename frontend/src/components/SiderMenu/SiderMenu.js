import React, { Fragment, PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import menuLogo from '@/assets/menuLogo.svg';
import menuText from '@/assets/cdnwText.svg';
import quantilMenuLogo from '@/assets/quantilMenuLogo.svg';
import quantilMenuText from '@/assets/quantilText.svg';
import lodash from 'lodash';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  componentDidUpdate(preProps, preState) {
    // 更新状态
    if(!lodash.isEqual(this.props.flatMenuKeys, preProps.flatMenuKeys)){
      let openKeys = getDefaultCollapsedSubMenus(this.props);
      this.setState({ openKeys: openKeys });
    }
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });

    // 增加对侧边栏在不同分辨率上的判断
    let style = {};
    if(this.props.isMobile === false){
      style = {overflow: 'auto', height: '100vh', position: 'fixed', left: 0};
    }

    let html = <Fragment>
      <div className={`${styles.logo} custom-left-menu-logo`} id="logo">
        <img src={menuLogo} alt="logo" style={{width: '24px', height: '24px'}} />
        <img src={menuText} alt="logo" style={{height: '16px', marginLeft: '8px'}} />
      </div>
    </Fragment>;
    let hostname = window.location.hostname;
    if(hostname.indexOf('.quantil.') !== -1){
      // TODO:
      if(collapsed){
        html = <Fragment>
          <div className={`${styles.logo} custom-left-menu-logo`} id="logo">
            <img src={quantilMenuLogo} alt="logo" style={{width: '24px', height: '24px'}} />
          </div>
        </Fragment>;
      }else{
        html = <Fragment>
          <div className={`${styles.logo} custom-left-menu-logo`} id="logo">
            <img src={quantilMenuText} alt="logo" style={{height: '22px', marginLeft: '48px'}} />
          </div>
        </Fragment>;
      }
    }

    return (
      <Sider
        style={style}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        collapsedWidth={64}
        width={256}
        theme={theme}
        className={`${siderClassName} custom-left-menu`}
      >
        {html}
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            className="custom-left-menu-item-view"
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '0px', width: '100%' }}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
