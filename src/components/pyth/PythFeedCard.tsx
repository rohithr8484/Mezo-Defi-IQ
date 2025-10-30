// Trading & Arbitrage
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Activity } from 'lucide-react';
import { formatPrice, PYTH_CONTRACT_ADDRESS } from '@/lib/pyth';
import { useEffect, useState } from 'react';

interface PythFeedCardProps {
  price: number;
  timestamp?: number;
  conf?: number;
}

export const PythFeedCard = ({ price, timestamp, conf }: PythFeedCardProps) => {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  useEffect(() => {
    if (!timestamp) return;
    
    const updateTimer = () => {
      const now = Date.now() / 1000;
      setTimeSinceUpdate(Math.floor(now - timestamp));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 hover-glow card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Pyth Price Feed</h3>
        </div>
        <Badge variant="outline" className="gap-1 animate-pulse">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Live
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Main Price Display */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2 animate-slide-in-left">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-sm text-muted-foreground">BTC/USD</span>
          </div>
          <div className="text-5xl font-bold gradient-text animate-shimmer bg-[length:200%_auto] [animation-delay:200ms]">
            {formatPrice(price)}
          </div>
          {conf && (
            <div className="text-sm text-muted-foreground mt-2 animate-fade-in [animation-delay:300ms]">
              ±{formatPrice(conf)} confidence
            </div>
          )}
        </div>

        {/* Feed Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last Update
            </div>
            <div className="text-sm font-medium">
              {timeSinceUpdate < 60 
                ? `${timeSinceUpdate}s ago` 
                : `${Math.floor(timeSinceUpdate / 60)}m ago`}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Update Freq</div>
            <div className="text-sm font-medium">400ms</div>
          </div>
        </div>

        {/* Contract Info */}
        <div className="pt-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-1">Mezo Mainnet Contract</div>
          <div className="font-mono text-xs bg-muted/50 p-2 rounded">
            {PYTH_CONTRACT_ADDRESS.slice(0, 20)}...{PYTH_CONTRACT_ADDRESS.slice(-20)}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            Low-Latency Pull Oracle
          </Badge>
          <Badge variant="secondary" className="text-xs">
            On-Chain Updates
          </Badge>
        </div>
      </div>
    </Card>
  );
};
