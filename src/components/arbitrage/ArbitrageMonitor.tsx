import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface ArbitrageOpportunity {
  id: string;
  token_pair: string;
  source_protocol: string;
  target_protocol: string;
  source_price: number;
  target_price: number;
  profit_percentage: number;
  estimated_profit_usd: number;
  gas_cost_usd: number;
  net_profit_usd: number;
  trade_amount: number;
  status: string;
  created_at: string;
}

export function ArbitrageMonitor() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('arbitrage_opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to fetch arbitrage opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  const runScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('arbitrage-scanner');

      if (error) throw error;

      if (data?.opportunity) {
        toast.success(`Found opportunity! Profit: $${data.opportunity.net_profit_usd.toFixed(2)}`);
      } else {
        toast.info('No profitable opportunities found at this time');
      }

      await fetchOpportunities();
    } catch (error) {
      console.error('Error running scan:', error);
      toast.error('Failed to run arbitrage scan');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('arbitrage-opportunities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'arbitrage_opportunities',
        },
        (payload) => {
          setOpportunities((prev) => [payload.new as ArbitrageOpportunity, ...prev.slice(0, 9)]);
          toast.success('New arbitrage opportunity detected!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 animate-fade-in card-hover">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6 card-hover hover-lift">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold gradient-text">
                Arbitrage Monitor
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time cross-protocol arbitrage opportunities
            </p>
          </div>
          <Button
            onClick={runScan}
            disabled={isScanning}
            variant="hero"
            size="lg"
            className="w-full sm:w-auto btn-premium"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-5 w-5" />
                Scan & Find Arbitrage
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {opportunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No arbitrage opportunities found yet</p>
              <p className="text-sm mt-2">Click "Scan Now" to search for opportunities</p>
            </div>
          ) : (
            opportunities.map((opp, index) => (
              <Card
                key={opp.id}
                className={`p-4 hover-lift card-hover animate-slide-in-right border-l-4 ${
                  opp.net_profit_usd > 50
                    ? 'border-l-success bg-gradient-to-br from-success/10 to-success/5 shadow-[0_0_20px_hsl(var(--success)/0.2)]'
                    : opp.net_profit_usd > 20
                    ? 'border-l-accent bg-gradient-to-br from-accent/10 to-accent/5 shadow-[0_0_20px_hsl(var(--accent)/0.2)]'
                    : 'border-l-primary bg-gradient-to-br from-primary/10 to-primary/5'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{opp.token_pair}</h3>
                      <Badge variant="outline" className="animate-pulse">
                        {opp.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        Buy at <span className="font-medium">{opp.source_protocol}</span> @{' '}
                        ${opp.source_price.toFixed(2)}
                      </p>
                      <p>
                        Sell at <span className="font-medium">{opp.target_protocol}</span> @{' '}
                        ${opp.target_price.toFixed(2)}
                      </p>
                      <p>
                        Trade Amount: <span className="font-medium">${opp.trade_amount.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(opp.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-500">
                        ${opp.net_profit_usd.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Net Profit</p>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <p className="text-green-400">
                        +${opp.estimated_profit_usd.toFixed(2)} gross
                      </p>
                      <p className="text-red-400">
                        -${opp.gas_cost_usd.toFixed(2)} gas
                      </p>
                      <p className="font-medium">
                        {opp.profit_percentage.toFixed(3)}% profit
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
