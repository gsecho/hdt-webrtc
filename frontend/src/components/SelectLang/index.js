import React, { Fragment, PureComponent } from "react";
import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu, Icon, Tooltip, Popover } from 'antd';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    setLocale(key);
  };

  render() {
    const selectedLang = getLocale();
    const locales = [
      'zh-CN',
      'en-US',
      // 'ja-JP',
      // 'ko-KR',
    ];
    const languageLabels = {
      'zh-CN': '简体中文',
      'en-US': 'English',
      // 'ja-JP': '',
      // 'ko-KR': '',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      'en-US': '🇬🇧',
      // 'ja-JP': '🇬🇧',
      // 'ko-KR': '🇬🇧',
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>&nbsp;&nbsp;
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Fragment>
         <span className="custom-header-action2">
          <Tooltip title={formatMessage({ id: 'tooltip.header.user.language' })} placement="bottom">
            <Popover placement="bottomRight" content={langMenu} trigger="click" overlayClassName="custom-header-pop">
              <Icon type="global" />
            </Popover>
          </Tooltip>
        </span>
      </Fragment>
    );
  }
}
