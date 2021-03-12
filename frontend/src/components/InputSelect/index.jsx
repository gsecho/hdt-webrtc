import React, { Component } from 'react'
import styles from './inputSelect.less'
import { Input } from 'antd';



export default class InputSelect extends Component {
    constructor() {
        super();
        this.state = {
            showDrop: false
        }
    }
    setShowDrop = (showDrop) => {
        this.setState({ showDrop });
    }

    handleSelect = value => {
        console.log(value);
        this.oldValue = value;
        //this.props.onChange({ ...this.props.value, text: value });
    }

    render() {
        const { handleInputChange,fix,text } = this.props;
        const { showDrop } = this.state;

        const dropData = ["www.topspeed.com1", "www.topspeed.com", "www.topspeed3.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com", "www.topspeed.com"];

        return <div className={styles.dropdown} >
            <Input type={fix ? 'text' : 'hidden'} onFocus={e => { this.setShowDrop(true) }}
                onBlur={e => { this.setShowDrop(false) }}
                value={text} onChange={this.handleInputChange}></Input>
            <div style={{ display: showDrop ? 'block' : 'none' }} className={styles.dropContext}>
                <div>
                    {dropData.map(item => <span onClick={() => { this.handleSelect(item) }} className={item === text ? styles.active : ''}>{item}</span>)}
                </div>
            </div>
        </div>
    }
}