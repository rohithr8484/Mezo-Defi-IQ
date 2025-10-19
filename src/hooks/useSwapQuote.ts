import { useReadContract } from 'wagmi';
import { TIGRIS_CONTRACTS, ROUTER_ABI, TOKENS } from '@/lib/tigris';
import { parseUnits } from 'viem';
import { useEffect } from 'react';

export function useSwapQuote(
  fromToken: string,
  toToken: string,
  amountIn: string
) {
  const fromAddress = TOKENS[fromToken as keyof typeof TOKENS];
  const toAddress = TOKENS[toToken as keyof typeof TOKENS];

  const amountInWei = amountIn && Number(amountIn) > 0 
    ? parseUnits(amountIn, 18)
    : 0n;

  const { data: amounts, isLoading, refetch } = useReadContract({
    address: TIGRIS_CONTRACTS.router as `0x${string}`,
    abi: ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: amountInWei > 0n && fromAddress && toAddress 
      ? [amountInWei, [fromAddress, toAddress]] 
      : undefined,
    query: {
      enabled: amountInWei > 0n && !!fromAddress && !!toAddress,
    },
  });

  useEffect(() => {
    if (amountInWei > 0n && fromAddress && toAddress) {
      const interval = setInterval(() => {
        refetch();
      }, 10000); // Refresh quote every 10 seconds

      return () => clearInterval(interval);
    }
  }, [amountInWei, fromAddress, toAddress, refetch]);

  const amountOut = amounts && Array.isArray(amounts) && amounts.length > 1 
    ? amounts[1] 
    : 0n;

  return {
    amountOut,
    isLoading,
    refetch,
  };
}
