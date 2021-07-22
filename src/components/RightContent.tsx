import { Tag, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import env from '@/lib/env';
import styles from './index.less';
import { getNetworkId } from '@/lib/contract';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  isLocal: ['orange', '本地环境'],
  isPre: ['green', '预发环境'],
  isPro: ['#87d068', '线上环境'],
};

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  const [state, setState] = useState<{
    network: {
      name: string,
      chainId: string,
      account: string,
    } | undefined
  }>({
    network: undefined,
  });

  const init = async () => {
    const network = await getNetworkId();  
    setState({
      network,
    });
  }
  
  useEffect(() => {
    init();
  }, []);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }


  return (
    <Space className={className}>
      <span>
        {
          state.network ?
            <span>
              <Tag color={'orange'}>{`network name: ${state.network.name}`}</Tag>
              <Tag color={'green'}>{`network chainId: ${state.network.chainId}`}</Tag>
              <Tag color={'gold'}>{`account: ${state.network.account}`}</Tag>
            </span>
            :
            <span>
              <Tag color={'#87d068'}>{`环境未绑定`}</Tag>
            </span>
        }
      </span>
    </Space>
  );
};
export default GlobalHeaderRight;
