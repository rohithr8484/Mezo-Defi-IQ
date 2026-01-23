import { PageLayout } from '@/components/layout/PageLayout';
import { LiquidityPoolsCard } from '@/components/liquidity/LiquidityPoolsCard';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';

const Liquidity = () => {
  const { isConnected } = useAccount();

  return (
    <PageLayout>
      <section className="bg-[hsl(var(--section-light))] py-8 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground max-w-md">
                Please connect your wallet to access liquidity pools and start earning rewards.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  💧 Liquidity Pools
                </h2>
                <p className="text-muted-foreground">
                  Provide liquidity, stake LP tokens, and earn rewards
                </p>
              </div>

              <div className="animate-fade-in max-w-5xl mx-auto">
                <LiquidityPoolsCard />
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Liquidity;
