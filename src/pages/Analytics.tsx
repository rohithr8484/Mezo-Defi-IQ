import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PythFeedCard } from '@/components/pyth/PythFeedCard';
import { ArbitrageMonitor } from '@/components/arbitrage/ArbitrageMonitor';
import { getBTCPrice } from '@/lib/pyth';

const Analytics = () => {
  const [btcPrice, setBtcPrice] = useState(98000);
  const [priceData, setPriceData] = useState<{ price: number; timestamp: number; conf: number } | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getBTCPrice();
      if (price) {
        setBtcPrice(price.price);
        setPriceData({
          price: price.price,
          timestamp: price.timestamp,
          conf: price.conf,
        });
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      <section className="bg-[hsl(var(--section-light))] py-12 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-10 slide-up-fade">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text animate-shimmer bg-[length:200%_auto]">
              📊 Analytics & Price Feeds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time market data and arbitrage opportunities
            </p>
          </div>
          
          <div className="flex flex-col gap-8 max-w-3xl mx-auto">
            <div className="animate-scale-in">
              <PythFeedCard 
                price={priceData?.price || btcPrice} 
                timestamp={priceData?.timestamp}
                conf={priceData?.conf}
              />
            </div>
            <div className="animate-scale-in [animation-delay:150ms]">
              <ArbitrageMonitor />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Analytics;
