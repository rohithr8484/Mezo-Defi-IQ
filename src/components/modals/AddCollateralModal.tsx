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
import { useAccount, useBalance } from 'wagmi';
import { AlertTriangle, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddCollateralModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  btcPrice: number;
}

export const AddCollateralModal = ({
  open,
  onClose,
  onConfirm,
  btcPrice,
}: AddCollateralModalProps) => {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [amount, setAmount] = useState('');

  const walletBalance = balance ? parseFloat(balance.formatted) : 0;
  const inputAmount = parseFloat(amount) || 0;
  const insufficientBalance = inputAmount > walletBalance;

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (value > 0 && !insufficientBalance) {
      onConfirm(value);
      setAmount('');
      onClose();
    }
  };

  const handleMax = () => {
    if (walletBalance > 0) {
      setAmount(walletBalance.toFixed(8));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add Collateral
          </DialogTitle>
          <DialogDescription>
            Increase your collateral to improve your position's health ratio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isConnected ? (
            <Alert variant="destructive">
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to add collateral
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Your wallet balance</p>
                <p className="text-lg font-semibold">{walletBalance.toFixed(8)} BTC</p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${(walletBalance * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="add-amount">Amount (BTC)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMax}
                    className="h-auto p-1 text-xs"
                    disabled={walletBalance <= 0}
                  >
                    MAX
                  </Button>
                </div>
                <Input
                  id="add-amount"
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
                {insufficientBalance && inputAmount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Insufficient balance
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
              disabled={!isConnected || !amount || inputAmount <= 0 || insufficientBalance || walletBalance <= 0}
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
