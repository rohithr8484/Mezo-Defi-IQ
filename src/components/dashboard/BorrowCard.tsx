import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';

interface BorrowCardProps {
  btcPrice: number;
  onBorrow: (collateralAmount: number, borrowAmount: number) => void;
}

export const BorrowCard = ({ btcPrice, onBorrow }: BorrowCardProps) => {
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');

  const collateralValue = parseFloat(collateralAmount || '0') * btcPrice;
  const maxBorrow = collateralValue / 1.5; // 150% minimum collateral ratio
  const currentRatio = parseFloat(borrowAmount || '0') > 0 
    ? (collateralValue / parseFloat(borrowAmount || '1')) * 100 
    : 0;

  const handleMaxBorrow = () => {
    setBorrowAmount(maxBorrow.toFixed(2));
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

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-[var(--shadow-card)]">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Borrow MUSD
          </h2>
          <p className="text-muted-foreground">
            Deposit BTC collateral and mint MUSD at 1% fixed rate
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collateral">Collateral Amount (BTC)</Label>
            <Input
              id="collateral"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              className="text-lg"
            />
            {collateralAmount && (
              <p className="text-sm text-muted-foreground">
                ≈ ${collateralValue.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="borrow">Borrow Amount (MUSD)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxBorrow}
                disabled={!collateralAmount}
                className="h-auto p-1 text-xs"
              >
                MAX
              </Button>
            </div>
            <Input
              id="borrow"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="text-lg"
            />
            {borrowAmount && (
              <p className="text-sm text-muted-foreground">
                Max: ${maxBorrow.toFixed(2)}
              </p>
            )}
          </div>

          {currentRatio > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Collateral Ratio</span>
                <span className={`text-lg font-semibold ${
                  currentRatio >= 200 ? 'text-success' : 
                  currentRatio >= 150 ? 'text-accent' : 
                  'text-destructive'
                }`}>
                  {currentRatio.toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum required: 150%
              </p>
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
            className="w-full"
          >
            <Coins className="mr-2 h-5 w-5" />
            Mint MUSD
          </Button>
        </div>
      </div>
    </Card>
  );
};
