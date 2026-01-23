// Trading & Arbitrage
import { useState, useEffect } from 'react';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { MUSDLoanCard } from '@/components/dashboard/MUSDLoanCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { SwapCard } from '@/components/dex/SwapCard';
import { LiquidityPoolsCard } from '@/components/liquidity/LiquidityPoolsCard';
import { PythFeedCard } from '@/components/pyth/PythFeedCard';
import { ArbitrageMonitor } from '@/components/arbitrage/ArbitrageMonitor';
import { AddCollateralModal } from '@/components/modals/AddCollateralModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { FAQSection } from '@/components/faq/FAQSection';

import { getBTCPrice } from '@/lib/pyth';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { Bitcoin, TrendingUp, Shield, Zap, Wallet, DollarSign, ArrowLeftRight, Activity, Bot, RefreshCw, CreditCard, CheckCircle, RotateCcw, Droplets } from 'lucide-react';
import mezoLogo from '@/assets/mezo-logo.png';

const Index = () => {
  const { isConnected } = useAccount();
  const [btcPrice, setBtcPrice] = useState(98000);
  const [priceData, setPriceData] = useState<{ price: number; timestamp: number; conf: number } | null>(null);
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

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const response = await fetch('https://mainnet.mezo.validationcloud.io/v1/p_xemd5HnZI0yCNZwH_bjpShkEgurvMTlN9xPATAId0', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    const interval = setInterval(fetchBlockHeight, 15000); // Update every 15 seconds

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
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float morph-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float morph-blob [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[hsl(var(--navbar))] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow flex items-center justify-center shadow-[var(--shadow-glow)] hover-glow p-1 glow-pulse">
                <img src={mezoLogo} alt="Mezo DeFi" className="h-full w-full object-contain animate-float" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--navbar-foreground))]">
                  Mezo DeFi
                </h1>
                <p className="text-xs text-[hsl(var(--navbar-foreground)/0.7)]">Bitcoin-Backed Stablecoin Protocol</p>
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
        <section className="bg-[hsl(var(--section-light))] py-20">
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4 slide-up-fade">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight text-glow">
                  Unlock Bitcoin's
                  <span className="gradient-text animate-shimmer bg-[length:200%_auto] inline-block">
                    {' '}Full Potential
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto slide-up-fade stagger-1">
                  Borrow MUSD against your Bitcoin at 1% fixed rates. Maintain full control, 
                  add collateral anytime, and deploy across DeFi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/20 hover-lift card-hover slide-up-fade stagger-2 gradient-border group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <TrendingUp className="h-10 w-10 text-primary mb-3 mx-auto animate-float relative z-10" />
                  <h3 className="font-semibold mb-2 relative z-10">1% Fixed Rate</h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    Predictable borrowing costs with no variable rates
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-accent/20 hover-lift card-hover slide-up-fade stagger-3 gradient-border group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Shield className="h-10 w-10 text-accent mb-3 mx-auto animate-float [animation-delay:200ms] relative z-10" />
                  <h3 className="font-semibold mb-2 relative z-10">Full Control</h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    Manage your position, add or withdraw collateral anytime
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-card/50 backdrop-blur border border-success/20 hover-lift card-hover slide-up-fade stagger-4 gradient-border group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Zap className="h-10 w-10 text-success mb-3 mx-auto animate-float [animation-delay:400ms] relative z-10" />
                  <h3 className="font-semibold mb-2 relative z-10">DeFi Ready</h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    Deploy MUSD across DeFi to earn yield and cover costs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="bg-[hsl(var(--section-alt))] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 slide-up-fade">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text animate-shimmer bg-[length:200%_auto]">
                ⚙️ How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started with Mezo DeFi
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {/* Step 1 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    1
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float">
                    <Bitcoin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Deposit BTC</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Lock BTC as collateral
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    2
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:100ms]">
                    <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Choose Amount</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Set MUSD with LTV
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    3
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:200ms]">
                    <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Mint MUSD</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Receive stablecoins
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    4
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:300ms]">
                    <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Loan Active</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Monitor health ratio
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    5
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:400ms]">
                    <RotateCcw className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Repay Loan</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Pay MUSD + fees
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg md:text-xl font-bold text-primary group-hover:scale-110 transition-transform glow-pulse">
                    6
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:500ms]">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Withdraw BTC</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Collateral returned
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 7 - Add Liquidity */}
              <div className="p-4 md:p-5 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-5 relative overflow-hidden col-span-2 sm:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center text-lg md:text-xl font-bold text-secondary group-hover:scale-110 transition-transform glow-pulse">
                    7
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow animate-float [animation-delay:600ms]">
                    <Droplets className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Add Liquidity</h3>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Earn LP rewards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-[hsl(var(--section-light))] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 slide-up-fade">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text animate-shimmer bg-[length:200%_auto]">
                💡 Use Cases
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real financial services for everyday needs - no crypto knowledge required
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Use Case 1 */}
              <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow glow-pulse">
                    <TrendingUp className="h-7 w-7 text-primary animate-float" />
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
              <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow glow-pulse">
                    <Bot className="h-7 w-7 text-accent animate-float [animation-delay:200ms]" />
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
              <div className="p-8 rounded-xl bg-card/50 backdrop-blur border border-border hover-lift card-hover group gradient-border slide-up-fade stagger-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow glow-pulse">
                    <RefreshCw className="h-7 w-7 text-success animate-float [animation-delay:400ms]" />
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
        </div>
      </section>


      {/* Dashboard */}
      {isConnected && (
        <section className="bg-[hsl(var(--section-alt))] py-8">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              <div className="animate-fade-in">
                <StatsCard
                  btcPrice={btcPrice}
                  totalCollateral={collateral}
                  totalBorrowed={borrowed}
                  blockHeight={blockHeight}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in [animation-delay:200ms]">
                {/* Tigris DEX Swap - Now First */}
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

              {/* Liquidity Pools Section */}
              <div className="animate-fade-in [animation-delay:400ms]">
                <LiquidityPoolsCard />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Analytics Section - Pyth Feed & Arbitrage Monitor */}
      <section className="bg-[hsl(var(--section-light))] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-10 slide-up-fade">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text animate-shimmer bg-[length:200%_auto]">
              📊 Analytics & Price Feeds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time market data and arbitrage opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="animate-scale-in">
              <PythFeedCard 
                price={priceData?.price || btcPrice} 
                timestamp={priceData?.timestamp}
                conf={priceData?.conf}
              />
            </div>
            <div className="animate-scale-in [animation-delay:150ms]">
              <ArbitrageMonitor />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

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
