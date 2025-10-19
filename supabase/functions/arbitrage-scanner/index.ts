import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArbitrageOpportunity {
  token_pair: string;
  source_protocol: string;
  target_protocol: string;
  source_price: number;
  target_price: number;
  profit_percentage: number;
  estimated_profit_usd: number;
  gas_cost_usd: number;
  net_profit_usd: number;
  trade_amount: number;
  status: string;
}

// Fetch BTC price from Pyth
async function fetchPythPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43');
    const data = await response.json();
    
    if (data.parsed && data.parsed.length > 0) {
      const priceData = data.parsed[0].price;
      return Number(priceData.price) * Math.pow(10, priceData.expo);
    }
    return null;
  } catch (error) {
    console.error('Error fetching Pyth price:', error);
    return null;
  }
}

// Simulate fetching DEX price (in production, would call Tigris router)
async function fetchDexPrice(tokenPair: string): Promise<number | null> {
  try {
    // In production, this would call the Tigris router's getAmountsOut function
    // For now, we'll add a small variance to the Pyth price to simulate DEX pricing
    const pythPrice = await fetchPythPrice();
    if (!pythPrice) return null;
    
    // Simulate 0.1-0.5% price difference
    const variance = 0.001 + Math.random() * 0.004;
    const dexPrice = pythPrice * (1 + (Math.random() > 0.5 ? variance : -variance));
    
    console.log(`DEX price for ${tokenPair}: $${dexPrice.toFixed(2)}`);
    return dexPrice;
  } catch (error) {
    console.error('Error fetching DEX price:', error);
    return null;
  }
}

// Calculate arbitrage opportunity
function calculateArbitrage(
  tokenPair: string,
  pythPrice: number,
  dexPrice: number,
  tradeAmount: number = 1000
): ArbitrageOpportunity | null {
  const priceDiff = Math.abs(pythPrice - dexPrice);
  const profitPercentage = (priceDiff / Math.min(pythPrice, dexPrice)) * 100;
  
  // Estimate gas costs (in USD)
  const gasEstimate = 5; // ~$5 per transaction on Mezo
  
  const estimatedProfitUsd = (priceDiff / dexPrice) * tradeAmount;
  const netProfitUsd = estimatedProfitUsd - (gasEstimate * 2); // 2 transactions: buy + sell
  
  // Only return if net profit is positive
  if (netProfitUsd <= 0) {
    console.log(`No profitable opportunity found. Net profit: $${netProfitUsd.toFixed(2)}`);
    return null;
  }
  
  return {
    token_pair: tokenPair,
    source_protocol: pythPrice > dexPrice ? 'Tigris DEX' : 'Pyth Oracle',
    target_protocol: pythPrice > dexPrice ? 'Pyth Oracle' : 'Tigris DEX',
    source_price: pythPrice > dexPrice ? dexPrice : pythPrice,
    target_price: pythPrice > dexPrice ? pythPrice : dexPrice,
    profit_percentage: profitPercentage,
    estimated_profit_usd: estimatedProfitUsd,
    gas_cost_usd: gasEstimate * 2,
    net_profit_usd: netProfitUsd,
    trade_amount: tradeAmount,
    status: 'pending',
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting arbitrage scan...');

    // Scan for BTC/MUSD arbitrage opportunities
    const pythPrice = await fetchPythPrice();
    const dexPrice = await fetchDexPrice('BTC/MUSD');

    if (!pythPrice || !dexPrice) {
      throw new Error('Failed to fetch prices from one or more sources');
    }

    console.log(`Pyth BTC/USD: $${pythPrice.toFixed(2)}`);
    console.log(`DEX BTC/MUSD: $${dexPrice.toFixed(2)}`);

    const opportunity = calculateArbitrage('BTC/MUSD', pythPrice, dexPrice, 1000);

    if (opportunity) {
      console.log(`Found arbitrage opportunity! Net profit: $${opportunity.net_profit_usd.toFixed(2)}`);
      
      // Store opportunity in database
      const { data, error } = await supabase
        .from('arbitrage_opportunities')
        .insert([opportunity])
        .select()
        .single();

      if (error) {
        console.error('Error storing opportunity:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({
          success: true,
          opportunity: data,
          message: `Found profitable arbitrage: $${opportunity.net_profit_usd.toFixed(2)} profit`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          opportunity: null,
          message: 'No profitable arbitrage opportunities found',
          prices: { pythPrice, dexPrice },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error('Arbitrage scanner error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
