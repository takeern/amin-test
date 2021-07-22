import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, InputNumber, Space, Button, Modal, message, Select, Table, Form, Input } from 'antd';
import { PlusCircleOutlined, LockOutlined, MoneyCollectOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import './index.less'
import { createToken, bindContract } from '@/lib/contract';
import { formatTime } from '@/lib/utils';
import { setContractList, getContractList } from '../utils';
import * as ethers from 'ethers';
const debug = require('debug')('qilin-admin: 发币配置');

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
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const [form4] = Form.useForm();
  const [form5] = Form.useForm();
  const [form6] = Form.useForm();
  const [state, setState] = useState<{
    contract: ethers.ethers.Contract | undefined,
    loading: boolean,
    isModalVisible: boolean,
    contractInfo: {
      totalSupply: string,
      governance: string,
      address: string,
    } | undefined,
  }>({
    loading: false,
    isModalVisible: true,
    contract: undefined,
    contractInfo: undefined,
  });

  const checkContract = () => {
    if (!state.contract) {
      message.error('未绑定合约！')
      return false;
    }
    return true;
  }

  const handleTransfer = async () => {
    if (checkContract()) {
      const values = await form1.validateFields();
      const res = await state.contract?.mint(values.address, ethers.BigNumber.from(values.amount))
        .catch((e: any) => {
          message.error(`铸币失败: ${JSON.stringify(e)}`)
        });

      if (res) {
        message.success(`铸币成功: ${values.address}`);
      }
    }
  };

  const handleBindContract = async (data: any) => {
    const contract = await bindContract(data.address);
    message.success('绑定合约成功!');
    debug(contract);
    setState(pstate => ({
      ...pstate,
      contract,
    }));

    const totalSupply = await contract.totalSupply();
    const governance = await contract.governance();

    setState(pstate => ({
      ...pstate,
      contractInfo: {
        governance,
        totalSupply: totalSupply.toNumber(),
        address: data.address,
      },
    }));
  };

  const handleSetMint = async (type = true) => {
    const form = type ? form3 : form4;
    if (checkContract()) {
      const values = await form.validateFields();
      let res;
      if (type) {
        res = await state.contract?.addMinter(values.address)
        .catch((e: any) => {
          message.error(`设置铸币权限失败: ${JSON.stringify(e)}`)
        });
      } else {
        res = await state.contract?.removeMinter(values.address)
        .catch((e: any) => {
          message.error(`设置铸币权限失败: ${JSON.stringify(e)}`)
        });
      }

      if (res) {
        message.success(`设置铸币权限成功: ${values.address}`);
      }
    }
  };

  const handleSetAdmin = async () => {
    if (checkContract()) {
      const values = await form2.validateFields();
      const res = await state.contract?.setGovernance(values.address)
        .catch((e: any) => {
          message.error(`设置管理员失败: ${JSON.stringify(e)}`)
        });

      if (res) {
        message.success(`设置管理员成功: ${values.address}`);
      }
    }
  };
  
  const handleChangeContract = async () => {
    const values = await form5.validateFields();
    handleBindContract({ address: values.address });
  };

  const handleGetBlance = async () => { 
    if (checkContract()) {
      const values = await form6.validateFields();
      const res = await state.contract?.balanceOf(values.address)
        .catch((e: any) => {
          message.error(`查询失败: ${JSON.stringify(e)}`)
        });

      if (res) {
        message.success(`查询成功: ${values.address}, amout： ${res.toNumber()}`);
      }
    }
  };

  const dataSource: any[] = getContractList();
  const columns = [
    {
      title: '发币名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: '发币精度',
      dataIndex: 'decimals',
      key: 'decimals',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: '合约地址',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: '部署 chainId',
      dataIndex: 'chainId',
      key: 'chainId',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: '合约版本',
      dataIndex: 'version',
      key: 'version',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: '部署时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (data: any) => {
        return (
          <Space size="middle">
            <a onClick={() => handleBindContract(data)}>绑定该合约</a>
          </Space>
        )
      },
    },
  ];
  dataSource.every((item: any, index) => item.key = index + item.name);
  return (
    <PageContainer>
      <Typography.Title level={4}>本地合约列表</Typography.Title>
      <Table dataSource={dataSource} columns={columns} />
      <Typography.Title level={4}>查询绑定合约状态</Typography.Title>
      <div
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          marginLeft: 200,
        }}
      >
        {
          state.contractInfo ? 
            (
              <div >
                {
                  Object.entries(state.contractInfo).map((item, index) => {
                    return <p key={item[0]}><em>{item[0]}</em>{`: ${item[1]}`}</p>
                  })
                }
              </div>
            ):
            (
              <p>未绑定</p>
            )
        }
        </div>
      <Typography.Title level={4}>手动绑定合约</Typography.Title>
        <Form
            form={form5}
            onFinish={handleChangeContract}
            {...formItemLayout}
            layout={'inline'}
            style={{
              display: 'flex', 
              justifyContent: 'space-evenly',
              margin: '20px 0',
            }}
          >
            <Form.Item
              name="address"
              label="合约地址"
              style={{
                width: 600,
              }}
                rules={[{ required: true, message: 'Please input your 合约地址!' }]}
              >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="合约地址" />
            </Form.Item>
            
            <Form.Item
            >
              <Button loading={state.loading} type="primary" htmlType="submit" danger>
                绑定
              </Button>
            </Form.Item>
          </Form>
      <Typography.Title level={4}>查询某地址当前发币数</Typography.Title>
      <Form
          form={form6}
          onFinish={handleGetBlance}
          {...formItemLayout}
          layout={'inline'}
          style={{
            display: 'flex', 
            justifyContent: 'space-evenly',
            margin: '20px 0',
          }}
        >
          <Form.Item
            name="address"
            label="用户地址"
            style={{
              width: 600,
            }}
              rules={[{ required: true, message: 'Please input your 用户地址!' }]}
            >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户地址" />
          </Form.Item>
          
          <Form.Item
          >
            <Button loading={state.loading} type="primary" htmlType="submit" danger>
              查询
            </Button>
          </Form.Item>
        </Form>
      <Typography.Title level={4}>铸币</Typography.Title>
        <Form
          form={form1}
          onFinish={handleTransfer}
          {...formItemLayout}
          layout={'inline'}
          style={{
            display: 'flex', 
            justifyContent: 'space-evenly',
            margin: '20px 0',
          }}
        >
          <Form.Item
            name="address"
          label="转账地址"
          style={{
            width: 600,
          }}
            rules={[{ required: true, message: 'Please input your 转账地址!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="转账地址" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="金额"
            rules={[{ required: true, message: '请输入转账金额!' }]}
          >
            <InputNumber  placeholder="转账金额" />
          </Form.Item>
          <Form.Item
          >
            <Button loading={state.loading} type="primary" htmlType="submit" danger>
              铸币
            </Button>
          </Form.Item>
      </Form>
      <Typography.Title level={4}>添加铸币权限</Typography.Title>
        <Form
          form={form3}
          onFinish={handleSetMint}
          {...formItemLayout}
          layout={'inline'}
          style={{
            display: 'flex', 
            justifyContent: 'space-evenly',
            margin: '20px 0',
          }}
        >
          <Form.Item
            name="address"
            label="用户地址"
            style={{
              width: 600,
            }}
              rules={[{ required: true, message: 'Please input your 用户地址!' }]}
            >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户地址" />
          </Form.Item>
          
          <Form.Item
          >
            <Button loading={state.loading} type="primary" htmlType="submit" danger>
              添加铸币权限
            </Button>
          </Form.Item>
        </Form>
      <Typography.Title level={4}>移除铸币权限</Typography.Title>
      <Form
          form={form4}
          onFinish={handleSetMint}
          {...formItemLayout}
          layout={'inline'}
          style={{
            display: 'flex', 
            justifyContent: 'space-evenly',
            margin: '20px 0',
          }}
        >
          <Form.Item
            name="address"
            label="用户地址"
            style={{
              width: 600,
            }}
              rules={[{ required: true, message: 'Please input your 用户地址!' }]}
            >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户地址" />
          </Form.Item>
          
          <Form.Item
          >
            <Button loading={state.loading} type="primary" htmlType="submit" danger>
              移除铸币权限
            </Button>
          </Form.Item>
        </Form>
      <Typography.Title level={4}>设置治理管理员地址</Typography.Title>
        <Form
          form={form2}
          onFinish={handleSetAdmin}
          {...formItemLayout}
          layout={'inline'}
          style={{
            display: 'flex', 
            justifyContent: 'space-evenly',
            margin: '20px 0',
          }}
        >
          <Form.Item
            name="address"
            label="用户地址"
            style={{
              width: 600,
            }}
              rules={[{ required: true, message: 'Please input your 用户地址!' }]}
            >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户地址" />
          </Form.Item>
          
          <Form.Item
          >
            <Button loading={state.loading} type="primary" htmlType="submit" danger>
              设置唯一治理管理员
            </Button>
          </Form.Item>
        </Form>
    </PageContainer>
  );
}