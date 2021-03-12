/*
 * @Author: chenrf
 * @Date: 2021-03-10 17:56
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

@connect(({ loading, user }) => ({
    loading, user,
}))
class MyMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
    // componentDidMount() {

    // }
    // componentDidUpdate(prevProps) {
    // }

    render() {
        return (
          <Button>hello</Button>
        );
    }
}
export default MyMeeting;