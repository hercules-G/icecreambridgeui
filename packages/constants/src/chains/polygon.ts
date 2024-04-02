import { FACTORY_ADDRESS, INIT_CODE_HASH, ROUTER_ADDRESS } from "../common/swap";
import IceChain from '../ice-chain'

export const polygon: IceChain = {
  id: 137,
  name: 'Polygon',
  features: ['swap', 'bridge', 'farms', 'kyc'],
  network: 'polygon',
  rpcUrls: {
    public: { http: ['https://polygon-rpc.com',] },
    default: { http: ['https://polygon-rpc.com',] },
  },
  blockExplorers: {
    default: { name: 'Polygon Explorer', url: 'https://polygonscan.com/' },
  },
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
  tokenDeployerDividend: {
    address: '0x3bb8171b19F5CCCaAfC1812cABa8EBc604043f6F',
    feeToken: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f',
  },
  blockInterval: 2,
  wrappedNative: {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    decimals: 18,
    symbol: 'WMATIC',
    name: 'Wrapped MATIC',
  },
  iceAddress: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f',
  stableToken: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    decimals: 18,
    symbol: 'USDT',
    name: 'Tether USD',
  },
  swap: {
    factoryAddress: FACTORY_ADDRESS,
    initCodeHash: INIT_CODE_HASH,
    routerAddress: ROUTER_ADDRESS,
  },
  kyc: {
    feeToken: '0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f',
    fee: 10,
    feeWallet: '0x2Bfd1fc5e25a8F55C2E849492ad7966EA8A0dd9E'
  },
}
