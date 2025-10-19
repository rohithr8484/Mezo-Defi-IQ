import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';

// Mezo mainnet configuration
export const mezoMainnet = {
  id: 31612,
  name: 'Mezo',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.mezo.validationcloud.io/v1/p_xemd5HnZI0yCNZwH_bjpShkEgurvMTlN9xPATAId0'],
      webSocket: ['wss://rpc-ws.mezo.boar.network/81YcmV8cjuhVuCdoidBcGlWIC0rSfy4c'],
    },
  },
  blockExplorers: {
    default: { name: 'Mezo Explorer', url: 'https://explorer.mezo.org' },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'Mezo DeFi',
  projectId: process.env.WALLETCONNECT_PROJECT_ID || 'c3b5c9a5e1d4f8c7b2a6e9d3f1c8b5a7',
  chains: [mezoMainnet],
  ssr: false,
});
