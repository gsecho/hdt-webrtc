import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import menuIcon from '@/assets/menuIcon.svg';
import hdtLogo from '@/assets/hdt.svg';
import * as helper from '@/utils/helper';
import RightContent from './RightContent';
import styles from './index.less';


export default class GlobalHeader extends PureComponent {
    
    componentDidMount() {
        
    }

    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }
    /* eslint-disable*/
    @Debounce(600)
    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }
    toggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    render() {
        const { collapsed, isMobile, logo } = this.props;
        // 动态计算
        let cssLeft = this.props.left;
        let cssWidth = 'calc( 100% - ' + this.props.left + ')';

        let hostname = helper.generateHostNameText(0);
        let txt = hostname + ' Products';

        return (
            <div className={`${styles.header} custom-header-fixed`} style={{ left: cssLeft, width: cssWidth }}>
                <span className={styles.trigger} onClick={this.toggle} style={{ color: '' }}>
                    <Tooltip title="Menu" placement="bottom">
                        {/*<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />*/}
                        <img className="custom-left-menu-icon" src={menuIcon} />
                    </Tooltip>
                </span>
                <img src={hdtLogo} className="custom-top-logo" />
                <span style={{color:'#000000', display: 'inline-block', width: '50px', textAlign: 'center', fontSize: '22px' }}>RTC</span>
                <RightContent {...this.props} /> 
            </div>
        );
    }
}
