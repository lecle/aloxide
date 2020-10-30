import { IconBlock } from '../src';
import createLoggerTest from './createLoggerTest';
import { rawBlock } from './rawBlock';

describe('test IconBlock', () => {
  const logger = createLoggerTest();

  it('test icon block', () => {
    const iconBlock = new IconBlock(rawBlock, logger);
    expect(iconBlock.blockInfo).toEqual({
      blockHash: '375870e1c362bdd59678c4ff4c6d2e0b9bdc0016e0ff72b167f60e5d0a9354d7',
      blockNumber: 23422720,
      previousBlockHash: '6165b72bf9695c4792cf1ec1ba6aecad832d72be8b3c85f5d88b8f637c55684f',
      timestamp: new Date('2020-08-31T08:28:38.674Z'),
    });

    expect(iconBlock.actions).toEqual([
      {
        payload: {
          actionIndex: 1,
          data: {
            numbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
            user_seed: '@tipiconbot',
          },
          dataType: 'call',
          from: 'hx930a0bedaff46c3afd3eddad4078d3f3d4d74735',
          nid: '0x1',
          nonce: '0x5',
          producer: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
          signature:
            'XH2klvn8uKbFjEYNEnbThxAExiTP6UsKG7Jv/IG2SBB3SUPT4d+RLE2P5QP4OfPhajJWwz4WeSUdX0KkwvNORQA=',
          stepLimit: '0xc3500',
          timestamp: '0x5ae283068af0a',
          to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
          transactionId: '0xda9d2b65ff04009e85b2c9934f2206b3ae804781ce2ba6722fa9df9922f9b93d',
          txHash: '0xda9d2b65ff04009e85b2c9934f2206b3ae804781ce2ba6722fa9df9922f9b93d',
          value: '0x4563918244f40000',
          version: '0x3',
        },
        type: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e::bet_on_numbers',
      },
      {
        payload: {
          actionIndex: 2,
          data: {
            numbers: '1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20',
            user_seed: '@tipiconbot',
          },
          dataType: 'call',
          from: 'hx8edc6f20440430ad00c28d398a63e1e7578c1e90',
          nid: '0x1',
          nonce: '0x5',
          producer: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
          signature:
            'qW+I9/zdmf2ByUVQXdYhOb0RUAKAkg1ZAVDitv9MzDRxNo3468rGFPGgisjuSoWpUdkg0bqobRoR4wHxNoM0bgA=',
          stepLimit: '0xc3500',
          timestamp: '0x5ae2830692267',
          to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
          transactionId: '0x60eb281ecd589ab3e9a15a0974500c5da093afaa7903fd9f097d385b51cc3ead',
          txHash: '0x60eb281ecd589ab3e9a15a0974500c5da093afaa7903fd9f097d385b51cc3ead',
          value: '0x3782dace9d900000',
          version: '0x3',
        },
        type: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e::bet_on_numbers',
      },
    ]);
  });

  fit('test icon block without data', () => {
    delete rawBlock.result.confirmed_transaction_list[2].data;
    const iconBlock = new IconBlock(rawBlock, logger);
    expect(iconBlock.blockInfo).toEqual({
      blockHash: '375870e1c362bdd59678c4ff4c6d2e0b9bdc0016e0ff72b167f60e5d0a9354d7',
      blockNumber: 23422720,
      previousBlockHash: '6165b72bf9695c4792cf1ec1ba6aecad832d72be8b3c85f5d88b8f637c55684f',
      timestamp: new Date('2020-08-31T08:28:38.674Z'),
    });

    expect(iconBlock.actions).toEqual([
      {
        payload: {
          actionIndex: 1,
          data: {
            numbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
            user_seed: '@tipiconbot',
          },
          dataType: 'call',
          from: 'hx930a0bedaff46c3afd3eddad4078d3f3d4d74735',
          nid: '0x1',
          nonce: '0x5',
          producer: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
          signature:
            'XH2klvn8uKbFjEYNEnbThxAExiTP6UsKG7Jv/IG2SBB3SUPT4d+RLE2P5QP4OfPhajJWwz4WeSUdX0KkwvNORQA=',
          stepLimit: '0xc3500',
          timestamp: '0x5ae283068af0a',
          to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
          transactionId: '0xda9d2b65ff04009e85b2c9934f2206b3ae804781ce2ba6722fa9df9922f9b93d',
          txHash: '0xda9d2b65ff04009e85b2c9934f2206b3ae804781ce2ba6722fa9df9922f9b93d',
          value: '0x4563918244f40000',
          version: '0x3',
        },
        type: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e::bet_on_numbers',
      },
      {
        payload: {
          actionIndex: 2,
          data: undefined,
          dataType: 'call',
          from: 'hx8edc6f20440430ad00c28d398a63e1e7578c1e90',
          nid: '0x1',
          nonce: '0x5',
          producer: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
          signature:
            'qW+I9/zdmf2ByUVQXdYhOb0RUAKAkg1ZAVDitv9MzDRxNo3468rGFPGgisjuSoWpUdkg0bqobRoR4wHxNoM0bgA=',
          stepLimit: '0xc3500',
          timestamp: '0x5ae2830692267',
          to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
          transactionId: '0x60eb281ecd589ab3e9a15a0974500c5da093afaa7903fd9f097d385b51cc3ead',
          txHash: '0x60eb281ecd589ab3e9a15a0974500c5da093afaa7903fd9f097d385b51cc3ead',
          value: '0x3782dace9d900000',
          version: '0x3',
        },
        type: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e::undefined',
      },
    ]);
  });
});
