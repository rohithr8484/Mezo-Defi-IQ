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
          className="p-4 bg-gradient-to-br from-card to-card/80 border-primary/20 hover-lift card-hover animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} transition-all duration-300`}>{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color} opacity-50 transition-transform duration-300 group-hover:scale-110`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
