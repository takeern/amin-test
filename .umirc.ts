import { defineConfig } from 'umi';

export default defineConfig({
  layout: {
    name: '',
    locale: true,
    siderWidth: 208,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  routes: [
    {
      name: '合约',
      icon: 'RocketOutlined',
      path: '/status',
      routes: [
        { path: '/status/config', name: '合约状态', component: '@/pages/index' },
        { path: '/status/logs', name: '合约日志', component: '@/pages/index' },
      ],
    },
    {
      name: '超级管理员',
      icon: 'CrownOutlined',
      path: '/admin',
      routes: [
        { path: '/admin/config', name: '合约配置管理', component: '@/pages/index' },
      ],
    },
    {
      name: '测试后台',
      icon: 'table',
      path: '/test',
      routes: [
        { path: '/test/microService', name: '微服务测试', component: '@/pages/index' },
        { path: '/test/contract', name: '合约测试', component: '@/pages/index' },
        { path: '/test/createToken', name: '一键发币', component: '@/pages/test/createToken/index' },
        { path: '/test/setToken', name: '发币配置', component: '@/pages/test/setToken/index' },
      ],
    },
  ],
});
