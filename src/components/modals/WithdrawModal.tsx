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
import { useAccount } from 'wagmi';
import { AlertTriangle, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  const inputAmount = parseFloat(amount) || 0;
  const exceedsMax = inputAmount > maxWithdraw;

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (value > 0 && value <= maxWithdraw) {
      onConfirm(value);
      setAmount('');
      onClose();
    }
  };

  const handleMax = () => {
    if (maxWithdraw > 0) {
      setAmount(maxWithdraw.toFixed(8));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Withdraw Collateral
          </DialogTitle>
          <DialogDescription>
            Withdraw collateral while maintaining a safe collateral ratio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isConnected ? (
            <Alert variant="destructive">
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to withdraw collateral
              </AlertDescription>
            </Alert>
          ) : maxWithdraw <= 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No collateral available to withdraw. Add collateral first or ensure your position maintains the minimum 150% ratio.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Available to withdraw</p>
                <p className="text-lg font-semibold">{maxWithdraw.toFixed(8)} BTC</p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(maxWithdraw * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="withdraw-amount">Amount (BTC)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMax}
                    className="h-auto p-1 text-xs"
                    disabled={maxWithdraw <= 0}
                  >
                    MAX
                  </Button>
                </div>
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {amount && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(inputAmount * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                )}
                {exceedsMax && inputAmount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Amount exceeds available balance
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isConnected || !amount || inputAmount <= 0 || exceedsMax || maxWithdraw <= 0}
              className="flex-1"
            >
              {!isConnected ? 'Connect Wallet' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
