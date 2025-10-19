import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { ERC20_ABI } from '@/lib/tigris';
import { toast } from 'sonner';

export function useTokenApproval(
  tokenAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
  amount: bigint,
  userAddress?: `0x${string}`
) {
  const { chain } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Check current allowance
  const enabled = Boolean(userAddress && spenderAddress && amount > 0n);
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: enabled ? [userAddress as `0x${string}`, spenderAddress] : undefined,
    query: { enabled },
  });

  // Wait for approval transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const needsApproval = () => {
    if (!allowance || !amount) return false;
    return (allowance as bigint) < amount;
  };

  const approve = async () => {
    if (!needsApproval()) return true;

    try {
      await writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, amount],
        account: userAddress,
        chain,
      });

      toast.success('Approval requested', {
        description: 'Please confirm the transaction in your wallet',
      });

      return true;
    } catch (error) {
      toast.error('Approval failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
      return false;
    }
  };

  return {
    approve,
    needsApproval: needsApproval(),
    isApproving: isPending || isConfirming,
    isApproved: isConfirmed,
    allowance,
    refetchAllowance,
    error,
  };
}
