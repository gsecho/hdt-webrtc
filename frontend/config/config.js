// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
import backend from './backend';
// import git from 'git-rev-sync';
import path from 'path';

// UMI_ENV=dev 有这个变量的时候会使用config.js或者config.dev.js文件
// 默认情况就是UMI_ENV=dev

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'en-US', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
      },
      // pwa: {
      //   workboxPluginMode: 'InjectManifest',
      //   workboxOptions: {
      //     importWorkboxFrom: 'local',
      //   },
      // },
      // ...(!process.env.TEST && os.platform() === 'darwin'
      //   ? {
      //       dll: {
      //         include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //         exclude: ['@babel/runtime'],
      //       },
      //       hardSource: false,
      //     }
      //   : {}),
    },
  ],
];

// 允许打印的log等级
const extraBabelPlugins = [
  ['transform-remove-console',
    {
      "exclude": [ "error", "warn"],
    }
  ],
];

let config = {
  // 修复monaco editor 样式加载bug
  cssLoaderVersion: 2,

  // 部署目录相对于根目录的路径，部署到非根目录时需要配置
  base: backend.pages,  // 访问路径
  // publicPath: backend.publicPath,  // 静态资源路径,index.html中的静态资源会有这个路径
  // outputPath: backend.outputPath, // 指定编译后文件存放路径

  // hash文件后缀
  hash: true,
  // 打包输出路径
  // outputPath: '../customerportalbackend/src/main/resources/static',
  
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    ...backend,
    // 添加版本信息
    // gitVersion: gitVersion,
    // gitVersionLong: gitVersionLong,
    // gitBranch: gitBranch,
    // gitTag: gitTag,
    // gitIsDirty: gitIsDirty,
    // gitIsTagDirty: gitIsTagDirty,
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: { // 关闭mock数据的情况下，代理才会生效
    '/v1/': {
      target: 'http://localhost:8010/',
      changeOrigin: true,
      // pathRewrite: { '^/v1': 'v9' }, // url字段替换
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  extraBabelIncludes: [
    path.resolve(__dirname, '../node_modules/@kubernetes/client-node/dist/gen/model'),
    path.resolve(__dirname, '../src/utils/QtlStatefulSet'),
    path.resolve(__dirname, '../src/utils/QtlReplicaSet'),
    path.resolve(__dirname, '../src/utils/QtlDeployment'),
    path.resolve(__dirname, '../src/utils/k8sHelper'),
  ],

  chainWebpack: webpackPlugin,
};



export default config;
