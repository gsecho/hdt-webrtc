/*
 * @Author: chenrf
 * @Date: 2021-03-02 09:38
 */
/**
 * TODO： 左侧菜单由menu model 控制，路由表仅控制访问暂不生成动态菜单
 */
export default [
    // app
    {
        path: '/',
        // component: '../layouts/BasicLayout',
        routes: [
            // user
            {
                path: '/user',
                component: '../layouts/LoginLayout',
                routes: [
                    {
                        path: '/user/login',
                        component: './User/Login'
                    },
                    // { path: '/user/register', component: './User/Register' },
                ],
            },
            {
                name: 'exception',
                icon: 'warning',
                path: '/exception',
                component: '../layouts/BlankLayout',
                routes: [
                    // exception
                    {
                        path: '/exception/404',
                        name: 'not-find',
                        component: './Exception/404',
                    },
                ],
            },
            {
                path: '/',
                component: '../layouts/BasicLayout',
                Routes: ['src/pages/Authorized'],
                authority: ['admin', 'user'],
                routes: [
                    {
                        path: '/',
                        redirect: '/dashboard'
                    },
                    {
                        path: '/dashboard',
                        component: './MeetingManager',
                    },
                    {
                        path: '/room',
                        component: './MeetingRoom',
                    },
                    {
                        name: 'users',
                        path: '/users',
                        component: './User/UserManager',
                        authority: ['admin'],
                    },
                    {
                        name: 'exception',
                        icon: 'warning',
                        path: '/exception',
                        component: '../layouts/BlankLayout',
                        // component: '../layouts/BlankLayout',
                        routes: [
                            {
                                path: '/p/404',
                                name: 'not-find',
                                component: './Exception/404',
                            },
                        ],
                    },
                ]
            },
        ] 
    },
];