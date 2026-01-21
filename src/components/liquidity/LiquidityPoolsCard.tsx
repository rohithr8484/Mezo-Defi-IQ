import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Droplets, Plus, ArrowDownCircle, Lock, Unlock, TrendingUp, 
  ExternalLink, Info, Sparkles, Coins
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import musdLogo from '@/assets/tokens/musd-logo.png';
import btcLogo from '@/assets/tokens/btc-logo.png';
import musdcLogo from '@/assets/tokens/musdc-logo.png';
import musdtLogo from '@/assets/tokens/musdt-logo.png';

// Testnet pool addresses
const TESTNET_POOLS = [
  {
    id: 'musd-btc',
    name: 'MUSD/BTC',
    address: '0xd16A5Df82120ED8D626a1a15232bFcE2366d6AA9',
    token0: { symbol: 'MUSD', logo: musdLogo },
    token1: { symbol: 'BTC', logo: btcLogo },
    volume: 115508.03,
    fees: 13.33,
    tvl: 100769.21,
    apr: 17.93,
  },
  {
    id: 'musd-musdc',
    name: 'MUSD/mUSDC',
    address: '0x525F049A4494dA0a6c87E3C4df55f9929765Dc3e',
    token0: { symbol: 'MUSD', logo: musdLogo },
    token1: { symbol: 'mUSDC', logo: musdcLogo },
    volume: 23496.20,
    fees: 7.76,
    tvl: 15224.09,
    apr: 1.61,
  },
  {
    id: 'musd-musdt',
    name: 'MUSD/mUSDT',
    address: '0x27414B76CF00E24ed087adb56E26bAeEE93494e',
    token0: { symbol: 'MUSD', logo: musdLogo },
    token1: { symbol: 'mUSDT', logo: musdtLogo },
    volume: 9967.71,
    fees: 0.04,
    tvl: 5104.45,
    apr: 2.04,
  },
];

interface PoolActionProps {
  pool: typeof TESTNET_POOLS[0];
  activeTab: string;
}

const PoolActionPanel = ({ pool, activeTab }: PoolActionProps) => {
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [percentage, setPercentage] = useState('');

  const percentagePresets = ['25', '50', '75', '100'];

  return (
    <div className="space-y-6">
      {activeTab === 'add' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Add liquidity</h3>
            <p className="text-sm text-muted-foreground">
              Providing liquidity makes swapping possible. In return, you will receive LP tokens (LP) for the option to stake, earn from the pair's Swaps fees and mats rewards.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{pool.token0.symbol}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount0}
                  onChange={(e) => setAmount0(e.target.value)}
                  placeholder="0.00"
                  className="bg-muted/50 border-border pr-12"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0.00 {pool.token0.symbol} Available</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Max</Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{pool.token1.symbol}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  placeholder="0.00"
                  className="bg-muted/50 border-border pr-12"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0.00 {pool.token1.symbol} Available</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Max</Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90"
              disabled={!amount0 || !amount1}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add liquidity
            </Button>
            <Button variant="outline" onClick={() => { setAmount0(''); setAmount1(''); }}>
              Reset
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Withdraw</h3>
            <p className="text-sm text-muted-foreground">
              Exit your liquidity position to receive your assets and don't forget to claim your rewards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent">
              You don't have assets to withdraw. Please add liquidity to the pool.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Enter any percentage you want to withdraw</label>
            <div className="relative">
              <Input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="0"
                className="bg-muted/50 border-border pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>

            <div className="flex gap-2">
              {percentagePresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(preset)}
                  className="flex-1"
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Withdraw value</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">sAMM-{pool.name} LP amount</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token0.symbol} amount</span>
              <span>0.00 {pool.token0.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token1.symbol} amount</span>
              <span>0.00 {pool.token1.symbol}</span>
            </div>
          </div>

          <Button className="w-full" variant="outline" disabled>
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      )}

      {activeTab === 'stake' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Stake LP</h3>
            <p className="text-sm text-muted-foreground">
              Stake your LP tokens to the pool's gauge to start earning emissions. Enter the percentage of LP tokens you would like to stake.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Percentage</label>
            <div className="relative">
              <Input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="0"
                className="bg-muted/50 border-border pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>

            <div className="flex gap-2">
              {percentagePresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(preset)}
                  className="flex-1"
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stake value</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token0.symbol}</span>
              <span>0.00 {pool.token0.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token1.symbol}</span>
              <span>0.00 {pool.token1.symbol}</span>
            </div>
          </div>

          <Button className="w-full" variant="outline" disabled>
            <Lock className="h-4 w-4 mr-2" />
            Stake
          </Button>
        </div>
      )}

      {activeTab === 'unstake' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Unstake LP</h3>
            <p className="text-sm text-muted-foreground">
              Unstake your LP tokens to start earning pools fees instead of emissions. Enter the percentage of LP tokens you would like to unstake from your staked position.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent">
              You currently don't have assets that can be unstaked.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Percentage</label>
            <div className="relative">
              <Input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="0"
                className="bg-muted/50 border-border pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
            </div>

            <div className="flex gap-2">
              {percentagePresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(preset)}
                  className="flex-1"
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unstake value</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token0.symbol}</span>
              <span>0.00 {pool.token0.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{pool.token1.symbol}</span>
              <span>0.00 {pool.token1.symbol}</span>
            </div>
          </div>

          <Button className="w-full" variant="outline" disabled>
            <Unlock className="h-4 w-4 mr-2" />
            Unstake
          </Button>
        </div>
      )}
    </div>
  );
};

export const LiquidityPoolsCard = () => {
  const [selectedPool, setSelectedPool] = useState<typeof TESTNET_POOLS[0] | null>(null);
  const [activeTab, setActiveTab] = useState('add');

  // Calculate total stats
  const totalVolume = TESTNET_POOLS.reduce((sum, pool) => sum + pool.volume, 0);
  const totalFees = TESTNET_POOLS.reduce((sum, pool) => sum + pool.fees, 0);
  const totalTvl = TESTNET_POOLS.reduce((sum, pool) => sum + pool.tvl, 0);

  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30">
              <Droplets className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                Liquidity Pools
              </h2>
              <p className="text-sm text-muted-foreground">
                Earn fees and rewards by providing liquidity on Mezo
              </p>
            </div>
          </div>
          <div className="stat-badge flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Testnet
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Manage and stake LP positions, claim fees and emissions. Maximize your returns with boosted pools.
        </p>

        <div className="divider-gradient" />

        {/* Promo Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-primary">Add liquidity to start earning rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn MATS with your first deposit in each pool—limited-time bonus, limited spots.
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary animate-float" />
          </div>
        </div>

        {/* Liquidity Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Volume</p>
            <p className="text-lg font-bold">${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Fees</p>
            <p className="text-lg font-bold">${totalFees.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground mb-1">TVL</p>
            <p className="text-lg font-bold">${totalTvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Available Pools */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available pools</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-3 px-2">Pools</th>
                  <th className="text-right py-3 px-2">Volume</th>
                  <th className="text-right py-3 px-2">Fees</th>
                  <th className="text-right py-3 px-2">TVL</th>
                  <th className="text-right py-3 px-2">APR</th>
                </tr>
              </thead>
              <tbody>
                {TESTNET_POOLS.map((pool) => (
                  <tr 
                    key={pool.id} 
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedPool(pool)}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <img src={pool.token0.logo} alt={pool.token0.symbol} className="h-8 w-8 rounded-full border-2 border-background" />
                          <img src={pool.token1.logo} alt={pool.token1.symbol} className="h-8 w-8 rounded-full border-2 border-background" />
                        </div>
                        <div>
                          <p className="font-medium">{pool.name}</p>
                          <p className="text-xs text-muted-foreground">50/50 pool</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-2">${pool.volume.toLocaleString()}</td>
                    <td className="text-right py-4 px-2">${pool.fees.toFixed(2)}</td>
                    <td className="text-right py-4 px-2">${pool.tvl.toLocaleString()}</td>
                    <td className="text-right py-4 px-2">
                      <span className="text-success font-medium">{pool.apr.toFixed(2)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pool Details Modal/Panel */}
        {selectedPool && (
          <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src={selectedPool.token0.logo} alt={selectedPool.token0.symbol} className="h-10 w-10 rounded-full border-2 border-background" />
                  <img src={selectedPool.token1.logo} alt={selectedPool.token1.symbol} className="h-10 w-10 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedPool.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{selectedPool.address}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://explorer.mezo.org/address/${selectedPool.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>View on Explorer</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPool(null)}>
                ✕
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="add" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Add liquidity
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Withdraw
                </TabsTrigger>
                <TabsTrigger value="stake" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Stake LP
                </TabsTrigger>
                <TabsTrigger value="unstake" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Unstake LP
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <PoolActionPanel pool={selectedPool} activeTab={activeTab} />
              </div>
            </Tabs>
          </div>
        )}

        {/* How it works */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
          <h4 className="font-semibold">How it works</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <div>
                <span className="font-medium">Add liquidity</span>
                <p className="text-muted-foreground text-xs">Deposit assets into pools to receive LP tokens to start earning fees.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <div>
                <span className="font-medium">Stake LP tokens</span>
                <p className="text-muted-foreground text-xs">Stake your LP tokens to earn MATS rewards. Leverage Tigris launch boosts to multiply your returns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
