import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, Settings } from 'lucide-react';
import { TIGRIS_CONTRACTS, ROUTER_ABI, ERC20_ABI, type TokenSymbol } from '@/lib/tigris';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';

const AVAILABLE_TOKENS: TokenSymbol[] = ['MUSD', 'BTC', 'mUSDC', 'mUSDT'];

export const SwapCard = () => {
  const { address, chain } = useAccount();
  const [fromToken, setFromToken] = useState<TokenSymbol>('BTC');
  const [toToken, setToToken] = useState<TokenSymbol>('MUSD');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const { writeContract } = useWriteContract();

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
  };

  const handleSwap = async () => {
    if (!address || !fromAmount) {
      toast.error('Please enter an amount');
      return;
    }

    try {
      const amountIn = parseUnits(fromAmount, 18);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200); // 20 minutes
      const slippageMultiplier = BigInt(Math.floor((100 - Number(slippage)) * 100));
      const amountOutMin = (amountIn * slippageMultiplier) / 10000n;

      // Note: Path needs actual token addresses - placeholder for now
      const path = [fromToken, toToken]; // Replace with actual addresses

      await writeContract({
        address: TIGRIS_CONTRACTS.router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, path as any, address, deadline],
        account: address,
        chain,
      });

      toast.success('Swap initiated!', {
        description: `Swapping ${fromAmount} ${fromToken} for ${toToken}`,
      });
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Swap failed', {
        description: 'Please try again',
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Swap</h2>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">From</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
            />
            <Select value={fromToken} onValueChange={(val) => setFromToken(val as TokenSymbol)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TOKENS.filter(t => t !== toToken).map((token) => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapTokens}
            className="rounded-full"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">To</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              disabled
              className="flex-1"
            />
            <Select value={toToken} onValueChange={(val) => setToToken(val as TokenSymbol)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TOKENS.filter(t => t !== fromToken).map((token) => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Slippage Tolerance</span>
          <div className="flex gap-2">
            {['0.1', '0.5', '1.0'].map((val) => (
              <Button
                key={val}
                variant={slippage === val ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSlippage(val)}
                className="h-7 px-2 text-xs"
              >
                {val}%
              </Button>
            ))}
          </div>
        </div>

        {/* Pool Info */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Router</span>
            <span className="font-mono text-xs">
              {TIGRIS_CONTRACTS.router.slice(0, 6)}...{TIGRIS_CONTRACTS.router.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DEX</span>
            <span>Tigris (Aerodrome-style AMM)</span>
          </div>
        </div>

        <Button
          onClick={handleSwap}
          className="w-full"
          size="lg"
          disabled={!fromAmount || !address}
        >
          Swap
        </Button>
      </div>
    </Card>
  );
};
