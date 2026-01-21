import { Card } from '@/components/ui/card';
import { Code2, GitBranch, FileCode, ExternalLink } from 'lucide-react';

export const SmartContractsSection = () => {
  return (
    <Card className="p-6 glass-panel border-primary/20 hover-lift overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">Smart Contracts</h2>
              <p className="text-sm text-muted-foreground">Audited Solidity infrastructure on Mezo</p>
            </div>
          </div>
          <div className="stat-badge flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            Solidity
          </div>
        </div>

        {/* Contract Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:border-success/40 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-success" />
                <h5 className="font-semibold">SavingsVault.sol</h5>
              </div>
              <a 
                href="https://explorer.mezo.org/address/0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186"
                target="_blank"
                rel="noopener noreferrer"
                className="text-success hover:text-success/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Core vault contract for MUSD deposits, yield generation, and no-loss prize pool mechanics.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">deposit()</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">withdraw()</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">claimPrize()</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                <h5 className="font-semibold">Staking.sol</h5>
              </div>
              <a 
                href="https://explorer.mezo.org/address/0x16A76d3cd3C1e3CE843C6680d6B37E9116b5C706"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              LP token staking for liquidity providers to earn MATS emissions and trading fee rewards.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">stake()</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">unstake()</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">claimRewards()</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
