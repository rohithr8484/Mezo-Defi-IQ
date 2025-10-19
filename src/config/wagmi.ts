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
  projectId: '00000000000000000000000000000000', // Replace with your WalletConnect Project ID in production
  chains: [mezoMainnet],
  ssr: false,
});
