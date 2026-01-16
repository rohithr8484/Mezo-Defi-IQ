// Trading & Arbitrage
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Coins, TrendingUp, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BorrowCardProps {
  btcPrice: number;
  onBorrow: (collateral: number, borrow: number) => void;
}

export const BorrowCard = ({ btcPrice, onBorrow }: BorrowCardProps) => {
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [collateralRatioTarget, setCollateralRatioTarget] = useState([200]);

  const collateralValue = parseFloat(collateralAmount || '0') * btcPrice;
  const maxBorrow = collateralValue / 1.5; // 150% minimum collateral ratio
  const safeBorrow = collateralValue / (collateralRatioTarget[0] / 100);
  const currentRatio = parseFloat(borrowAmount || '0') > 0 
    ? (collateralValue / parseFloat(borrowAmount || '1')) * 100 
    : 0;

  const handleMaxBorrow = () => {
    setBorrowAmount(maxBorrow.toFixed(2));
  };

  const handleSafeBorrow = () => {
    setBorrowAmount(safeBorrow.toFixed(2));
  };

  const handleBorrow = () => {
    const collateral = parseFloat(collateralAmount);
    const borrow = parseFloat(borrowAmount);
    
    if (collateral > 0 && borrow > 0 && borrow <= maxBorrow) {
      onBorrow(collateral, borrow);
      setCollateralAmount('');
      setBorrowAmount('');
    }
  };

  const getRatioStatus = (ratio: number) => {
    if (ratio >= 250) return { color: 'text-success', label: 'Very Safe', icon: CheckCircle2, bg: 'bg-success/10 border-success/30' };
    if (ratio >= 200) return { color: 'text-accent', label: 'Safe', icon: CheckCircle2, bg: 'bg-accent/10 border-accent/30' };
    if (ratio >= 150) return { color: 'text-warning', label: 'Moderate', icon: AlertTriangle, bg: 'bg-warning/10 border-warning/30' };
    return { color: 'text-destructive', label: 'At Risk', icon: AlertTriangle, bg: 'bg-destructive/10 border-destructive/30' };
  };

  const ratioStatus = getRatioStatus(currentRatio);
  const RatioIcon = ratioStatus.icon;

  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg icon-container">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold gradient-text-gold">
                Borrow MUSD
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Deposit BTC collateral and mint MUSD at 1% fixed rate
            </p>
          </div>
          <div className="stat-badge flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            1% APR
          </div>
        </div>

        <div className="divider-gradient" />

        <div className="space-y-5">
          {/* Collateral Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="collateral" className="text-sm font-medium flex items-center gap-2">
                Collateral Amount
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Amount of BTC to use as collateral</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-xs text-muted-foreground">BTC</span>
            </div>
            <div className="relative">
              <Input
                id="collateral"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="text-lg pr-20 input-enhanced h-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img src="/src/assets/tokens/btc-logo.png" alt="BTC" className="h-5 w-5 rounded-full" />
              </div>
            </div>
            {collateralAmount && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                ≈ ${collateralValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Target Collateral Ratio Slider */}
          {collateralAmount && parseFloat(collateralAmount) > 0 && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Target Collateral Ratio</Label>
                <span className="text-sm font-semibold text-primary">{collateralRatioTarget[0]}%</span>
              </div>
              <Slider
                value={collateralRatioTarget}
                onValueChange={setCollateralRatioTarget}
                min={150}
                max={300}
                step={10}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>150% (Max)</span>
                <span>200% (Safe)</span>
                <span>300% (Very Safe)</span>
              </div>
            </div>
          )}

          {/* Borrow Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="borrow" className="text-sm font-medium flex items-center gap-2">
                Borrow Amount
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Amount of MUSD to borrow against your collateral</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSafeBorrow}
                  disabled={!collateralAmount}
                  className="h-6 px-2 text-xs text-accent hover:text-accent"
                >
                  SAFE
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaxBorrow}
                  disabled={!collateralAmount}
                  className="h-6 px-2 text-xs text-primary hover:text-primary"
                >
                  MAX
                </Button>
              </div>
            </div>
            <div className="relative">
              <Input
                id="borrow"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="text-lg pr-20 input-enhanced h-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img src="/src/assets/tokens/musd-logo.png" alt="MUSD" className="h-5 w-5 rounded-full" />
              </div>
            </div>
            {borrowAmount && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Safe: ${safeBorrow.toFixed(2)}</span>
                <span>Max: ${maxBorrow.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Collateral Ratio Display */}
          {currentRatio > 0 && (
            <div className={`p-4 rounded-lg border ${ratioStatus.bg} transition-colors duration-300`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <RatioIcon className={`h-5 w-5 ${ratioStatus.color}`} />
                  <span className="text-sm font-medium">Collateral Ratio</span>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold ${ratioStatus.color}`}>
                    {currentRatio.toFixed(0)}%
                  </span>
                  <span className={`ml-2 text-xs ${ratioStatus.color}`}>
                    {ratioStatus.label}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      currentRatio >= 250 ? 'bg-success' :
                      currentRatio >= 200 ? 'bg-accent' :
                      currentRatio >= 150 ? 'bg-warning' :
                      'bg-destructive'
                    }`}
                    style={{ width: `${Math.min(100, (currentRatio / 300) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>150%</span>
                  <span>200%</span>
                  <span>300%</span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleBorrow}
            disabled={
              !collateralAmount || 
              !borrowAmount || 
              parseFloat(borrowAmount) > maxBorrow ||
              parseFloat(borrowAmount) <= 0 ||
              currentRatio < 150
            }
            variant="hero"
            size="lg"
            className="w-full h-12 text-base"
          >
            <Coins className="mr-2 h-5 w-5" />
            Mint MUSD
          </Button>
        </div>
      </div>
    </Card>
  );
};
