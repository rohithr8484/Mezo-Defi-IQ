import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import mezoLogo from '@/assets/mezo-logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/liquidity', label: 'Liquidity' },
  { path: '/analytics', label: 'Analytics' },
];

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();

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
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-3 animate-slide-in-left">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow flex items-center justify-center shadow-[var(--shadow-glow)] hover-glow p-1 glow-pulse">
                    <img src={mezoLogo} alt="Mezo DeFi" className="h-full w-full object-contain animate-float" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--navbar-foreground))]">
                      Mezo DeFi
                    </h1>
                    <p className="text-xs text-[hsl(var(--navbar-foreground)/0.7)]">Bitcoin-Backed Stablecoin Protocol</p>
                  </div>
                </Link>
                
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 ml-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === link.path
                          ? 'bg-primary/20 text-primary'
                          : 'text-[hsl(var(--navbar-foreground)/0.8)] hover:text-[hsl(var(--navbar-foreground))] hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="animate-slide-in-right">
                <ConnectButton />
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-primary/20 text-primary'
                      : 'text-[hsl(var(--navbar-foreground)/0.8)] hover:text-[hsl(var(--navbar-foreground))] hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};
