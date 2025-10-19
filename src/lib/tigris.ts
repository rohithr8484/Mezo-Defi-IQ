// Tigris DEX Contract Addresses (Mezo Mainnet)
export const TIGRIS_CONTRACTS = {
  router: '0x16A76d3cd3C1e3CE843C6680d6B37E9116b5C706',
  poolFactory: '0x83FE469C636C4081b87bA5b3Ae9991c6Ed104248',
  pools: {
    'MUSD/BTC': '0x52e604c44417233b6CcEDDDc0d640A405Caacefb',
    'MUSD/mUSDC': '0xEd812AEc0Fecc8fD882Ac3eccC43f3aA80A6c356',
    'MUSD/mUSDT': '0x10906a9E9215939561597b4C8e4b98F93c02031A',
  },
} as const;

// Token addresses (Mezo Mainnet)
export const TOKENS = {
  WBTC: '0x5832F53d147b3d6Cd4578B9CBD62425C7ea9d0Bd', // Wrapped BTC on Mezo
  MUSD: '0xdd468a1Ddc392DCDbef6DB6E34E89aa338F9f186', // Mezo USD stablecoin
  mUSDC: '0x5A7a183B6B44Dc4EC2E3d2eF43F98C5152b1d76d', // Bridged USDC
  mUSDT: '0xc55E93C62874D8100dBd2DfE307EDc1036ad5434', // Bridged USDT
} as const;

export type TokenSymbol = keyof typeof TOKENS;
export type PoolPair = keyof typeof TIGRIS_CONTRACTS.pools;

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  amountOutMin: bigint;
  to: string;
  deadline: bigint;
}

// Router ABI for swapping
export const ROUTER_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'swapExactTokensForTokens',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
    ],
    name: 'getAmountsOut',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ERC20 ABI for token approval
export const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
