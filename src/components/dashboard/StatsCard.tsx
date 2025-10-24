import { Card } from '@/components/ui/card';
import { TrendingUp, Percent, DollarSign, Shield } from 'lucide-react';

interface StatsCardProps {
  btcPrice: number;
  totalCollateral: number;
  totalBorrowed: number;
}

export const StatsCard = ({ btcPrice, totalCollateral, totalBorrowed }: StatsCardProps) => {
  const stats = [
    {
      label: 'BTC Price',
      value: `$${btcPrice.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      label: 'Interest Rate',
      value: '1%',
      icon: Percent,
      color: 'text-accent',
    },
    {
      label: 'Total Value Locked',
      value: `$${(totalCollateral * btcPrice).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-success',
    },
    {
      label: 'Min. Collateral',
      value: '150%',
      icon: Shield,
      color: 'text-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-4 bg-gradient-to-br from-card to-card/80 border-primary/20 hover-lift card-hover slide-up-fade gradient-border group relative overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} transition-all duration-300`}>{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float`} style={{ animationDelay: `${index * 150}ms` }} />
          </div>
        </Card>
      ))}
    </div>
  );
};
