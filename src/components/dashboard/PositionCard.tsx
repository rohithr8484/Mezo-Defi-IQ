// Trading & Arbitrage
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, XCircle, Shield, TrendingUp, Wallet, AlertTriangle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PositionCardProps {
  collateral: number;
  borrowed: number;
  btcPrice: number;
  onAddCollateral: () => void;
  onWithdraw: () => void;
  onClose: () => void;
}

export const PositionCard = ({
  collateral,
  borrowed,
  btcPrice,
  onAddCollateral,
  onWithdraw,
  onClose,
}: PositionCardProps) => {
  const collateralValue = collateral * btcPrice;
  const collateralRatio = borrowed > 0 ? (collateralValue / borrowed) * 100 : 0;
  const availableToWithdraw = Math.max(0, collateral - (borrowed / btcPrice) * 1.5);
  const minimumCollateralRequired = borrowed > 0 ? (borrowed / btcPrice) * 1.5 : 0;
  const liquidationPrice = borrowed > 0 ? (borrowed * 1.5) / collateral : 0;

  const getRatioStatus = (ratio: number) => {
    if (ratio >= 250) return { color: 'text-success', bg: 'from-success/20 to-success/5', borderColor: 'border-success/30' };
    if (ratio >= 200) return { color: 'text-accent', bg: 'from-accent/20 to-accent/5', borderColor: 'border-accent/30' };
    if (ratio >= 150) return { color: 'text-warning', bg: 'from-warning/20 to-warning/5', borderColor: 'border-warning/30' };
    return { color: 'text-destructive', bg: 'from-destructive/20 to-destructive/5', borderColor: 'border-destructive/30' };
  };

  const status = getRatioStatus(collateralRatio);

  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg icon-container">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                Your Position
              </h2>
              <p className="text-xs text-muted-foreground">Deposit BTC as collateral to borrow MUSD stablecoin at 1% APR</p>
            </div>
          </div>
          {collateralRatio > 0 && collateralRatio < 180 && (
            <div className="flex items-center gap-1 text-warning text-xs bg-warning/10 px-2 py-1 rounded-full border border-warning/30">
              <AlertTriangle className="h-3 w-3" />
              <span>Low Ratio</span>
            </div>
          )}
        </div>

        <div className="divider-gradient" />
          
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Shield className="h-3 w-3" />
              Collateral
            </div>
            <p className="text-xl font-bold text-foreground">{collateral.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground">BTC</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Value
            </div>
            <p className="text-xl font-bold text-foreground">${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20">
            <div className="text-xs text-muted-foreground mb-1">Borrowed</div>
            <p className="text-xl font-bold text-foreground">{borrowed.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">MUSD @ 1%</p>
          </div>
          
          <div className={`p-4 rounded-xl bg-gradient-to-br ${status.bg} border ${status.borderColor}`}>
            <div className="text-xs text-muted-foreground mb-1">Ratio</div>
            <p className={`text-xl font-bold ${status.color}`}>
              {collateralRatio > 0 ? `${collateralRatio.toFixed(0)}%` : '—'}
            </p>
            <p className="text-xs text-muted-foreground">Min: 150%</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collateral > 0 && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Available to Withdraw
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum BTC you can withdraw while maintaining 150% ratio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </div>
              <p className="text-lg font-semibold text-success">{availableToWithdraw.toFixed(4)} BTC</p>
              <p className="text-xs text-muted-foreground">${(availableToWithdraw * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          )}
          
          {borrowed > 0 && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Liquidation Price
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>BTC price at which your position would be liquidated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </div>
              <p className="text-lg font-semibold text-destructive">${liquidationPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-muted-foreground">
                {((1 - liquidationPrice / btcPrice) * 100).toFixed(0)}% below current
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAddCollateral}
            size="lg"
            className="flex-1 min-w-[140px] h-11 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 hover:from-amber-400 hover:to-yellow-300 shadow-[0_0_20px_hsl(45_100%_50%/0.25)] hover:shadow-[0_0_30px_hsl(45_100%_50%/0.4)] hover:scale-105 active:scale-95 font-semibold"
          >
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Add Collateral
          </Button>
          
          <Button
            onClick={onWithdraw}
            variant="outline"
            size="lg"
            disabled={availableToWithdraw <= 0}
            className="flex-1 min-w-[140px] h-11 border-slate-600 hover:border-slate-400 hover:bg-slate-800/50"
          >
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          
          <Button
            onClick={onClose}
            size="lg"
            disabled={borrowed <= 0}
            className="flex-1 min-w-[140px] h-11 bg-gradient-to-r from-rose-900 to-rose-800 text-rose-100 hover:from-rose-800 hover:to-rose-700 border border-rose-700/50 shadow-[0_0_15px_hsl(350_60%_30%/0.3)] hover:shadow-[0_0_25px_hsl(350_60%_40%/0.4)] hover:scale-105 active:scale-95"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Close Position
          </Button>
        </div>
      </div>
    </Card>
  );
};
