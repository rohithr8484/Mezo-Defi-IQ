// Trading & Arbitrage
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, Settings, Loader2, CheckCircle2, Zap, Info, RefreshCw } from 'lucide-react';
import { TIGRIS_CONTRACTS, ROUTER_ABI, TOKENS, TOKEN_DECIMALS, type TokenSymbol } from '@/lib/tigris';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';
import { useTokenApproval } from '@/hooks/useTokenApproval';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import musdLogo from '@/assets/tokens/musd-logo.png';
import btcLogo from '@/assets/tokens/btc-logo.png';
import musdcLogo from '@/assets/tokens/musdc-logo.png';
import musdtLogo from '@/assets/tokens/musdt-logo.png';

const AVAILABLE_TOKENS: TokenSymbol[] = ['BTC', 'MUSD', 'mUSDC', 'mUSDT'];

const TOKEN_LOGOS: Record<TokenSymbol, string> = {
  BTC: btcLogo,
  MUSD: musdLogo,
  mUSDC: musdcLogo,
  mUSDT: musdtLogo,
};

export const SwapCard = () => {
  const { address, chain } = useAccount();
  const [fromToken, setFromToken] = useState<TokenSymbol>('BTC');
  const [toToken, setToToken] = useState<TokenSymbol>('MUSD');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [swapStep, setSwapStep] = useState<'input' | 'approve' | 'swap'>('input');
  const [showSettings, setShowSettings] = useState(false);

  const { writeContract: swap, data: swapHash, isPending: isSwapping } = useWriteContract();
  
  const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  const { amountOut, isLoading: isQuoteLoading } = useSwapQuote(
    fromToken,
    toToken,
    fromAmount
  );

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

    if (needsApproval && swapStep === 'input') {
      setSwapStep('approve');
      const approved = await approve();
      if (!approved) {
        setSwapStep('input');
      }
      return;
    }

    try {
      const amountInBigInt = parseUnits(fromAmount, TOKEN_DECIMALS[fromToken]);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
      
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

  const exchangeRate = fromAmount && Number(fromAmount) > 0 && amountOut > 0n
    ? (Number(formattedAmountOut) / Number(fromAmount)).toFixed(4)
    : null;

  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift animate-fade-in [animation-delay:200ms] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg icon-container">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text-accent">Swap</h2>
              <p className="text-xs text-muted-foreground">Tigris DEX</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="stat-badge">
              <Zap className="h-3 w-3 inline mr-1" />
              Instant
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover-lift h-8 w-8 p-0"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className={`h-4 w-4 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                Slippage Tolerance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum price change you're willing to accept</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <div className="flex gap-1.5">
                {['0.1', '0.5', '1.0', '3.0'].map((val) => (
                  <Button
                    key={val}
                    variant={slippage === val ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSlippage(val)}
                    className={`h-8 px-3 text-xs ${slippage === val ? 'shadow-lg' : ''}`}
                    disabled={isApproving || isSwapping || isSwapConfirming}
                  >
                    {val}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">You Pay</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => {
                    setFromAmount(e.target.value);
                    setSwapStep('input');
                  }}
                  className="pr-4 text-lg h-14 input-enhanced"
                  disabled={isApproving || isSwapping || isSwapConfirming}
                />
              </div>
              <Select 
                value={fromToken} 
                onValueChange={(val) => {
                  setFromToken(val as TokenSymbol);
                  setSwapStep('input');
                }}
                disabled={isApproving || isSwapping || isSwapConfirming}
              >
                <SelectTrigger className="w-36 h-14 bg-muted/50 border-border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <img src={TOKEN_LOGOS[fromToken]} alt={fromToken} className="h-6 w-6 rounded-full" />
                      <span className="font-medium">{fromToken}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TOKENS.filter(t => t !== toToken).map((token) => (
                    <SelectItem key={token} value={token}>
                      <div className="flex items-center gap-2">
                        <img src={TOKEN_LOGOS[token]} alt={token} className="h-5 w-5 rounded-full" />
                        <span>{token}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapTokens}
              className="rounded-full h-10 w-10 p-0 border-2 border-border bg-card hover:bg-primary/10 hover:border-primary/50 hover:rotate-180 transition-all duration-500 shadow-lg"
              disabled={isApproving || isSwapping || isSwapConfirming}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">You Receive</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="0.0"
                  value={isQuoteLoading ? '' : formattedAmountOut}
                  disabled
                  className="text-lg h-14 bg-muted/30"
                />
                {isQuoteLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <Select 
                value={toToken} 
                onValueChange={(val) => {
                  setToToken(val as TokenSymbol);
                  setSwapStep('input');
                }}
                disabled={isApproving || isSwapping || isSwapConfirming}
              >
                <SelectTrigger className="w-36 h-14 bg-muted/50 border-border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <img src={TOKEN_LOGOS[toToken]} alt={toToken} className="h-6 w-6 rounded-full" />
                      <span className="font-medium">{toToken}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TOKENS.filter(t => t !== fromToken).map((token) => (
                    <SelectItem key={token} value={token}>
                      <div className="flex items-center gap-2">
                        <img src={TOKEN_LOGOS[token]} alt={token} className="h-5 w-5 rounded-full" />
                        <span>{token}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Progress */}
          {(isApproving || isApproved || isSwapping || isSwapConfirming) && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3 animate-scale-in">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isApproved ? 'bg-success/20' : 'bg-primary/20'}`}>
                    {isApproved ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <span className="text-xs text-muted-foreground">1</span>
                    )}
                  </div>
                  <span className={isApproved ? 'text-success' : ''}>Token Approval</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSwapSuccess ? 'bg-success/20' : 'bg-muted'}`}>
                    {isSwapSuccess ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : isSwapping || isSwapConfirming ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <span className="text-xs text-muted-foreground">2</span>
                    )}
                  </div>
                  <span className={isSwapSuccess ? 'text-success' : ''}>Execute Swap</span>
                </div>
              </div>
            </div>
          )}

          {/* Trade Info */}
          <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-2.5 text-sm">
            {exchangeRate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rate</span>
                <span className="font-medium">1 {fromToken} = {exchangeRate} {toToken}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-medium">{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DEX</span>
              <span className="font-medium text-accent">Tigris</span>
            </div>
            {amountOut > 0n && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Impact</span>
                <span className="text-success font-medium">{'<0.1%'}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSwap}
            className="w-full h-12 text-base"
            variant="hero"
            size="lg"
            disabled={isButtonDisabled}
          >
            {(isApproving || isSwapping || isSwapConfirming) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getButtonText()}
          </Button>
        </div>
      </div>
    </Card>
  );
};
