// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
import global from './backend';
import git from 'git-rev-sync';
import path from 'path';

const gitVersion = git.short();
const gitVersionLong = git.long();
const gitBranch = git.branch();
const gitTag = git.tag();
const gitIsDirty = git.isDirty();
const gitIsTagDirty = git.isTagDirty();
console.log("config.prod.js")
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
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

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
  base: '/hdt',
  // hash文件后缀
  hash: true,
  // 打包输出路径
  // outputPath: '../customerportalbackend/src/main/resources/static',
  // 静态资源路径
  publicPath: '/hdt/',
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    ...global.prod,
    // 添加版本信息
    gitVersion: gitVersion,
    gitVersionLong: gitVersionLong,
    gitBranch: gitBranch,
    gitTag: gitTag,
    gitIsDirty: gitIsDirty,
    gitIsTagDirty: gitIsTagDirty,
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // 启用hash history，默认是browser History
  // history: 'hash',
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
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

if(global.prod.localMode !== 'dev'){
  config = {...config, extraBabelPlugins: extraBabelPlugins};
}

export default config;
