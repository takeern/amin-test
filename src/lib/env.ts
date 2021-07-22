import { initEnv } from './contract';

const { host } = document.location;
const env = {
  isPre: host.indexOf('pre-') > -1 || host.indexOf('wapa.taobao') > -1,
  isLocal: host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1,
  isPro: false,
};

env.isPro = !env.isPre && !env.isLocal;

initEnv();

export default env;
