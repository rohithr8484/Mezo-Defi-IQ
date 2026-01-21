/**
 * Smart Contract Configuration
 * Links Solidity contracts (mezo-defi-contracts/) to UI
 */

// Deployed contract addresses on Mezo Mainnet (Chain ID: 31612)
export const CONTRACTS = {
  // SavingsVault.sol - No-loss prize savings pool
  savingsVault: {
    address: '0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186' as `0x${string}`,
    name: 'SavingsVault',
    description: 'Core vault contract for MUSD deposits, yield generation, and no-loss prize pool mechanics',
    source: 'mezo-defi-contracts/contracts/SavingsVault.sol',
  },
  
  // Staking.sol - LP token staking for rewards
  staking: {
    address: '0x16A76d3cd3C1e3CE843C6680d6B37E9116b5C706' as `0x${string}`,
    name: 'Staking',
    description: 'LP token staking for liquidity providers to earn MATS emissions and trading fee rewards',
    source: 'mezo-defi-contracts/contracts/Staking.sol',
  },
} as const;

// SavingsVault ABI (from mezo-defi-contracts/contracts/SavingsVault.sol)
export const SAVINGS_VAULT_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserDeposit',
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'entries', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDeposits',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'prizePool',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getParticipantCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Staking ABI (from mezo-defi-contracts/contracts/Staking.sol)
export const STAKING_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'exit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'earned',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStakingInfo',
    outputs: [
      { name: 'staked', type: 'uint256' },
      { name: 'pendingRewards', type: 'uint256' },
      { name: 'totalPoolStaked', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'stakedBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardRate',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Explorer URLs
export const getExplorerUrl = (address: string) => 
  `https://explorer.mezo.org/address/${address}`;

export const getExplorerTxUrl = (txHash: string) => 
  `https://explorer.mezo.org/tx/${txHash}`;
