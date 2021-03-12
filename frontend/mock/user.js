import global from '../config/backend';

const portalUrl = global.dev.portalUrl + global.dev.portalApi;
const backendUrl = global.dev.url + global.dev.api;
// console.log(portalUrl)
const {dataRoot} = global.dev;

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    // 获取cluster 列表
    [`GET ${portalUrl}/user/pops`]: (req, res) => {
        const location = [
            [121.48, 31.22],
            [118.1633, 33.5745],
            [116.46, 39.92],
            [-84.4906437, 33.7678358],
            [-122.21, 47.37],
            [4.895168, 52.370216],
            [113.987616, 22.3529808],
        ];

        const result = [];
        for (let i = 0; i < 7; i += 1) {
            const obj = {
                name: `cluster-${  i}`,
                id: `1002${  i}`,
                country: 'CN',
                city: 'SuQian China',
                region: 'APAC',
                serviceZone: 'business',
                code: `jssq-${  i}`,
                longitude: location[i][0],
                latitude: location[i][1],
            };
            result.push(obj);
        }
        return res.json({
            [dataRoot]: result
        });
    },

    // 获取namespace 列表
    [`GET ${portalUrl}/user/namespaces`]: (req, res) => {
        const result = [];
        for (let i = 0; i < 5; i+=1) {
            const obj = {
                name: `namespace-${  i}`,
                id: `1002${  i}`,
                accountId: '10034',
                account: {
                    name: 'account',
                },
                lb4Mode: 3,
                lb4ModeTxt: 'DR',
                cluster: 'all',
            };
            result.push(obj);
        }

        return res.json({
            [dataRoot]: result
        });
    },
    // 获取customer 列表
    [`GET ${backendUrl}/v1/customers/:id`]: (req, res) => {
        const obj = {
            "customerId": 1,
            "apiName": "mileweb-api-xY.Sec.re$#@6-FANtasTIC898",
            "name": "mileweb",
            "address": {},
            "configs": {
                "parentId": 0,
                "type": "super",
                // "type": "regular",
                "products": [
                    "CDN",
                    "HDT"
                ],
                "status": "active",
                "apiRate": 64,
                "apiAccountLimit": null
            },
            "portalSettings": {
                "enforce2fa": false,
                "passwordExpirationDays": 90,
                "logoutIdleTime": 900
            }
        };
        res.send({
            [dataRoot]: obj
        });
        
    },
    // 获取customer 列表
    [`GET ${portalUrl}/user/customers`]: (req, res) => {
        const result = {
            "code": "0", "content": {
                "data": [
                    { "accountStatus": "active", "useVPL": false, "name": "mwtest1", "customerId": 233, "cId": 3, "status": 1 },
                    { "accountStatus": "active", "useVPL": true, "name": "mwtest2", "customerId": 233, "cId": 4, "status": 1 },
                    { "accountStatus": "active", "useVPL": false, "name": "burtoncompany", "customerId": 233, "cId": 6, "status": 1 },
                    { "accountStatus": "active", "useVPL": false, "name": "Yang Company2", "customerId": 233, "cId": 7, "status": 1 },
                    { "accountStatus": "active", "useVPL": true, "name": "AlinaTest", "customerId": 233, "cId": 31, "status": 1 },
                    { "accountStatus": "active", "useVPL": false, "name": "customer_without_services", "customerId": 233, "cId": 49, "status": 1 },
                    { "accountStatus": "active", "useVPL": false, "name": "Juliatest", "customerId": 233, "cId": 55, "status": 1 },
                    { "accountStatus": "active", "useVPL": true, "name": "automation_ssl", "customerId": 233, "cId": 70, "status": 1 },
                    { "accountStatus": "active", "useVPL": false, "name": "QAcust", "customerId": 233, "cId": 83, "status": 1 },
                    { "accountStatus": "active", "useVPL": true, "name": "Automation Restrict Access", "customerId": 233, "cId": 85, "status": 1 }
                ], "count": 488
            }, "message": "Success", "status": 1
        };
        res.send(result);
        
    },
    // 登陆请求 
    [`POST ${backendUrl}/user/login`]: (req, res) => {
  
        const { password, name, remember } = req.body;
        console.log("/user/login", req.body)
        if (password === 'ant' && name === 'admin') {
            res.send({
                // status:0, // 忽略
                code: 0,
                message: 'success',
                content:{
                    authenticatedUser: 'admin'
                }
                
            });
        }else if (password === 'ant' && name === 'user') {
            res.send({
                // status:0, // 忽略
                code: 0,
                message: 'success',
                content:{
                    authenticatedUser: 'user'
                }
            });
        }else{
            // 错误情况
            // 前后端分离，所以只返回认证错误，而不是返回 重定向或者页面
            res.status(401).send({
                status: 1, // 忽略
                code: 401,
                message: 'Unauthorized',
                currentAuthority: 'guest',
            });
        }
    },
    // [`GET ${backendUrl}/mytest`]: (req, res) => {
    //     // console.log("ddddd")
    //     // 添加头
    //     res.append("Location", "https://console-qa.cdnetworks.com/cas/login?service=https://console-qa.cdnetworks.com/hdt");
    //     res.status(307).send({
    //         status: 1, // 忽略
    //         code: 401,
    //         message: 'Unauthorized',
    //         currentAuthority: 'guest',
    //     });
    // }

    // // TODO: current 返回403 测试
    // 'GET /rest/user/current': (req, res) => {
    //   res.status(403).send(
    //     {
    //       name: 'Serati Ma',
    //       fullName: 'Serati Ma',
    //       customerId: 123,
    //       // customerType: 'ADMIN',
    //       customerType: 'SUPER_ADMIN',
    //       // hasAccount: false,
    //       hasAccount: true,
    //       id: '1',
    //       mail: 'antdesign@alipay.com',
    //       group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    //       logoutUrl: 'http://www.baidu.com',
    //       version: {
    //         api: 'v1.0.0',
    //         backend: 'v1.0.1',
    //         frontend: 'v1.0.2',
    //       },
    //     }
    //   );
    // },
    // 'GET /rest/user/current': (req, res) => {
    //   res.setHeader('Location','http://www.baidu.com');
    //   res.status(302).send(
    //     {
    //       name: 'Serati Ma',
    //       fullName: 'Serati Ma',
    //       customerId: 123,
    //       // customerType: 'ADMIN',
    //       customerType: 'SUPER_ADMIN',
    //       // hasAccount: false,
    //       hasAccount: true,
    //       id: '1',
    //       mail: 'antdesign@alipay.com',
    //       group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    //       logoutUrl: 'http://www.baidu.com',
    //       version: {
    //         api: 'v1.0.0',
    //         backend: 'v1.0.1',
    //         frontend: 'v1.0.2',
    //       },
    //     }
    //   );
    // },
    // 支持值为 Object 和 Array
    [`GET ${backendUrl}/user/info`]: (req, res) => {
        res.status(200).send({
            "code": 0,
            "message": "success",
            "content": {
                "id": "38849",
                "name": "Webrtc",
                "nickName": "Nick",
                "roles": [
                    "admin",
                    "read",
                    "write",
                    "delete"
                ]
            }
        });
    },
    [`GET ${backendUrl}/500`]: (req, res) => {
        res.status(500).send({
            timestamp: 1513932555104,
            status: 500,
            error: 'error',
            message: 'error',
            path: '/base/category/list',
        });
    },
    [`GET ${backendUrl}/404`]: (req, res) => {
        res.status(404).send({
            timestamp: 1513932643431,
            status: 404,
            error: 'Not Found',
            message: 'No message available',
            path: '/base/category/list/2121212',
        });
    },
    [`GET ${backendUrl}/403`]: (req, res) => {
        res.status(403).send({
            timestamp: 1513932555104,
            status: 403,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
    [`GET ${backendUrl}/401`]: (req, res) => {
        res.status(401).send({
            timestamp: 1513932555104,
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
    [`GET ${backendUrl}/auth/customer-infos`]: (req, res) => {
        const json = `{"code":"0","content":{"1547":"HDTTeamAccount"},"message":"Success","status":1}`;
        const result = JSON.parse(json);
        res.send(result);
    }
};