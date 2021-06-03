import jwtDecode from 'jwt-decode';
import backend from '../config/backend';


const backendUrl = backend.api;
const {dataRoot} = backend;

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
    // 获取cluster 列表
    
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
    
    // 登陆请求 
    [`POST ${backendUrl}/user/login`]: (req, res) => {
        const { password, username, remember } = req.body;
        console.log("/user/login", req.body)
        const localToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDM2NiIsImV4cCI6MTYzNzQyMzYzNSwiaWF0IjoxNjE5NDIzNjM2fQ.r5ru4eICxy2twOxbzxxinfENA-kxScCxb_xUO7JQEug';
        if (username === 'admin' && password === 'ant' ) {
            res.send({
                // status:0, // 忽略
                code: 0,
                message: 'success',
                content:{
                    token: localToken,
                    authority: ['admin', 'user'],
                }
                
            });
        }else if (username === 'user' && password === 'ant' ) {
            res.send({
                // status:0, // 忽略
                code: 0,
                message: 'success',
                content:{
                    token: localToken,
                    authority: ['admin', 'user'],
                }
            });
        }else{
            // 错误情况
            // 前后端分离，所以只返回认证错误，而不是返回 重定向或者页面
            res.status(401).send({
                status: 1, // 忽略
                code: 401,
                message: 'Unauthorized',
            });
        }
    },
    [`POST ${backendUrl}/user/logout`]: (req, res) => {
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
        });
    },
    // 支持值为 Object 和 Array
    [`GET ${backendUrl}/user/info`]: (req, res) => {
        // console.log("/user/info");
        // res.status(401);
        // res.send();
        res.status(200).send({
            "code": 0,
            "message": "success",
            "content": {
                "id": "38849",
                "name": "Webrtc",
                "nickName": "Nick",
                // "roles": [ // login的时候已经有角色信息了，这里就不带了
                //     "admin",
                //     "read",
                //     "write",
                //     "delete"
                // ]
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