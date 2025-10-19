import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';

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
    public: {
      http: ['https://mainnet.mezo.validationcloud.io/v1/p_xemd5HnZI0yCNZwH_bjpShkEgurvMTlN9xPATAId0'],
      webSocket: ['wss://rpc-ws.mezo.boar.network/81YcmV8cjuhVuCdoidBcGlWIC0rSfy4c'],
    },
  },
  blockExplorers: {
    default: { name: 'Mezo Explorer', url: 'https://explorer.mezo.org' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'Mezo DeFi',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [mezoMainnet],
  transports: {
    [mezoMainnet.id]: http(),
  },
});
