import { PriceServiceConnection } from '@pythnetwork/price-service-client';

// Pyth Network price service
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

    const priceFeed = priceFeeds[0];
    const price = priceFeed.getPriceNoOlderThan(60); // Price no older than 60 seconds
    
    if (!price) {
      console.error('No valid price data');
      return null;
    }

    return {
      price: Number(price.price) * Math.pow(10, price.expo),
      expo: price.expo,
      conf: Number(price.conf) * Math.pow(10, price.expo),
      timestamp: price.publishTime,
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
