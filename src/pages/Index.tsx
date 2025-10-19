import { useState, useEffect } from 'react';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { PositionCard } from '@/components/dashboard/PositionCard';
import { BorrowCard } from '@/components/dashboard/BorrowCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SwapCard } from '@/components/dex/SwapCard';
import { PythFeedCard } from '@/components/pyth/PythFeedCard';
import { AddCollateralModal } from '@/components/modals/AddCollateralModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { getBTCPrice } from '@/lib/pyth';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Bitcoin, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { isConnected } = useAccount();
  const [btcPrice, setBtcPrice] = useState(98000);
  const [priceData, setPriceData] = useState<{ price: number; timestamp: number; conf: number } | null>(null);
  const [collateral, setCollateral] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [addCollateralOpen, setAddCollateralOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getBTCPrice();
      if (price) {
        setBtcPrice(price.price);
        setPriceData({
          price: price.price,
          timestamp: price.timestamp,
          conf: price.conf,
        });
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Update every 10 seconds

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
    <div className="min-h-screen bg-[var(--gradient-hero)]">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Bitcoin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Mezo DeFi
                </h1>
                <p className="text-xs text-muted-foreground">Bitcoin-Backed Stablecoin Protocol</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!isConnected && (
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Unlock Bitcoin's
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {' '}Full Potential
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Borrow MUSD against your Bitcoin at 1% fixed rates. Maintain full control, 
                add collateral anytime, and deploy across DeFi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20">
                <TrendingUp className="h-10 w-10 text-primary mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">1% Fixed Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Predictable borrowing costs with no variable rates
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20">
                <Shield className="h-10 w-10 text-accent mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Full Control</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your position, add or withdraw collateral anytime
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20">
                <Zap className="h-10 w-10 text-success mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">DeFi Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy MUSD across DeFi to earn yield and cover costs
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pyth Feed Display */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PythFeedCard 
            price={priceData?.price || btcPrice} 
            timestamp={priceData?.timestamp}
            conf={priceData?.conf}
          />
        </div>
      </section>

      {/* Dashboard */}
      {isConnected && (
        <section className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <StatsCard
              btcPrice={btcPrice}
              totalCollateral={collateral}
              totalBorrowed={borrowed}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PositionCard
                collateral={collateral}
                borrowed={borrowed}
                btcPrice={btcPrice}
                onAddCollateral={() => setAddCollateralOpen(true)}
                onWithdraw={() => setWithdrawOpen(true)}
                onClose={handleClosePosition}
              />

              <BorrowCard btcPrice={btcPrice} onBorrow={handleBorrow} />
            </div>

            {/* Tigris DEX Swap */}
            <div className="mt-6">
              <SwapCard />
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
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
    </div>
  );
};

export default Index;
