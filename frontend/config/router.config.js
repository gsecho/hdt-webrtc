/**
 * TODO： 左侧菜单由menu model 控制，路由表仅控制访问暂不生成动态菜单
 */
export default [
    // version
    {
        path: '/info',
        name: 'version',
        component: '../layouts/BlankLayout',
        hideInMenu: true,
        routes: [{
            path: '/info',
            component: './User/Version'
        }, ],
    },
    // customerList
    {
        path: '/user/customerList',
        name: 'customerList',
        component: '../layouts/BasicLayout',
        hideInMenu: true,
        // 添加前端权限控制
        Routes: ['src/pages/Authorized'],
        authority: ['user'],
        routes: [{
            path: '/user/customerList',
            component: './User/CustomerList'
        }, ],
    },
    // user
    {
        path: '/user',
        component: '../layouts/LoginLayout',
        routes: [
            // {
            //     path: '/user',
            //     redirect: '/user/login'
            // },
            {
                path: '/user/login',
                component: './User/Login'
            },
            // { path: '/user/register', component: './User/Register' },
            // { path: '/user/register-result', component: './User/RegisterResult' },
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
                path: '/exception/301',
                name: 'permanently-moved',
                component: './Exception/301',
            },
            {
                path: '/exception/302',
                name: 'temporarily-moved',
                component: './Exception/302',
            },
            {
                path: '/exception/401',
                name: 'not-auth',
                component: './Exception/401',
            },
            {
                path: '/exception/403',
                name: 'not-permission',
                component: './Exception/403',
            },
            {
                path: '/exception/404',
                name: 'not-find',
                component: './Exception/404',
            },
            {
                path: '/exception/500',
                name: 'server-error',
                component: './Exception/500',
            },
            {
                path: '/exception/sin',
                name: 'sin',
                component: './Exception/Sin',
            },
            {
                path: '/exception/trigger',
                name: 'trigger',
                hideInMenu: true,
                component: './Exception/TriggerException',
            },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [{
                path: '/',
                redirect: '/dashboard'
            },
            {
                path: '/meetinglist',
                component: './meetinglist',
            },
            {
                path: '/meetingmanager',
                component: './meetingmanager',
            },
            {
                path: '/meetingroom',
                component: './meetingroom',
                authority: ['admin'],
            },
            // {
            //     path: '/contacts',
            //     name: 'contacts',
            //     component: './Exception/Contact',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/nosubscription',
            //     name: 'nosubscription',
            //     component: './Exception/Nobuy',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/accessdenied',
            //     name: 'accessdenied',
            //     component: './Exception/AccessDenied',
            //     hideInMenu: true,
            // },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: './Dashboard/index',
            },
            // {
            //     path: '/reports',
            //     name: 'reports',
            //     component: './Reports/index',
            // },
            // {
            //     path: '/transport',
            //     name: 'transport',
            //     component: './Transport/list',
            // },
            // {
            //     path: '/transport/preview/:transportId',
            //     name: 'previewTransport',
            //     component: './Transport/edit/Preview',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/transport/add',
            //     name: 'addTransport',
            //     component: './Transport/add',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/transport/view/:transportId',
            //     name: 'viewTransport',
            //     component: './Transport/view',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/transport/history/compare/:transportId',
            //     name: 'historyCompare',
            //     component: './Transport/history/HistoryCompare',
            //     hideInMenu: true,
            // },
            // {
            //     path: '/transport/:transportId',
            //     name: 'editTransport',
            //     component: './Transport/edit',
            //     hideInMenu: true,
            // },
            // // pop
            // {
            //     path: '/map',
            //     name: 'map',
            //     icon: 'pull-request',
            //     component: './Map',
            // },
            // {
            //     component: '404',
            // },
        ],
    },
];