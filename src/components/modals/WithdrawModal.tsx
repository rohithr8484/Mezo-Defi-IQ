// Trading & Arbitrage
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  maxWithdraw: number;
  btcPrice: number;
}

export const WithdrawModal = ({
  open,
  onClose,
  onConfirm,
  maxWithdraw,
  btcPrice,
}: WithdrawModalProps) => {
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (value > 0 && value <= maxWithdraw) {
      onConfirm(value);
      setAmount('');
      onClose();
    }
  };

  const handleMax = () => {
    setAmount(maxWithdraw.toFixed(4));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Collateral</DialogTitle>
          <DialogDescription>
            Withdraw collateral while maintaining a safe collateral ratio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="withdraw-amount">Amount (BTC)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMax}
                className="h-auto p-1 text-xs"
              >
                MAX
              </Button>
            </div>
            <Input
              id="withdraw-amount"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && (
              <p className="text-sm text-muted-foreground">
                ≈ ${(parseFloat(amount) * btcPrice).toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
            <p className="text-lg font-semibold">{maxWithdraw.toFixed(4)} BTC</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdraw}
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
