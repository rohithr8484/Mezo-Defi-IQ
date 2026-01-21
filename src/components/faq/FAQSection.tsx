// Trading & Arbitrage
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { HelpCircle, Coins, ArrowLeftRight, Activity, Shield, Wallet, TrendingUp, Droplets, Lock, Unlock } from 'lucide-react';

const faqs = [
  {
    question: "How do I get started with Mezo DeFi?",
    answer: "Connect your wallet using the 'Connect Wallet' button. Once connected, you can deposit BTC as collateral, borrow MUSD, swap tokens, and monitor arbitrage opportunities. Start by adding collateral in the 'Borrow MUSD' section.",
    icon: Wallet,
    relatedFeatures: ["Connect Wallet", "Borrow MUSD"]
  },
  {
    question: "What is the collateral ratio and why does it matter?",
    answer: "The collateral ratio is the value of your BTC collateral divided by your borrowed MUSD. A minimum of 150% is required. Higher ratios (200%+) are safer and protect against liquidation if BTC price drops. Use the 'Add Collateral' feature to increase your ratio.",
    icon: Shield,
    relatedFeatures: ["Add Collateral", "Position Management"]
  },
  {
    question: "How does borrowing MUSD work?",
    answer: "Deposit BTC as collateral, then borrow MUSD at a fixed 1% rate. You can borrow up to 66% of your collateral value (150% ratio). Use the slider to set your target ratio - higher is safer. Your MUSD can be used for DeFi, trading, or swapping.",
    icon: Coins,
    relatedFeatures: ["Borrow MUSD", "Collateral Management"]
  },
  {
    question: "How do I swap between tokens?",
    answer: "Use the Swap feature powered by Tigris DEX. Select your input token (BTC, MUSD, mUSDC, mUSDT), enter the amount, and choose your output token. Approve the token first, then execute the swap. Adjust slippage in settings if needed.",
    icon: ArrowLeftRight,
    relatedFeatures: ["Swap", "Token Approval"]
  },
  {
    question: "What is the Arbitrage Monitor?",
    answer: "The Arbitrage Monitor scans for price differences across protocols in real-time. When opportunities are found, you can see the potential profit, gas costs, and net profit. Click 'Scan Now' to manually trigger a scan for new opportunities.",
    icon: Activity,
    relatedFeatures: ["Arbitrage Monitor", "Trading"]
  },
  {
    question: "What happens if my collateral ratio drops below 150%?",
    answer: "If your ratio falls below 150%, your position is at risk of liquidation. Add more collateral immediately using the 'Add Collateral' button, or repay some MUSD to restore a healthy ratio. Monitor the liquidation price shown in your position.",
    icon: TrendingUp,
    relatedFeatures: ["Add Collateral", "Position Monitoring"]
  },
  {
    question: "What are Liquidity Pools and how do they work?",
    answer: "Liquidity Pools allow you to deposit token pairs (like MUSD/BTC) to earn trading fees and rewards. When you add liquidity, you receive LP tokens representing your share of the pool. You can stake these LP tokens to earn additional MATS rewards.",
    icon: Droplets,
    relatedFeatures: ["Liquidity Pools", "LP Tokens", "Yield Farming"]
  },
  {
    question: "How do I add liquidity to a pool?",
    answer: "Navigate to the Liquidity Pools section, select a pool (MUSD/BTC, MUSD/mUSDC, or MUSD/mUSDT), click on it to open the panel, then provide equal value amounts of both tokens. After adding liquidity, you'll receive LP tokens that represent your pool share.",
    icon: Droplets,
    relatedFeatures: ["Add Liquidity", "LP Tokens"]
  },
  {
    question: "What is LP staking and how do I earn rewards?",
    answer: "After adding liquidity, you can stake your LP tokens in the pool's gauge to earn MATS emissions on top of trading fees. Use the 'Stake LP' tab in the pool panel to stake, or 'Unstake LP' to withdraw and return to earning just trading fees.",
    icon: Lock,
    relatedFeatures: ["Stake LP", "Unstake LP", "MATS Rewards"]
  },
];

export const FAQSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12 slide-up-fade">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl icon-container">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              FAQ
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using Mezo DeFi
          </p>
        </div>

        <Card className="glass-panel border-primary/20 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <Accordion type="single" collapsible className="space-y-2 relative z-10">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-muted/30 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="pl-12 space-y-3">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {faq.relatedFeatures.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>
      </div>
    </section>
  );
};
