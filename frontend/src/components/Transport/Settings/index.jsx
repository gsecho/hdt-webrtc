import React, { Component } from 'react'
import Ipport from './Ipport'
import CnameShield from './CnameShield'
import AdvancedSettings from './AdvancedSettings'

export default class Settings extends Component {

    render() {
        const { form, isPortReuse = '', edit = false } = this.props;

        return (
            <div>
                <Ipport isPortReuse={isPortReuse} edit={edit} form={form}></Ipport>
                <CnameShield form={form} edit={edit} isPortReuse={isPortReuse}></CnameShield>
                <AdvancedSettings form={form} edit={edit} ></AdvancedSettings>
            </div>
        )
    }
}