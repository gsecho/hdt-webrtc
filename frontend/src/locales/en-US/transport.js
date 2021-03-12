/**
 * add transport 页面的国际化信息
 */
export default {
    'transport.wizard.title': 'Add Transport',
    'transport.wizard.desc': 'Add your new transport for high-speed data transfer.',

    'transport.btn.cancel': 'Cancel',
    'transport.btn.prev': 'Previous',
    'transport.btn.next': 'Next',
    'transport.btn.save': 'Save',
    'transport.btn.add': 'Add New Transport',
    'transport.btn.reset': 'Reset',
    'transport.btn.reload': 'Reload',
    'transport.btn.edit': 'Edit',
    'transport.btn.history': 'Show History',
    'transport.btn.delete': 'Delete',
    'transport.btn.suspend': 'Suspend',
    'transport.btn.activate': 'Activate',
    'transport.btn.back': 'Back',
    'transport.btn.rollback': 'Rollback',

    'transport.step.title0': 'Basic Info',
    'transport.step.title1': 'Settings',
    'transport.step.title2': 'Security',
    'transport.step.title3': 'Review',

    'transport.targetPort.column.protocol': 'Protocol',
    'transport.targetPort.column.port': 'Port',
    'transport.targetPort.column.portRange': 'Port Range',
    'transport.targetPort.column.protocol.tooltip': 'Choose a protocol type',
    'transport.targetPort.column.portRange.tooltip': 'Enter between 1 and 65535. Port range or the combination of them separated by comma, e.g. 100,200,130-145',
    'transport.targetPort.column.port.tooltip': 'Enter between 1 and 65535',


    'transport.placeholder.targetPort': '1~65535',
    'transport.placeholder.targetPortRange': '100,200,130-145',

    //form label
    'transport.form.label.transportId': 'Transport ID',
    'transport.form.label.transportName': 'Transport Name',
    'transport.form.label.versionNumber': 'Version Number',
    'transport.form.label.comments': 'Description',
    'transport.form.label.transportStatus': 'Transport Status',
    'transport.form.label.portReuse': 'Application Protocol',
    'transport.form.label.targetDomain': 'Target Domain',
    'transport.form.label.targetPort': 'Target Port',
    'transport.form.label.layerProtocol': 'Transport Protocol',
    'transport.form.label.accessDomain': 'Access Domain',
    'transport.form.label.accessPort': 'Access Port',
    'transport.form.label.ipVersion': 'IP Version',
    'transport.form.label.verifyPsb': 'PSB Beian',
    'transport.form.label.cName': 'CNAME',
    'transport.form.label.exitIp': 'Shields',
    'transport.form.label.shield': 'Fixed Shields',
    'transport.form.label.vip': 'Dedicated IP Service',
    'transport.form.label.carryClientIp': 'Carry Client IP',
    'transport.form.label.transportStrategy': 'Transfer Strategy',
    'transport.form.label.speedLimit': 'Speed Limit',
    'transport.form.label.concurrentLimit': 'Concurrent Limit',
    'transport.form.label.ipWhiteList': 'End-user IP Allowlist',
    'transport.form.label.ipBlackList': 'End-user IP Blocklist',
    'transport.form.title.basicInfo': 'Basic Information',
    'transport.form.title.settings': 'Settings',
    'transport.form.title.ipport': 'IP Port',
    'transport.form.title.cname': 'CNAME & Shield',
    'transport.form.title.advanced': 'Advanced Settings',
    'transport.form.title.security': 'Security',
    'transport.form.title.history': 'Change History',


    //tooltip
    'transport.tooltip.detail.portReuse': 'Choose the protocol type your users will use to access the transport. Once you set as HTTP or HTTPS, it’s not changeable. ',
    'transport.tooltip.detail.transportStatus': 'You can make this transport suspended or activated again.',
    'transport.tooltip.detail.targetPort': 'Enter between 1 and 65535.',
    'transport.tooltip.detail.layerProtocol': 'Choose the protocol type your users will use to access the transport.',
    'transport.tooltip.detail.accessPort': 'Enter between 1 and 65535. The value of the access port cannot be specified when the type of target port is range. And please make sure there is no direct back to source policy in the service map.',
    'transport.tooltip.detail.verifyPsb': 'If you need acceleration service in Mainland China, remember to choose PSB Beian accordingly. And we will check whether this domain has ICP Beian online.',
    'transport.tooltip.detail.cName': 'Customize the CNAME if you wish.  If the application protocol isn\'t \'other\', you can leave the CNAME field empty, a default one will be generated for you.',
    'transport.tooltip.detail.carryClientIp': 'For HTTPS applications, the client certificate needs to be deployed at the HDT servers beforehand. Please contact support team if you need to deploy a client certificate.',
    
    //error
    'transport.form.empty.targetDomain': 'Please enter a transport domain.',
    'transport.form.empty.targetPort': 'Please enter a transport port.',
    'transport.form.empty.accessDomain': 'Please enter a access domain.',
    'transport.form.empty.cName': 'Please enter a CNAME.',
    'transport.form.empty.portReuse': 'Please select an Application Protocol.',

    'transport.error.empty.speedLimit': 'Please enter speed limit.',
    'transport.error.empty.concurrentLimit': 'Please enter concurrent limit.',
    'transport.error.empty.shield': 'Please enter shields.',
    'transport.error.empty.targetPort': 'The port range is required.',

    'transport.error.range.targetPort': 'The port range value is invalid.',
    'transport.error.range.accessPort': 'The value of accessPort cannot be specified when the type of target port is range',
    'transport.error.different.accessPort': 'The access port is inconsistent with the target port, please make sure that there is no direct back to source policy in the service map.',
    'transport.error.same.accessDomain': 'The value of the target domain must be different from the value of the access domain.',
    'transport.error.ipv4List': 'The IPv4 list parameter value is invalid, the legal value is IP, IP segment, IP range or the combination of them separated by semicolons.',
    'transport.error.ipv6List': 'The IPv6 list parameter value is invalid, the legal value is IP, IP segment, IP range or the combination of them separated by semicolons.',
    'transport.error.ipMaxList': 'The IP list parameter value is invalid, the legal value is IP, IP segment, IP range or the combination of them separated by semicolons.',

    'transport.error.targetDomain': "The target domain is invalid.",
    'transport.error.accessDomain': "The access domain is invalid.",
    'transport.error.comma.accessDomain': "Please use comma to separate domains.",
    'transport.error.length.domain': "Please limit domain to no more than 256 characters.",
    'transport.error.port.accessDomain': "The port value of access domain is invalid.",
    'transport.error.cName': "The CNAME is invalid.",
    
    

    //placeholder
    'transport.placeholder.list.search': 'Enter a transport name',
    'transport.placeholder.transportName': 'Enter a transport name',
    'transport.placeholder.comment': 'Enter a description about this transport',
    'transport.placeholder.targetDomain': 'Enter a domain name or an IP',
    'transport.placeholder.accessDomain': 'Enter one or more domain names separated by commas',
    'transport.placeholder.cName': 'Enter a CNAME',
    'transport.placeholder.cName': 'Enter a CNAME',
    'transport.placeholder.ipWhiteList': 'IP address, IP range and CIDR notation are supported. Please use a semicolon to separate entries. \ne.g. \n21.12.45.18, 2.3.4.5-2.3.4.10, 11.11.12.3/20',
    'transport.placeholder.ipBlackList': 'IP address, IP range and CIDR notation are supported. Please use a semicolon to separate entries. \ne.g. \n21.12.45.18, 2.3.4.5-2.3.4.10, 11.11.12.3/20',


    // list
    'transport.table.header.transportId': 'Transport ID',
    'transport.table.header.status': 'Status',
    'transport.table.header.customer': 'Customer',
    'transport.table.header.transportName': 'Transport Name',
    'transport.table.header.accessDomain': 'Access Domain',
    'transport.table.header.targetDomain:Port': 'Target Domain:Port',
    'transport.table.header.strategy': 'Strategy',
    'transport.table.header.action': 'Action',
    'transport.table.menu.action': 'Actions',

    //message
    'transport.message.title.creating': 'Creating Transport',
    'transport.message.content.creating': 'The transport is being created.This could take several minutes.',
    'transport.message.title.created': 'Transport Created',
    'transport.message.content.created': 'The transport has been successfully created.',
    'transport.message.title.updating': 'Updating Transport',
    'transport.message.content.updating': 'The transport is being updated.This could take several minutes.',
    'transport.message.title.updated': 'Transport Updated',
    'transport.message.content.updated': 'The transport has been successfully Updated.',
    'transport.message.title.error': 'Error Occurred!',

    'transport.message.title.rollback': 'Rollback Confirmation',
    'transport.message.content.rollback': 'Do you want to roll {versionNumber1} of Transport Id \n [ {transportId} ] back to {versionNumber2} ?',
}