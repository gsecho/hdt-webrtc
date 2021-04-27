import React, { Fragment } from "react";
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import lodash from 'lodash';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage, setLocale } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import router from 'umi/router';
import SiderMenu from '@/components/SiderMenu';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Redirect404 from '../pages/Exception/Redirect404';
import { menu, title } from '../defaultSettings';

import styles from './BasicLayout.less';
// 引入自定义样式
import '@/styles/qtlcommon.less';
import '@/styles/ng.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  // state = {
  //   noticeVisible: false,
  // };

  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, lodash.isEqual);
  }

  componentDidMount() {
    // TODO: 暂时先设置语言，不开启多语言国际化
    setLocale('en-US');
    const { dispatch, route } = this.props;
    // const {dispatch, route} = this.props;
    // 获取 当前用户信息，未发现认证信息会重定向
    dispatch({// 启动全局定时器
      type: 'global/forkInterval'
    })
    dispatch({
      type: 'user/getUserInfo',
    })
    // 配置siderMenu的列表
    dispatch({
      type: 'menu/getMenuData',
      payload: {
        routes: route.routes,
        authority: route.authority,
      }
    });

    // // 添加监听事件
    // window.addEventListener('beforeunload', this.handleBrowserUnload);
    // window.addEventListener('click', this.clearRefreshTimer);

    // sessionStorage.setItem('clickFlag', 0);
    // sessionStorage.setItem('timerClickFlag', 0);

    // this.updateTemplate();
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
    // user发生变化的时候
    const {user: currentUser} = this.props;
    if (!lodash.isEqual(preProps.user, currentUser) && !lodash.isEmpty(currentUser)) {
      // if (authority.checkCurrent(currentUser.currentUser)) {
      //   this.redirect();
      // }
    }
  }

  componentWillUnmount() {
    // 移除监听事件
    window.removeEventListener('beforeunload', this.handleBrowserUnload);
    window.removeEventListener('click', this.clearRefreshTimer);
    // 清除标志位
    sessionStorage.setItem('clickFlag', 0);
    sessionStorage.setItem('timerClickFlag', 0);
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  // 针对quantil 域名，更改模板
  updateTemplate = () => {
    let iconUrl = '';

    const {hostname} = window.location;
    if (hostname.indexOf('.quantil.com') !== -1) {
      iconUrl = '/hdt/quantilFavicon.png';
    }
    if (hostname.indexOf('.cdnetworks.com') !== -1) {
      iconUrl = '/hdt/cdnwFavicon.png';
    }
    // 设置favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = iconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  clearRefreshTimer = () => {
    const refreshTimerFlag = sessionStorage.getItem('refreshTimerFlag');
    if (refreshTimerFlag === 1) {
      sessionStorage.setItem('clickFlag', 1);
    }
  }

  handleBrowserUnload = () => {
    // 清除currentUser proxyUser
    const { dispatch } = this.props;
    dispatch({
      type: 'user/refreshCurrentUser',
    });
  };

  /**
   * 重定向目标链接
   */
  redirect = () => {
    // console.log(this.props);
    const { user: {hasAccount, nextRouter} } = this.props;
    if (!hasAccount && nextRouter) {
      router.push(nextRouter);
    }
  }
  
  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.forEach(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return title;
    }
    const pageName = menu.disableLocal
      ? currRouterData.name
      : formatMessage({
        id: currRouterData.locale || currRouterData.name,
        defaultMessage: currRouterData.name,
      });

    return `${pageName} - ${title}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        // paddingLeft: collapsed ? '80px' : '256px',
        paddingLeft: collapsed ? '64px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    // 增加对侧边栏在不同分辨率上的判断
    let left = 0;
    const {isMobile: curIsMObile, collapsed} = this.props;
    if (curIsMObile === false) {
      if (collapsed === false) {
        left = 256;
      } else {
        // left = 80;
        left = 64;
      }
    }
    // 通过context传递left
    let context = this.getContext();
    context = { ...context, left };

    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
    } = this.props;

    let style = {
      ...this.getLayoutStyle(),
      minHeight: '100vh',
      marginLeft: left,
    };
    const {href} = window.location;
    // TODO: 针对map 界面，设置特殊样式
    if (href.indexOf('/map') !== -1) {
      style = { ...style, backgroundColor: '#fff' };
    }

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout style={style}>
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            isMobile={isMobile}
            left={left}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            <Authorized authority={routerConfig} noMatch={<Redirect404 />}>
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={context}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
// 将Menu model的属性挂载到组件的props上
export default connect(({ user, global, setting, menu: menuModel, loading }) => ({
  user,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  loading,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {
      isMobile => <Fragment><BasicLayout {...props} isMobile={isMobile} /></Fragment>
    }
  </Media>
));
