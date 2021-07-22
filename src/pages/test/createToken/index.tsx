import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, InputNumber, Button, Modal, message, Col, Table, Form, Input } from 'antd';
import { PlusCircleOutlined, LockOutlined, DeleteOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import './index.less'
import { createToken, getNetworkId } from '@/lib/contract';
import { formatTime } from '@/lib/utils';
import { setContractList } from '../utils';
const debug = require('debug')('qilin-admin: 一键发币');

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    isModalVisible: true,
  });

  const showModal = async (values: any, address: string, version: string) => {
    const time = formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss');
    const { name: netName, chainId, } = await getNetworkId();
    const item = {
      time,
      address,
      name: values.name,
      symbol: values.symbol,
      decimals: values.decimals,
      netName,
      chainId,
      version,
    };

    setContractList(item);
    Modal.success({
      title: '部署成功，合约收据',
      content: (
        <div style={{
          marginTop: 40,
          fontSize: 14,
          fontWeight: "bolder",
        }}>
          <p>
            <b>部署时间</b>{`: ${time}`}
          </p>
          <p>
            <b>合约地址</b>{`: ${address}`}
          </p>
          {
            Object.entries(values).map(item => {
              return <p key={item[0]}><em>{item[0]}</em>{`: ${item[1]}`}</p>
            })
          }
        </div>
      ),
    });
  }
  /**
   * 1. loading 添加
   * 2. 币状态存储
   * 3. 发币配置
   */
  const handleFinish = async () => {
    if (state.loading) {
      return message.warn('发币中 请稍候!!');
    }

    setState(pstate => ({
      ...pstate,
      loading: true,
    }));
    const values = await form.validateFields();
    values.name = values.name?.replaceAll(' ', '');
    const res = await createToken(values.name, values.symbol, values.decimals)
      .catch(error => {
        debug('发币失败', error);
        message.error(`发币失败, error: ${JSON.stringify(error)}`, 5);
      });
    setState(pstate => ({
      ...pstate,
      loading: false,
    }));

    if (res) {
      debug(res);
      showModal(values, res.address, await res.getVersion());
    }
  }
  return (
    <PageContainer>
      <div className="create-token-wrapper">
        {/* <Typography.Title level={3}>快速发币</Typography.Title> */}
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={handleFinish}
          {...formItemLayout} 
          initialValues={{ 
            symbol: 'BTC',
            decimals: 18,
          }}
          // onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="法币名称"
            help="请输入英文字符"
            rules={[{ required: true, message: 'Please input your 法币名称!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="法币名称" />
          </Form.Item>
          <Form.Item
            name="symbol"
            label="法币symbol"
            help="请输入英文字符, 不超过 4 个字符"
            rules={[{ required: true, message: 'Please input your 法币symbol!' }]}
          >
            <Input
              prefix={<SendOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label="法币精度" 
            name="decimals"
            rules={[{ required: true, message: 'Please input your 法币精度!' }]}
          >
            <InputNumber
              max={18}
              placeholder="法币精度"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button loading={state.loading} type="primary" htmlType="submit" className="login-form-button" danger>
            一键发币
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  );
}