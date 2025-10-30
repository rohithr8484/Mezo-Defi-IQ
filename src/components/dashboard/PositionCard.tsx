// Trading & Arbitrage
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, XCircle } from 'lucide-react';

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
  const availableToWithdraw = Math.max(0, collateral - (borrowed / btcPrice) * 1.5); // 150% min ratio

  const getRatioColor = (ratio: number) => {
    if (ratio >= 200) return 'text-success';
    if (ratio >= 150) return 'text-accent';
    return 'text-destructive';
  };

  const minimumCollateralRequired = borrowed > 0 ? (borrowed / btcPrice) * 1.5 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-[var(--shadow-card)] hover-lift">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 gradient-text">
            Collateral MUSD
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Collateral</p>
              <p className="text-2xl font-bold">{collateral.toFixed(4)} BTC</p>
              <p className="text-sm text-muted-foreground">${collateralValue.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Borrowed</p>
              <p className="text-2xl font-bold">{borrowed.toLocaleString()} MUSD</p>
              <p className="text-sm text-muted-foreground">1% fixed rate</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Collateral Ratio</p>
              <p className={`text-2xl font-bold ${getRatioColor(collateralRatio)}`}>
                {collateralRatio.toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">
                Min: 150%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collateral > 0 && (
              <div className="p-4 rounded-lg bg-muted/50 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Available to withdraw</p>
                <p className="text-lg font-semibold text-success">{availableToWithdraw.toFixed(4)} BTC</p>
              </div>
            )}
            
            {borrowed > 0 && (
              <div className="p-4 rounded-lg bg-muted/50 border border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Min. Collateral Required</p>
                <p className="text-lg font-semibold text-accent">{minimumCollateralRequired.toFixed(4)} BTC</p>
                <p className="text-xs text-muted-foreground mt-1">${(minimumCollateralRequired * btcPrice).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAddCollateral}
            variant="default"
            size="lg"
            className="flex-1 min-w-[140px]"
          >
            <ArrowUpCircle className="mr-2 h-5 w-5" />
            Add Collateral
          </Button>
          
          <Button
            onClick={onWithdraw}
            variant="outline"
            size="lg"
            disabled={availableToWithdraw <= 0}
            className="flex-1 min-w-[140px]"
          >
            <ArrowDownCircle className="mr-2 h-5 w-5" />
            Withdraw
          </Button>
          
          <Button
            onClick={onClose}
            variant="destructive"
            size="lg"
            disabled={borrowed <= 0}
            className="flex-1 min-w-[140px]"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Close Position
          </Button>
        </div>
      </div>
    </Card>
  );
};
