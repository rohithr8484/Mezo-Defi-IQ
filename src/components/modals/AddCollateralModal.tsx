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
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      onConfirm(value);
      setAmount('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collateral</DialogTitle>
          <DialogDescription>
            Increase your collateral to improve your position's health ratio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="add-amount">Amount (BTC)</Label>
            <Input
              id="add-amount"
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

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) <= 0}
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
