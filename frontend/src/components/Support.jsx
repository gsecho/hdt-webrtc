import React, { PureComponent } from 'react'
import { Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import { generateHostNameText } from '@/utils/helper';


export default class Support extends PureComponent {



    getSupport = () => {
        Modal.info({
            content: (
                <div>
                    {formatMessage({ id: 'user.help.content.support' }, { brand: generateHostNameText(1) })}
                </div>
            ),
            onOk() { },
        });
        this.props.onOpen && this.props.onOpen();
    }

    render() {

        return (
            <a onClick={this.getSupport}>{this.props.children}</a>
        )
    }
}
