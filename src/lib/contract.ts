import json from '../source/CreateToken.json';
import * as ethers from 'ethers';
const debug = require('debug')('qilin-admin: contract');
import { message } from 'antd';
declare const window: any;

let provider: any = null;
export const initEnv = async () => {
  if (typeof window.ethereum !== undefined) { 
    await window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum);
    debug('初始化provider 成功', provider, provider.network);
    return provider;
  } else {
    
  }
}

export const createToken = async (name: string, symbol: string, decimals: number) => {
  const listAccounts = await provider.listAccounts();
  debug('listAccounts', listAccounts);
  const signer = provider.getSigner(listAccounts[0]);
  const factory =  new ethers.ContractFactory(json.abi, json.bytecode, signer);
  const contract = await factory.deploy(name, symbol, decimals);
  debug(contract)
  message.info('合约部署中，请不要刷新页面或退出', 5);
  await contract.deployed();
  return contract;
};

export const getNetworkId = (): any => {
  return new Promise(async (resolve) => {
    if (provider) {
      const listAccounts = await provider?.listAccounts();
      resolve({
        name: provider?.network.name,
        chainId: provider?.network.chainId,
        account: listAccounts[0],
      });
    } else {
      const provider = await initEnv();
      setTimeout(async () => {
        if (!provider) {
          resolve(null);
        } else {
          const listAccounts = await provider?.listAccounts();
          resolve({
            name: provider?.network.name,
            chainId: provider?.network.chainId,
            account: listAccounts[0],
          });
        }
      }, 500);
    }
  });
}

export const bindContract = async (addres: string) => {
  const listAccounts = await provider.listAccounts();
  debug('listAccounts', listAccounts);
  const signer = provider.getSigner(listAccounts[0]);
  const contract = new ethers.Contract(addres, json.abi, provider);
  return contract.connect(signer);
}