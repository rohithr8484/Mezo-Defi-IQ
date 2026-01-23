import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MUSDLoanCard } from '@/components/dashboard/MUSDLoanCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SwapCard } from '@/components/dex/SwapCard';
import { AddCollateralModal } from '@/components/modals/AddCollateralModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { getBTCPrice } from '@/lib/pyth';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Wallet } from 'lucide-react';

const Dashboard = () => {
  const { isConnected } = useAccount();
  const [btcPrice, setBtcPrice] = useState(98000);
  const [blockHeight, setBlockHeight] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [addCollateralOpen, setAddCollateralOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getBTCPrice();
      if (price) {
        setBtcPrice(price.price);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const response = await fetch('https://mainnet.mezo.validationcloud.io/v1/p_xemd5HnZI0yCNZwH_bjpShkEgurvMTlN9xPATAId0', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: [],
          }),
        });

        const data = await response.json();
        if (data.result) {
          setBlockHeight(parseInt(data.result, 16));
        }
      } catch (error) {
        console.error('Error fetching block height:', error);
      }
    };

    fetchBlockHeight();
    const interval = setInterval(fetchBlockHeight, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBorrow = (collateralAmount: number, borrowAmount: number) => {
    setCollateral(prev => prev + collateralAmount);
    setBorrowed(prev => prev + borrowAmount);
    toast.success('Successfully minted MUSD!', {
      description: `Added ${collateralAmount} BTC collateral and borrowed ${borrowAmount} MUSD`,
    });
  };

  const handleAddCollateral = (amount: number) => {
    setCollateral(prev => prev + amount);
    toast.success('Collateral added successfully!', {
      description: `Added ${amount} BTC to your position`,
    });
  };

  const handleWithdraw = (amount: number) => {
    setCollateral(prev => prev - amount);
    toast.success('Withdrawal successful!', {
      description: `Withdrew ${amount} BTC from your position`,
    });
  };

  const handleClosePosition = () => {
    setCollateral(0);
    setBorrowed(0);
    toast.success('Position closed successfully!');
  };

  const maxWithdraw = Math.max(0, collateral - (borrowed / btcPrice) * 1.5);

  return (
    <PageLayout>
      <section className="bg-[hsl(var(--section-light))] py-8 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground max-w-md">
                Please connect your wallet to access the dashboard and manage your positions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                  📊 Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Manage your positions, swap tokens, and borrow MUSD
                </p>
              </div>

              <div className="animate-fade-in">
                <StatsCard
                  btcPrice={btcPrice}
                  totalCollateral={collateral}
                  totalBorrowed={borrowed}
                  blockHeight={blockHeight}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in [animation-delay:200ms]">
                <SwapCard />
                
                <MUSDLoanCard
                  btcPrice={btcPrice}
                  collateral={collateral}
                  borrowed={borrowed}
                  onBorrow={handleBorrow}
                  onAddCollateral={() => setAddCollateralOpen(true)}
                  onWithdraw={() => setWithdrawOpen(true)}
                  onClose={handleClosePosition}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <AddCollateralModal
        open={addCollateralOpen}
        onClose={() => setAddCollateralOpen(false)}
        onConfirm={handleAddCollateral}
        btcPrice={btcPrice}
      />

      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={handleWithdraw}
        maxWithdraw={maxWithdraw}
        btcPrice={btcPrice}
      />
    </PageLayout>
  );
};

export default Dashboard;
