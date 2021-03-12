import global from '../config/backend';

const backendUrl = global.dev.url + global.dev.api;
const dataRoot = global.dev.dataRoot;

function getTransportListData(req, res) {
    const json = `{"code":"0","content":{"data":[{"accessDomain":"1015-1.access.com","accessIp":"","accessIpAcl":"","accessIpAclStatus":0,"accessPort":443,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1015-1.access.com.505204.shland.com","cNameSuffix":"shland.com","carryClientIp":0,"concurrentLimit":0,"customerId":1547,"exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10886860,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1015-1.target.com","targetPort":443,"tcpUdp":2,"transportCode":"1015-1.target.com:443","transportCreateDt":1602742693000,"transportId":505204,"transportName":"1015-1.target.com:443","transportStatus":1,"transportStrategy":"topspeed","transportStrategyNam":"Default","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1602742695000,"useFtp":0,"useStandardPort":"https","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false},{"accelRegionIds":"11031,11032,11033,11034","accessDomain":"1019-1.access.com","accessIp":"1.0.37.125,1.0.62.112,1.0.38.101,1.0.65.44,1.0.74.26","accessIpAcl":"","accessIpAclStatus":0,"accessPort":8080,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1019-1.access.com.shland.com","cNameSuffix":"shland.com","carryClientIp":0,"comments":"","concurrentLimit":0,"customerId":1547,"exitIp":"1019-1.access.com.505246.dnsguest-new.com","exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10937950,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1019-1.target.com","targetPort":8080,"tcpUdp":2,"transportCode":"1019-1.target.com:8080","transportCreateDt":1603100190000,"transportId":505246,"transportName":"1019-1.target.com:8080","transportStatus":1,"transportStrategy":"topspeed","transportStrategyNam":"Default","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1603182125000,"useFtp":0,"useStandardPort":"","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false},{"accelRegionIds":"11023,11024,11025,11026,11027,11028,11029,11030","accessDomain":"1020-1.access.com","accessIp":"1.0.71.63,1.0.73.15,1.0.31.108,1.0.91.102,1.0.77.101,1.0.36.143,1.0.83.102","accessIpAcl":"","accessIpAclStatus":0,"accessPort":443,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1020-1.access.com.shland.com","cNameSuffix":"shland.com","carryClientIp":0,"comments":"","concurrentLimit":0,"customerId":1547,"exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10957962,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1020-1.target.com","targetPort":443,"tcpUdp":2,"transportCode":"1020-1.target.com:443","transportCreateDt":1603182979000,"transportId":505262,"transportName":"1020-1.target.com:443","transportStatus":1,"transportStrategy":"topspeed","transportStrategyNam":"Default","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1603182983000,"useFtp":0,"useStandardPort":"","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false},{"accessDomain":"1028-1.access.com","accessIp":"","accessIpAcl":"","accessIpAclStatus":0,"accessPort":443,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1028-1.access.com.shland.com","cNameSuffix":"shland.com","carryClientIp":0,"concurrentLimit":0,"customerId":1547,"exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10991908,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1028-1.target.com","targetPort":443,"tcpUdp":2,"transportCode":"1028-1.target.com:443","transportCreateDt":1603818899000,"transportId":505341,"transportName":"1028-1.target.com:443","transportStatus":1,"transportStrategy":"topspeed","transportStrategyNam":"Default","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1603818901000,"useFtp":0,"useStandardPort":"https","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false}],"count":4},"message":"Success","status":1}`;

    const result = JSON.parse(json);

    return res.json(result);
}

function getStrategy(req, res) {
    const strategy = {
        "topspeed": "Default",
        "topquick": "High Real-time",
        "uniform": "Big-File",
        "max": "Max",
        "hugeslow": "High Concurrency",
        "interact": "Interactive"
    };
    return res.json({
        [dataRoot]: strategy
    });
}

function getTransport(req, res) {
    const result = {"code":"0","content":{"accessDomain":"1028-1.access.com","accessIp":"","accessIpAcl":"","accessIpAclStatus":0,"accessPort":443,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1028-1.access.com.shland.com","cNameSuffix":"shland.com","carryClientIp":0,"concurrentLimit":0,"customerId":1488,"exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10991908,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1028-1.target.com","targetPort":443,"tcpUdp":2,"transportCode":"1028-1.target.com:443","transportCreateDt":1603818899000,"transportId":505341,"transportName":"1028-1.target.com:443","transportStatus":1,"transportStrategy":"topquick","transportStrategyNam":"High Real-time","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1605512680000,"useFtp":0,"useStandardPort":"","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false},"message":"Success","status":1};
    return res.json(result);
}

function modifyTransport(req, res) {
    const random = Math.ceil(Math.random() * 10);
    if (random <= 6) {
        return res.json({ "status": 0, "message": 'We encountered an internal error. Please try again.' });
    } else {
        const result = { "status": 1 };
        const json = `{"accessDomain":"1015-1.access.com","accessIp":"","accessIpAcl":"","accessIpAclStatus":0,"accessPort":443,"accessViewDefaultId":-1,"bothProtocol":0,"cName":"1015-1.access.com.505204.shland.com","cNameSuffix":"shland.com","carryClientIp":1,"concurrentLimit":0,"customerId":1547,"exitIpAcl":"","exitIpAclStatus":0,"ipBlackList":"","ipVersion":1,"ipWhiteList":"","ipport":true,"recordId":10886860,"shieldViewDefaultId":-1,"special":0,"speedLimit":0,"status":1,"targetDomain":"1015-1.target.com","targetPort":443,"tcpUdp":2,"transportCode":"1015-1.target.com:443","transportCreateDt":1602742693000,"transportId":505204,"transportName":"1015-1.target.com:443","transportStatus":0,"transportStrategy":"topspeed","transportStrategyNam":"Default","transportType":"ipport","transportTypeNam":"IP-Port","transportUpdateDt":1604027040000,"useFtp":0,"useStandardPort":"http","useUdp":0,"verifyIcp":0,"verifyPsb":0,"vip":0,"virtual":false}`;
        const transport = JSON.parse(json);
        result[dataRoot] = transport;
        return res.json(result);
    }
}

function delTransport(req, res) {
    const random = Math.ceil(Math.random() * 10);
    if (random <= 6) {
        return res.json({ "status": 0, "message": 'We encountered an internal error. Please try again.' });
    } else {
        const result = { "status": 1 };
        return res.json(result);
    }
}

function createTransport(req, res) {

    const random = Math.ceil(Math.random() * 10);
    if (random <= 6) {
        return res.json({ "status": 0, "message": 'We encountered an internal error. Please try again.' });
    } else {
        const result = { "status": 1 };
        return res.json(result);
    }
}

function getSuffixs(req, res) {

    const result = {};
    const data = {
        "allSuffix": "qtlcname.com,shland.com",
        "cnameDomainName": "shland.com"
    };
    result[dataRoot] = data;
    return res.json(result);
}

function getTransportHistory(req, res) {
    const result = {
        [dataRoot]: {
            data: [{ "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topquick", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 1, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1596011606000, "extendConfig": "", "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "LG6J1tkI", "vip": 0, "bothProtocol": 0, "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178,1.0.62.112", "last": true, "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1596011606000, "deployId": 68637, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "High Real-time", "verifyIcp": 0, "tcpUdp": 0, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 1, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1595831407000, "extendConfig": "", "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "mNMttVuB", "vip": 0, "bothProtocol": 0, "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178,1.0.62.112", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1595831407000, "deployId": 68383, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 0, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 0, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1592876524000, "extendConfig": "", "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "IluvMxy0", "vip": 0, "bothProtocol": 0, "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178,1.0.62.112", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1592876524000, "deployId": 68107, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 0, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 0, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1583828525000, "extendConfig": "", "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "I2QF9ukj", "vip": 0, "bothProtocol": 0, "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.64.150,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1583828525000, "deployId": 66886, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 0, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 0, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1583827424000, "extendConfig": "", "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "753YfgrI", "vip": 0, "bothProtocol": 0, "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.64.150,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1583827424000, "deployId": 66883, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 0, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "exitIpAcl": "", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 0, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1581315364000, "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "lwbSNUZK", "vip": 0, "bothProtocol": 0, "accessIpAcl": "", "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.74.27,1.0.37.140,1.0.64.150,1.0.58.137,1.0.63.49,1.0.29.125,1.0.100.124,1.0.66.178", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1581315364000, "deployId": 66371, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 2, "ipWhiteList": "", "deployStatus": 1 },
                { "exitIp": "shield-test.defaultviewid.com.shland.com.dnsguest.com", "exitIpAcl": "", "accessViewDefaultId": 286, "transportName": "test.defaultviewid.com:443", "transportStatus": 1, "transportId": 501544, "transportStrategy": "topspeed", "concurrentLimit": 0, "shieldViewDefaultId": 281, "targetPort": 443, "ipBlackList": "", "useUdp": 0, "carryClientIp": 0, "exitIpAclStatus": 0, "targetDomain": "test.defaultviewid.com", "cNameRecordId": 7772495, "cName": "test.defaultviewid.com.shland.com", "deployDt": 1578372088000, "accessDomain": "test.defaultviewid.com", "accessIpAclStatus": 0, "apiRequestId": "pmroyNOg", "vip": 0, "bothProtocol": 0, "accessIpAcl": "", "accelRegionIds": "11031,11032,11033,11034", "comments": "", "accessIp": "1.0.63.49,1.0.74.27,1.0.29.125,1.0.62.156,1.0.58.137,1.0.66.178,1.0.37.140,1.0.100.124,1.0.64.150", "transportCode": "test.defaultviewid.com:443", "accessPort": 443, "speedLimit": 0, "shieldAccelRegionIds": "10907", "verifyPsb": 0, "createDt": 1578372088000, "deployId": 65979, "special": 0, "useFtp": 0, "ipVersion": 1, "useStandardPort": "", "transportStrategyNam": "Default", "verifyIcp": 0, "tcpUdp": 2, "ipWhiteList": "", "deployStatus": 1 }
            ],
            "count": 7
        }
    };
    return res.json(result);
}

export default {
    [`GET ${backendUrl}/transport`]: getTransportListData,
    [`GET ${backendUrl}/transport-strategies`]: getStrategy,
    [`GET ${backendUrl}/transport/suffixs`]: getSuffixs,
    [`GET ${backendUrl}/transport/:id`]: getTransport,
    [`PUT ${backendUrl}/transport/:id`]: modifyTransport,
    [`PUT ${backendUrl}/transport/:id`]: modifyTransport,
    [`POST ${backendUrl}/transport`]: createTransport,
    [`GET ${backendUrl}/transport/:id/history`]: getTransportHistory,
    [`DELETE ${backendUrl}/transport/:id`]: delTransport,
}