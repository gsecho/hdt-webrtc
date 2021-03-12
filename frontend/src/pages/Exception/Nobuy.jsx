import React, { PureComponent } from 'react';
import * as helper from '@/utils/helper';
import QtlException from '@/components/QtlException';
import { formatMessage } from 'umi/locale';

class Index extends PureComponent {

    render() {
        let txt = helper.generateHostNameText(0);
        const { state = {} } = this.props.location;
        const { errMessage = formatMessage({id:'hdt.exception.description.accessDenied1'},{txt}) } = state;
        return (

            <QtlException
                errCode="Access Denied"
                showBack={false}
                errText='Notice'
                inMain={true}
                codeStyle={{ fontSize: '45px', lineHeight: 1.61 }}
                errMessage={errMessage}
            />

        );
    }
}

export default Index;
