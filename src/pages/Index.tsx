import { useState, useEffect } from 'react';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { PositionCard } from '@/components/dashboard/PositionCard';
import { BorrowCard } from '@/components/dashboard/BorrowCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SwapCard } from '@/components/dex/SwapCard';
import { PythFeedCard } from '@/components/pyth/PythFeedCard';
import { ArbitrageMonitor } from '@/components/arbitrage/ArbitrageMonitor';
import { AddCollateralModal } from '@/components/modals/AddCollateralModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { getBTCPrice } from '@/lib/pyth';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Bitcoin, TrendingUp, Shield, Zap, Wallet, DollarSign, ArrowLeftRight, Activity, Bot, RefreshCw } from 'lucide-react';
import mezoLogo from '@/assets/mezo-logo.png';

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
    <div className="min-h-screen bg-[var(--gradient-hero)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float [animation-delay:1s]" />
      </div>
      
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow flex items-center justify-center shadow-[var(--shadow-glow)] hover-glow p-1">
                <img src={mezoLogo} alt="Mezo DeFi" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Mezo DeFi
                </h1>
                <p className="text-xs text-muted-foreground">Bitcoin-Backed Stablecoin Protocol</p>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!isConnected && (
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Unlock Bitcoin's
                <span className="gradient-text animate-shimmer bg-[length:200%_auto]">
                  {' '}Full Potential
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
                Borrow MUSD against your Bitcoin at 1% fixed rates. Maintain full control, 
                add collateral anytime, and deploy across DeFi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20 hover-lift card-hover animate-scale-in [animation-delay:300ms]">
                <TrendingUp className="h-10 w-10 text-primary mb-3 mx-auto animate-float" />
                <h3 className="font-semibold mb-2">1% Fixed Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Predictable borrowing costs with no variable rates
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20 hover-lift card-hover animate-scale-in [animation-delay:400ms]">
                <Shield className="h-10 w-10 text-accent mb-3 mx-auto animate-float [animation-delay:200ms]" />
                <h3 className="font-semibold mb-2">Full Control</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your position, add or withdraw collateral anytime
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20 hover-lift card-hover animate-scale-in [animation-delay:500ms]">
                <Zap className="h-10 w-10 text-success mb-3 mx-auto animate-float [animation-delay:400ms]" />
                <h3 className="font-semibold mb-2">DeFi Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy MUSD across DeFi to earn yield and cover costs
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              ⚙️ How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with Mezo DeFi - Simple financial services without the complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No Collateral MUSD</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly access MUSD without requiring collateral, enabling users to engage with the platform quickly and efficiently.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Borrow MUSD</h3>
                  <p className="text-sm text-muted-foreground">
                    Borrow MUSD for liquidity needs, DeFi strategies, or trading purposes with flexible terms and competitive rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <ArrowLeftRight className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Swap</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamlessly swap between MUSD and other supported assets directly on the platform, making transactions fast and convenient.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Arbitrage Monitor</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor cross-protocol opportunities in real time, helping advanced users identify profitable arbitrage trades automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              💡 Use Cases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real financial services for everyday needs - no crypto knowledge required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Use Case 1 */}
            <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-3">💸 DeFi & Yield Strategies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilize MUSD for multi-layered yield farming, looping strategies, and liquidity optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <Bot className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-3">🤖 Trading & Arbitrage</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor and execute arbitrage opportunities across protocols for capital efficiency.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                  <RefreshCw className="h-7 w-7 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-3">🔄 Swaps & Portfolio Management</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Quickly swap assets and manage portfolios with minimal friction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pyth Feed Display */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto animate-scale-in">
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
            <div className="animate-fade-in">
              <StatsCard
                btcPrice={btcPrice}
                totalCollateral={collateral}
                totalBorrowed={borrowed}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in [animation-delay:200ms]">
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

            {/* Arbitrage Monitor */}
            <div className="mt-6">
              <ArbitrageMonitor />
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
    </div>
  );
};

export default Index;
