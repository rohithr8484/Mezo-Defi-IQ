// Trading & Arbitrage
import { PriceServiceConnection } from '@pythnetwork/price-service-client';

// Mezo Mainnet Pyth Contract Address
export const PYTH_CONTRACT_ADDRESS = '0x2880aB155794e7179c9eE2e38200202908C17B43';

// Pyth Network price service (updates every 400ms for low-latency)
const priceService = new PriceServiceConnection('https://hermes.pyth.network', {
  priceFeedRequestConfig: {
    binary: true,
  },
});

// Bitcoin price feed ID
export const BTC_USD_PRICE_FEED_ID = '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43';

export interface PriceData {
  price: number;
  expo: number;
  conf: number;
  timestamp: number;
}

export async function getBTCPrice(): Promise<PriceData | null> {
  try {
    const priceFeeds = await priceService.getLatestPriceFeeds([BTC_USD_PRICE_FEED_ID]);
    
    if (!priceFeeds || priceFeeds.length === 0) {
      console.error('No price feeds returned');
      return null;
    }

    const feed = priceFeeds[0] as any;
    const p = feed?.price;

    if (!p || p.price === undefined || p.expo === undefined) {
      console.error('No valid price data');
      return null;
    }

    const priceValue = Number(p.price) * Math.pow(10, p.expo);
    const confValue = p.conf !== undefined ? Number(p.conf) * Math.pow(10, p.expo) : 0;

    return {
      price: priceValue,
      expo: p.expo,
      conf: confValue,
      timestamp: feed?.publishTime ?? Date.now() / 1000,
    };
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return null;
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
