import React, { PureComponent, createElement } from 'react';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';

export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
};

export default class BreadcrumbView extends PureComponent {
  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    this.getBreadcrumbDom();
  }

  componentDidUpdate(preProps) {
    const { location } = this.props;
    if (!location || !preProps.location) {
      return;
    }
    const prePathname = preProps.location.pathname;
    if (prePathname !== location.pathname) {
      this.getBreadcrumbDom();
    }

    const { breadcrumbParam } = this.props;
    if(breadcrumbParam !== preProps.breadcrumbParam){
      this.getBreadcrumbDom();
    }
  }

  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    return {
      routes,
      params,
      routerLocation: location,
      breadcrumbNameMap,
    };
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, itemRender, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => {
          const title = itemRender ? itemRender(item) : item.title;
          return (
            <Breadcrumb.Item key={item.title}>
              {item.href
                ? createElement(
                    linkElement,
                    {
                      [linkElement === 'a' ? 'href' : 'to']: item.href,
                    },
                    title
                  )
                : title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, home, itemRender, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      if (currentBreadcrumb.inherited) {
        return null;
      }
      const isLinkable = (index !== pathSnippets.length - 1 && index < pathSnippets.length && currentBreadcrumb.component) || index !== pathSnippets.length - 1 && index < pathSnippets.length;
      const name = itemRender ? itemRender(currentBreadcrumb) : currentBreadcrumb.name;
      return (currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb) ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            name
          )}
        </Breadcrumb.Item>
      ) : null;
    });

    // // Add home breadcrumbs to your head
    // extraBreadcrumbItems.unshift(
    //   <Breadcrumb.Item key="home">
    //     {createElement(
    //       linkElement,
    //       {
    //         [linkElement === 'a' ? 'href' : 'to']: '/dashboard',
    //       },
    //       'Edge Computing Platform'
    //     )}
    //   </Breadcrumb.Item>
    // );


    // 专门为detail级别的页面添加面包屑导航
    let lastItem = '';
    let detailName = this.props.breadcrumbParam;
    if(detailName){
      // 对自定义导航条添加跳转链接
      let arr = detailName.split('/');
      if(arr.length > 0) {
        arr.map((item, index) => {
          let n = item.trim();

          // 判断是否是最后一级
          if(index < arr.length - 1) {
            extraBreadcrumbItems.push(
              <Breadcrumb.Item key={n}>
                {createElement(
                  linkElement,
                  { [linkElement === 'a' ? 'href' : 'to']: pathSnippets[index + 1], title: '' },
                  n
                )}
              </Breadcrumb.Item>
            );
          }else {
            lastItem = <span>{n}</span>;
            // extraBreadcrumbItems.push(
            //   <Breadcrumb.Item key={n}>
            //     {createElement(
            //       'span',
            //       { 'to': '#', title: '' },
            //       n
            //     )}
            //   </Breadcrumb.Item>
            // );
          }
        });
      }
    }

    // 面包屑导航
    // return (
    //   <div>
    //     <div className="custom-top-breadcrumb-title">Edge Computing Platform</div>
    //     <Breadcrumb className={`${styles.breadcrumb} custom-top-breadcrumb-menu`} separator={breadcrumbSeparator}>
    //       {extraBreadcrumbItems}
    //     </Breadcrumb>
    //   </div>
    // );

    let breadcrumbHtml = '';
    if(extraBreadcrumbItems.length > 1) {
      // 多级
      breadcrumbHtml = (
        <div style={{ overflow: 'hidden' }}>
          <div className="custom-top-breadcrumb-title" style={{float: 'left'}}>{formatMessage({ id: 'menu.hdt' })}&nbsp;&nbsp;/&nbsp;&nbsp;</div>
          <Breadcrumb className={`${styles.breadcrumb} custom-top-breadcrumb-menu-adjust`} separator={breadcrumbSeparator} style={{float: 'left'}}>
            {extraBreadcrumbItems}
          </Breadcrumb>
          <div className="custom-top-breadcrumb-menu" style={{ clear: 'both', marginBottom: '11px' }}>
            {lastItem}
          </div>
        </div>
      );
    } else {
      // 一级
      breadcrumbHtml = (
        <div>
          <div className="custom-top-breadcrumb-title">{formatMessage({ id: 'menu.hdt' })}</div>
          <Breadcrumb className={`${styles.breadcrumb} custom-top-breadcrumb-menu`} separator={breadcrumbSeparator}>
            {extraBreadcrumbItems}
          </Breadcrumb>
        </div>
      );
    }
    
    return breadcrumbHtml;
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  render() {
    const { breadcrumb } = this.state;
    return breadcrumb;
  }
}
