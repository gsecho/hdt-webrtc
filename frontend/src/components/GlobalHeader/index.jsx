import React, { PureComponent } from 'react';
import { Tooltip, Button,Modal } from 'antd';
import { connect } from 'dva'
import Debounce from 'lodash-decorators/debounce';
import menuIcon from '@/assets/menuIcon.svg';
import hdtLogo from '@/assets/hdt.svg';
import * as helper from '@/utils/helper';
import adapter from 'webrtc-adapter' // 不可用屏蔽（webrtc）
import * as redirect from '@/utils/redirect'
import * as tokenUtils from '@/utils/tokenUtils'
import RightContent from './RightContent';
import EnterMeeting from './EnterMeeting'
import styles from './index.less';

@connect(({ meetingEnter }) => ({
    meetingEnter,
}))
class GlobalHeader extends PureComponent {
    
    componentDidMount() {
        console.log('---adapter:', adapter.browserDetails);
        if(!tokenUtils.tokenValidate()){ // 如果url在router.js中有跳转，这里的跳转会失败
            redirect.loginPageService()
        }
        const { dispatch, isMobile } = this.props;
        dispatch({
            type: 'global/setIsMobile',
            payload: isMobile
        })
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
    enterRoomHander = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'meetingEnter/setEnterMeeting',
            payload: {
                enterRoomVisible : true,
                enterAuthFailFlag: false,
            }
        })
    };

    enterRoomOk = ()=>{
        this.addformRef.handleSubmit()
    };
    
    enterRoomCannel = ()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'meetingEnter/setEnterMeeting',
            payload: {
                enterRoomVisible : false
            }
        })
    };

    render() {
        // 动态计算
        let cssLeft = this.props.left;
        let cssWidth = 'calc( 100% - ' + this.props.left + ')';
        const { collapsed, isMobile, logo, meetingEnter: {enterRoomVisible, enterAuthFailFlag }} = this.props;
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
                <Button type="link" icon="plus" sytle={{ marginLeft: '10px'}} onClick={this.enterRoomHander}>enter meeting</Button>
                <RightContent {...this.props} /> 
                <Modal
                    title="enter meeting"
                    visible={enterRoomVisible}
                    onOk={this.enterRoomOk}
                    onCancel={this.enterRoomCannel}
                    width={640}
                >
                    <EnterMeeting wrappedComponentRef={(form) => {this.addformRef = form}} />
                </Modal>
            </div>
        );
    }
}

export default GlobalHeader;
