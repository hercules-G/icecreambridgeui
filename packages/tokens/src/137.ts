import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'

export const ploygonTokens = {
  weth: WETH9[ChainId.POLYGON],
  usdt: new ERC20Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 18, 'USDT', 'Tether USD'),
}
