import { Jsonrpc20 } from '../src/Jsonrpc20';
import { IconRawBlock } from '../src/IconRawBlock';
import { DataCall } from '../src/IconTransaction';

export const rawBlock: Jsonrpc20<IconRawBlock> = {
  jsonrpc: '2.0',
  result: {
    version: '0.5',
    height: 23422720,
    signature:
      'YhAyX3/OLSWeVmcGnXsfSk7XiPIdfEYEzdXYKb1zkyZoDoQdObkwRd3LUpEFRTflGEuxLxdoHd/vdqjdcQnuYAE=',
    prev_block_hash: '6165b72bf9695c4792cf1ec1ba6aecad832d72be8b3c85f5d88b8f637c55684f',
    merkle_tree_root_hash: '97aa56ba2cb8b9bdb897ee7355901c6e447f2fa3774248f530b0b78e1900947e',
    time_stamp: 1598862518674351,
    confirmed_transaction_list: [
      {
        version: '0x3',
        timestamp: '0x5ae28307863af',
        dataType: 'base',
        data: {
          prep: {
            irep: '0x2f4add6ae4f410b597a',
            rrep: '0x1bf',
            totalDelegation: '0xf949d29451c689d8c0c5d6',
            value: '0x2d2e445e6f8fa3c3',
          },
          result: {
            coveredByFee: '0x0',
            coveredByOverIssuedICX: '0x0',
            issue: '0x2d2e445e6f8fa3c3',
          },
        },
        txHash: '0xc2bbc4ff61319a42c7ca519624bb9a05b1e21306b3d4fe2686429ddae54d9bbd',
      },
      {
        version: '0x3',
        from: 'hx930a0bedaff46c3afd3eddad4078d3f3d4d74735',
        to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
        stepLimit: '0xc3500',
        timestamp: '0x5ae283068af0a',
        nid: '0x1',
        value: '0x4563918244f40000',
        nonce: '0x5',
        dataType: 'call',
        data: {
          method: 'bet_on_numbers',
          params: {
            numbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
            user_seed: '@tipiconbot',
          },
        },
        signature:
          'XH2klvn8uKbFjEYNEnbThxAExiTP6UsKG7Jv/IG2SBB3SUPT4d+RLE2P5QP4OfPhajJWwz4WeSUdX0KkwvNORQA=',
        txHash: '0xda9d2b65ff04009e85b2c9934f2206b3ae804781ce2ba6722fa9df9922f9b93d',
      },
      {
        version: '0x3',
        from: 'hx8edc6f20440430ad00c28d398a63e1e7578c1e90',
        to: 'cx1b97c1abfd001d5cd0b5a3f93f22cccfea77e34e',
        stepLimit: '0xc3500',
        timestamp: '0x5ae2830692267',
        nid: '0x1',
        value: '0x3782dace9d900000',
        nonce: '0x5',
        dataType: 'call',
        data: {
          method: 'bet_on_numbers',
          params: {
            numbers: '1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20',
            user_seed: '@tipiconbot',
          },
        },
        signature:
          'qW+I9/zdmf2ByUVQXdYhOb0RUAKAkg1ZAVDitv9MzDRxNo3468rGFPGgisjuSoWpUdkg0bqobRoR4wHxNoM0bgA=',
        txHash: '0x60eb281ecd589ab3e9a15a0974500c5da093afaa7903fd9f097d385b51cc3ead',
      },
    ],
    block_hash: '375870e1c362bdd59678c4ff4c6d2e0b9bdc0016e0ff72b167f60e5d0a9354d7',
    peer_id: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
    next_leader: 'hxd6f20327d135cb0227230ab98792173a5c97b03e',
  },
  id: 1,
};
