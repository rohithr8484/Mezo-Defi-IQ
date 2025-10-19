-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create arbitrage_opportunities table
CREATE TABLE public.arbitrage_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_pair TEXT NOT NULL,
  source_protocol TEXT NOT NULL,
  target_protocol TEXT NOT NULL,
  source_price NUMERIC NOT NULL,
  target_price NUMERIC NOT NULL,
  profit_percentage NUMERIC NOT NULL,
  estimated_profit_usd NUMERIC NOT NULL,
  gas_cost_usd NUMERIC NOT NULL,
  net_profit_usd NUMERIC NOT NULL,
  trade_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  executed_at TIMESTAMP WITH TIME ZONE,
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.arbitrage_opportunities ENABLE ROW LEVEL SECURITY;

-- Allow public read access to arbitrage opportunities
CREATE POLICY "Arbitrage opportunities are viewable by everyone"
ON public.arbitrage_opportunities
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_arbitrage_opportunities_status ON public.arbitrage_opportunities(status);
CREATE INDEX idx_arbitrage_opportunities_created_at ON public.arbitrage_opportunities(created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_arbitrage_opportunities_updated_at
BEFORE UPDATE ON public.arbitrage_opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();