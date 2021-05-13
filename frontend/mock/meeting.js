/*
 * @Author: chenrf
 * @Date: 2021-03-18 15:29
 */
import backend from '../config/backend';

const backendUrl = backend.api;

export default {

    [`GET ${backendUrl}/meetingManager/currentList`]: (req, res) => {
        // console.log(req.query); // 获取get、post的参数
        const total = 3;
        const data = [];
        for (let i = 0; i< total; i+=1) {
            data.push({
                id: `test2021-${i}`,
                key: i,
                subject: `Edward King ${i}`,
                start: '2021-03-06 09:01:01',  // 统一用utc时间
                duration: 1,
                password: '123456',
                content: 'nice to meet you!',
                address: `London, Park Lane no. ${i}`,
                createBy: 'King',
                status: 0 // 0：正常， 1：挂起， 2：删除 
            });
        }
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
            content: {
                'total': total,
                'list': data
            }
        });
    },

    // 获取namespace 列表
    [`POST ${backendUrl}/meeting/search`]: (req, res) => {
        // console.log(req.query); // 获取get的参数
        // console.log(req.body); // 获取post的参数
        const {pageNum, pageSize} = req.query
        const iPageNum = (parseInt(pageNum, 10)-1)
        const ipageSize = (parseInt(pageSize, 10))
        let start = iPageNum*ipageSize;
        const end = start + ipageSize;
        const total = 151;
        if(start > total){
            const tempPage = Math.floor(total / ipageSize);
            // console.log(tempPage);
            start = tempPage*ipageSize;
        }
        const data = [];
        for (let i = start; i < end && i< total; i+=1) {
            const transportStatus = Math.floor(Math.random()*2);// 0：正常， 1：挂起， 2：删除 
            data.push({
            id: `test2021-${i}`,
            key: i,
            subject: `Edward King ${i}`,
            start: '2021-03-06 09:01:01',  // 统一用utc时间
            duration: 1,
            password: '123456',
            content: 'nice to meet you!',
            address: `London, Park Lane no. ${i}`,
            createBy: 'King',
            status: transportStatus
            });
        }
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
            content: {
                'total': total,
                'list': data
            }
        });
    },
    [`DELETE ${backendUrl}/meetingManager/id`]: (req, res) => {
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
        });
    },
    [`POST ${backendUrl}/meetingManager/create`]: (req, res) => {
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
        });
    },
    [`POST ${backendUrl}/meetingManager/update`]: (req, res) => {
        res.send({
            // status:0, // 忽略
            code: 0,
            message: 'success',
        });
    },
    [`POST ${backendUrl}/meetingroom/auth`]: (req, res) => {
        const {id, password} = req.body
        // console.log(req.body);
        if(id === "123"){
            res.send({
                code: 0,
                message: 'success',
            });
        }else{
            res.status(401).send({
                code: 401,
                message: 'Unauthorized',
            });
        }
    },

}

