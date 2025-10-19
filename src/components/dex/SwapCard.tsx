import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, Settings, Loader2, CheckCircle2 } from 'lucide-react';
import { TIGRIS_CONTRACTS, ROUTER_ABI, TOKENS, TOKEN_DECIMALS, type TokenSymbol } from '@/lib/tigris';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { useSwapQuote } from '@/hooks/useSwapQuote';

const AVAILABLE_TOKENS: TokenSymbol[] = ['BTC', 'MUSD', 'mUSDC', 'mUSDT'];

export const SwapCard = () => {
  const { address, chain } = useAccount();
  const [fromToken, setFromToken] = useState<TokenSymbol>('BTC');
  const [toToken, setToToken] = useState<TokenSymbol>('MUSD');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [swapStep, setSwapStep] = useState<'input' | 'approve' | 'swap'>('input');

  const { writeContract: swap, data: swapHash, isPending: isSwapping } = useWriteContract();
  
  const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  // Get quote for swap
const { amountOut, isLoading: isQuoteLoading } = useSwapQuote(
    fromToken,
    toToken,
    fromAmount
  );

  // Token approval hook
const amountInWei = fromAmount && Number(fromAmount) > 0 
    ? parseUnits(fromAmount, TOKEN_DECIMALS[fromToken]) 
    : 0n;

  const fromTokenAddress = TOKENS[fromToken] as `0x${string}`;
  const routerAddress = TIGRIS_CONTRACTS.router as `0x${string}`;

  const {
    approve,
    needsApproval,
    isApproving,
    isApproved,
  } = useTokenApproval(
    fromTokenAddress,
    routerAddress,
    amountInWei,
    address
  );

  useEffect(() => {
    if (isApproved && swapStep === 'approve') {
      setSwapStep('swap');
      toast.success('Approval confirmed!', {
        description: 'You can now complete the swap',
      });
    }
  }, [isApproved, swapStep]);

  useEffect(() => {
    if (isSwapSuccess) {
      toast.success('Swap successful!', {
        description: `Swapped ${fromAmount} ${fromToken} for ${toToken}`,
      });
      setFromAmount('');
      setSwapStep('input');
    }
  }, [isSwapSuccess, fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setSwapStep('input');
  };

  const handleSwap = async () => {
    if (!address || !fromAmount || Number(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Step 1: Check if approval is needed
    if (needsApproval && swapStep === 'input') {
      setSwapStep('approve');
      const approved = await approve();
      if (!approved) {
        setSwapStep('input');
      }
      return;
    }

    // Step 2: Execute swap
    try {
      const amountInBigInt = parseUnits(fromAmount, TOKEN_DECIMALS[fromToken]);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200); // 20 minutes
      
      // Calculate minimum output with slippage
      const slippageMultiplier = BigInt(Math.floor((100 - Number(slippage)) * 100));
      const amountOutMin = amountOut > 0n 
        ? (amountOut * slippageMultiplier) / 10000n
        : 0n;

      const path = [fromTokenAddress, TOKENS[toToken] as `0x${string}`];

      await swap({
        address: routerAddress,
        abi: ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [amountInBigInt, amountOutMin, path, address, deadline],
        account: address,
        chain,
      });

      toast.success('Swap initiated!', {
        description: 'Please confirm the transaction in your wallet',
      });
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Swap failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      setSwapStep('input');
    }
  };

  const getButtonText = () => {
    if (!address) return 'Connect Wallet';
    if (!fromAmount || Number(fromAmount) <= 0) return 'Enter Amount';
    if (isApproving) return 'Approving...';
    if (needsApproval && swapStep === 'input') return `Approve ${fromToken}`;
    if (isSwapping || isSwapConfirming) return 'Swapping...';
    return 'Swap';
  };

  const isButtonDisabled = 
    !address || 
    !fromAmount || 
    Number(fromAmount) <= 0 ||
    isApproving ||
    isSwapping ||
    isSwapConfirming;

  const formattedAmountOut = amountOut > 0n 
    ? formatUnits(amountOut, TOKEN_DECIMALS[toToken]) 
    : '0';

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20 hover-glow card-hover animate-fade-in [animation-delay:200ms]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Swap</h2>
        <Button variant="ghost" size="sm" className="hover-lift">
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
              onChange={(e) => {
                setFromAmount(e.target.value);
                setSwapStep('input');
              }}
              className="flex-1"
              disabled={isApproving || isSwapping || isSwapConfirming}
            />
            <Select 
              value={fromToken} 
              onValueChange={(val) => {
                setFromToken(val as TokenSymbol);
                setSwapStep('input');
              }}
              disabled={isApproving || isSwapping || isSwapConfirming}
            >
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
            className="rounded-full hover-lift hover:rotate-180 transition-all duration-500"
            disabled={isApproving || isSwapping || isSwapConfirming}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">To (estimated)</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0.0"
              value={isQuoteLoading ? 'Loading...' : formattedAmountOut}
              disabled
              className="flex-1"
            />
            <Select 
              value={toToken} 
              onValueChange={(val) => {
                setToToken(val as TokenSymbol);
                setSwapStep('input');
              }}
              disabled={isApproving || isSwapping || isSwapConfirming}
            >
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
                disabled={isApproving || isSwapping || isSwapConfirming}
              >
                {val}%
              </Button>
            ))}
          </div>
        </div>

        {/* Swap Progress */}
        {(isApproving || isApproved || isSwapping || isSwapConfirming) && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2 animate-slide-in-right">
            <div className="flex items-center justify-between text-sm">
              <span>1. Token Approval</span>
              {isApproved ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-scale-in" />
              ) : isApproving ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <div className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>2. Execute Swap</span>
              {isSwapSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-scale-in" />
              ) : isSwapping || isSwapConfirming ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <div className="h-4 w-4" />
              )}
            </div>
          </div>
        )}

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
          {amountOut > 0n && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="text-xs">{'<0.1%'}</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleSwap}
          className="w-full hover-lift hover-glow"
          size="lg"
          disabled={isButtonDisabled}
        >
          {(isApproving || isSwapping || isSwapConfirming) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {getButtonText()}
        </Button>
      </div>
    </Card>
  );
};
