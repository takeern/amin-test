import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  history: {
    type: 'hash',
  },
  hash: false,
  runtimePublicPath: true,
  antd: {},
  //publicPath: 'https://dev.g.alicdn.com/mtb/app-live-operate-center/9.9.9/',
  dva: {
    hmr: true,
  },
  layout: {
    name: '',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
});
