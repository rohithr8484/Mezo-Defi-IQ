import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, TrendingUp, AlertTriangle, CheckCircle2, Info, Sparkles, 
  Shield, Wallet, ArrowUpCircle, ArrowDownCircle, XCircle, CreditCard,
  Clock, Percent, DollarSign, Bitcoin
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MUSDLoanCardProps {
  btcPrice: number;
  collateral: number;
  borrowed: number;
  onBorrow: (collateral: number, borrow: number) => void;
  onAddCollateral: () => void;
  onWithdraw: () => void;
  onClose: () => void;
}

export const MUSDLoanCard = ({ 
  btcPrice, 
  collateral, 
  borrowed,
  onBorrow, 
  onAddCollateral, 
  onWithdraw, 
  onClose 
}: MUSDLoanCardProps) => {
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('10000');
  const [ltvRatio, setLtvRatio] = useState([50]);
  const [loanTerm, setLoanTerm] = useState('12');

  // Calculate loan details based on desired borrow amount
  const desiredBorrow = parseFloat(loanAmount || '0');
  const requiredCollateralValue = desiredBorrow / (ltvRatio[0] / 100);
  const requiredCollateralBTC = requiredCollateralValue / btcPrice;
  
  // Calculate APR based on term (simplified calculation)
  const baseAPR = 11.9;
  const apr = loanTerm === '6' ? baseAPR - 1 : loanTerm === '24' ? baseAPR + 2 : baseAPR;
  const interest = desiredBorrow * (apr / 100) * (parseInt(loanTerm) / 12);
  const payAtMaturity = desiredBorrow + interest;

  // Existing position calculations
  const collateralValue = collateral * btcPrice;
  const collateralRatio = borrowed > 0 ? (collateralValue / borrowed) * 100 : 0;
  const availableToWithdraw = Math.max(0, collateral - (borrowed / btcPrice) * 1.5);
  const liquidationPrice = borrowed > 0 ? (borrowed * 1.5) / collateral : 0;

  const handleMintMUSD = () => {
    const collateralBTC = requiredCollateralBTC;
    if (collateralBTC > 0 && desiredBorrow > 0) {
      onBorrow(collateralBTC, desiredBorrow);
      setLoanAmount('10000');
    }
  };

  const getRatioStatus = (ratio: number) => {
    if (ratio >= 250) return { color: 'text-success', label: 'Very Safe', icon: CheckCircle2, bg: 'bg-success/10 border-success/30' };
    if (ratio >= 200) return { color: 'text-accent', label: 'Safe', icon: CheckCircle2, bg: 'bg-accent/10 border-accent/30' };
    if (ratio >= 150) return { color: 'text-warning', label: 'Moderate', icon: AlertTriangle, bg: 'bg-warning/10 border-warning/30' };
    return { color: 'text-destructive', label: 'At Risk', icon: AlertTriangle, bg: 'bg-destructive/10 border-destructive/30' };
  };

  const hasActivePosition = collateral > 0 || borrowed > 0;
  const positionStatus = getRatioStatus(collateralRatio);

  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text-gold">
                MUSD Loans
              </h2>
              <p className="text-sm text-muted-foreground">
                Bitcoin-backed stablecoin loans
              </p>
            </div>
          </div>
          <div className="stat-badge flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {apr.toFixed(1)}% APR
          </div>
        </div>

        <div className="divider-gradient" />

        <Tabs defaultValue={hasActivePosition ? "position" : "borrow"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="borrow" className="data-[state=active]:bg-primary/20">
              <Coins className="h-4 w-4 mr-2" />
              New Loan
            </TabsTrigger>
            <TabsTrigger value="position" className="data-[state=active]:bg-accent/20">
              <Wallet className="h-4 w-4 mr-2" />
              Your Position
            </TabsTrigger>
          </TabsList>

          {/* New Loan Tab */}
          <TabsContent value="borrow" className="space-y-6">
            {/* Borrow Amount Header */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Borrow</p>
              <div className="flex items-center justify-center gap-2">
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="text-4xl font-bold bg-transparent border-none text-center w-40 p-0 h-auto focus-visible:ring-0"
                  placeholder="10,000"
                />
                <span className="text-4xl font-bold text-primary">MUSD</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Adjust your principal amount to change your collateral requirement and loan costs
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Bitcoin className="h-3 w-3" />
                  Minimum collateral
                </div>
                <p className="text-xl font-bold text-foreground">
                  ₿{requiredCollateralBTC.toFixed(5)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${requiredCollateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <DollarSign className="h-3 w-3" />
                  Pay at maturity
                </div>
                <p className="text-xl font-bold text-foreground">
                  ${payAtMaturity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  in {loanTerm} months
                </p>
              </div>
            </div>

            {/* Loan Details */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Origination fee</span>
                <span className="text-sm font-medium">$0 (0%)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Interest</span>
                <span className="text-sm font-medium">${interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Rate
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Annual Percentage Rate for the loan</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span className="text-sm font-bold text-primary">{apr.toFixed(1)}% APR</span>
              </div>
            </div>

            {/* LTV Slider */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  Loan-to-Value (LTV)
                </Label>
                <span className="text-lg font-bold text-primary">{ltvRatio[0]}%</span>
              </div>
              <Slider
                value={ltvRatio}
                onValueChange={setLtvRatio}
                min={20}
                max={66}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20% (Safer)</span>
                <span>50% (Standard)</span>
                <span>66% (Max)</span>
              </div>
            </div>

            {/* Loan Terms Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Terms</p>
                  <p className="font-semibold">{loanTerm}-month</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">LTV</p>
                  <p className="font-semibold">{ltvRatio[0]}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">APR*</p>
                  <p className="font-semibold text-primary">{apr.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Term Selection */}
            <div className="flex gap-2">
              {['6', '12', '24'].map((term) => (
                <Button
                  key={term}
                  variant={loanTerm === term ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoanTerm(term)}
                  className="flex-1"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {term} months
                </Button>
              ))}
            </div>

            <Button
              onClick={handleMintMUSD}
              disabled={desiredBorrow <= 0}
              variant="hero"
              size="lg"
              className="w-full h-12 text-base"
            >
              <Coins className="mr-2 h-5 w-5" />
              Mint {desiredBorrow.toLocaleString()} MUSD
            </Button>
          </TabsContent>

          {/* Position Tab */}
          <TabsContent value="position" className="space-y-6">
            {/* Position Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Shield className="h-3 w-3" />
                  Collateral
                </div>
                <p className="text-xl font-bold text-foreground">{collateral.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">BTC (${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })})</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
                <div className="text-xs text-muted-foreground mb-1">Borrowed</div>
                <p className="text-xl font-bold text-foreground">{borrowed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">MUSD @ {apr.toFixed(1)}%</p>
              </div>
            </div>

            {/* Health Indicator */}
            <div className={`p-4 rounded-xl border ${hasActivePosition ? positionStatus.bg : 'bg-muted/30 border-border'} transition-colors`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {hasActivePosition ? (
                    <positionStatus.icon className={`h-5 w-5 ${positionStatus.color}`} />
                  ) : (
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Health Ratio</span>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${hasActivePosition ? positionStatus.color : 'text-muted-foreground'}`}>
                    {collateralRatio.toFixed(0)}%
                  </span>
                  {hasActivePosition && (
                    <span className={`ml-2 text-xs ${positionStatus.color}`}>
                      {positionStatus.label}
                    </span>
                  )}
                  {!hasActivePosition && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      No Position
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    !hasActivePosition ? 'bg-muted-foreground/30' :
                    collateralRatio >= 250 ? 'bg-success' :
                    collateralRatio >= 200 ? 'bg-accent' :
                    collateralRatio >= 150 ? 'bg-warning' :
                    'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, (collateralRatio / 300) * 100)}%` }}
                />
              </div>
            </div>

            {/* Position Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  Available to Withdraw
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Max BTC you can withdraw while maintaining 150% ratio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-lg font-semibold text-success">{availableToWithdraw.toFixed(4)} BTC</p>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
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
                </div>
                <p className="text-lg font-semibold text-destructive">
                  {hasActivePosition ? `$${liquidationPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$0'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onAddCollateral}
                size="lg"
                className="flex-1 min-w-[120px] h-11 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:scale-[1.02] active:scale-[0.98] font-semibold transition-all"
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Add Collateral
              </Button>
              
              <Button
                onClick={onWithdraw}
                variant="outline"
                size="lg"
                disabled={availableToWithdraw <= 0}
                className="flex-1 min-w-[120px] h-11 border-border hover:border-accent/50 hover:bg-accent/10 transition-all"
              >
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              
              <Button
                onClick={onClose}
                size="lg"
                disabled={borrowed <= 0}
                className="flex-1 min-w-[120px] h-11 bg-gradient-to-r from-secondary/80 to-secondary text-secondary-foreground hover:opacity-90 shadow-[0_0_15px_hsl(var(--secondary)/0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Repay & Close
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
