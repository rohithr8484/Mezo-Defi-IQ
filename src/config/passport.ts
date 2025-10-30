// Trading & Arbitrage
// Mezo Passport Configuration
// Note: Mezo Passport integration is available through the wallet connection
// For advanced passport features, see: https://docs.mezo.org/passport

export const PASSPORT_CONFIG = {
  rpId: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
  rpName: 'Mezo DeFi',
  network: 'mainnet' as const,
};

// Mezo Passport is integrated through RainbowKit wallet options
// Users can connect using Passport-compatible wallets
export function isPassportAvailable(): boolean {
  return typeof window !== 'undefined' && 'ethereum' in window;
}
