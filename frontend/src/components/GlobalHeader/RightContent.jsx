import React, { Fragment, PureComponent } from 'react';
import { Avatar, Spin, Tag, Popover, Icon, Menu } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import lodash from 'lodash';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

    componentDidMount() {
       
    };

    componentWillUnmount() {
       
    }

    getNoticeData() {
        const { notices = [] } = this.props;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map(notice => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = {
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                }[newNotice.status];
                newNotice.extra = (
                  <Tag color={color} style={{ marginRight: 0 }}>
                    {newNotice.extra}
                  </Tag>
                );
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }

    getUnreadData = noticeData => {
        const unreadMsg = {};
        Object.entries(noticeData).forEach(([key, value]) => {
            if (!unreadMsg[key]) {
                unreadMsg[key] = 0;
            }
            if (Array.isArray(value)) {
                unreadMsg[key] = value.filter(item => !item.read).length;
            }
        });
        return unreadMsg;
    };

    changeReadState = clickedItem => {
        const { id } = clickedItem;
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeNoticeReadState',
            payload: id,
        });
    };

    fetchMoreNotices = tabProps => {
        const { list, name } = tabProps;
        const { dispatch, notices = [] } = this.props;
        const lastItemId = notices[notices.length - 1].id;
        dispatch({
            type: 'global/fetchMoreNotices',
            payload: {
                lastItemId,
                type: name,
                offset: list.length,
            },
        });
    };

    // // 生成哈希头像
    // generateHashAvatar = (user) => {
    //   let imgUrl = '';
    //   if(user){
    //     let hash = crypto.createHash('md5');
    //     hash.update(user);
    //     let imgData = new Identicon(hash.digest('hex')).toString();
    //     imgUrl = 'data:image/png;base64,'+imgData;
    //   }
    //   return imgUrl;
    // }

    // 登出
    logout = () => {
        const { dispatch } = this.props;
        // const {logoutUrl} = user.currentUser;
        // // 清空登录信息
        dispatch({
            type: 'user/logout'
        })
    };

    editUser = () => {

    }

    // 停止授权
    handleStopImpersonation = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/refreshProxyUser'
        });
        // if (user.nextRouter) {
        //     router.push(user.nextRouter);
        // }
    };

    // 获取当前用户头像
    getCurrentUserAvatar = () => {
        const { user:{ userInfo } } = this.props;
        let name= "!";
        if (!lodash.isEmpty(userInfo)) {
            const {nickName, name: userName} = userInfo;
            if (nickName) {
                name = nickName.slice(0, 1).toUpperCase();
            } else if (userName) {
                name = userName.slice(0, 1).toUpperCase();
            }
        }
        return name;
    }

    setTimezone = (timezone) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'user/refreshTimezone',
            payload: timezone,
        })
    }

    render() {
        const {
            user,
            theme,
        } = this.props;

        const { userInfo: currentUser } = user;

        const menuHeaderDropdown = (
          <Menu className={styles.menu} selectedKeys={[]} onClick={this.logout}>
            <Menu.Item key="logout">
              <Icon type="logout" />
              logout
            </Menu.Item>
          </Menu>
        );

        let className = styles.right;
        if (theme === 'dark') {
            className = `${styles.right}  ${styles.dark}`;
        }

        return (
          <>
            <div className={`${className} custom-mr24`}>
              {!lodash.isEmpty(currentUser) ? (
                <span className="custom-header-action">
                  {/* <Tooltip title={formatMessage({ id: 'user.header.userInfo' })} placement="bottom"> */}
                  <Popover placement="bottomRight" content={menuHeaderDropdown} trigger="click" overlayClassName="custom-header-pop">
                    <Avatar
                      size={24}
                      className={styles.avatar}
                      style={{ backgroundColor: "#4165c2", color: "#fff", fontSize: '14px' }}
                    >
                      {this.getCurrentUserAvatar()}
                    </Avatar>
                  </Popover>
                  {/* </Tooltip> */}
                </span>
                    ) : (
                      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                        )}
            </div>
          </>
        );
    }
}
