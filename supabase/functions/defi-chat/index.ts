import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a DeFi Strategy Advisor for Mezo, a Bitcoin-native DeFi platform. You help users with:

1. **Strategy Recommendations**: Based on their risk profile, market conditions, and portfolio
2. **Real-time Alerts & Guidance**: Proactive warnings about collateral ratios, liquidation risks, and market movements
3. **Educational Support**: Explaining DeFi concepts, MUSD borrowing, collateral management, and yield strategies

Key Platform Context:
- MUSD is a Bitcoin-backed stablecoin with 1% APR borrowing
- Minimum collateral ratio is 150% (position liquidates below this)
- Users deposit BTC as collateral to borrow MUSD
- Healthy positions maintain 200%+ collateral ratio
- Liquidation price = (borrowed MUSD * 1.5) / BTC collateral

Risk Profile Guidelines:
- Conservative: Recommend 300%+ collateral ratio, lower leverage
- Moderate: 200-300% collateral ratio, balanced approach
- Aggressive: 150-200% collateral ratio, higher risk/reward

When analyzing positions:
- If collateral ratio < 180%: URGENT warning, suggest adding collateral
- If collateral ratio < 200%: Caution, monitor closely
- If collateral ratio > 250%: Safe, could consider borrowing more if desired

Always:
- Use clear, actionable language
- Provide specific numbers when possible
- Explain the "why" behind recommendations
- Be proactive about risks
- Format responses with markdown for readability`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = SYSTEM_PROMPT;
    
    if (context) {
      contextualPrompt += `\n\n**Current User Context:**
- BTC Price: $${context.btcPrice?.toLocaleString() || 'Unknown'}
- Collateral: ${context.collateral || 0} BTC ($${((context.collateral || 0) * (context.btcPrice || 0)).toLocaleString()})
- Borrowed: ${context.borrowed || 0} MUSD
- Collateral Ratio: ${context.collateralRatio?.toFixed(1) || 0}%
- Liquidation Price: $${context.liquidationPrice?.toLocaleString() || 'N/A'}
- Available to Withdraw: ${context.availableToWithdraw?.toFixed(4) || 0} BTC
- Block Height: ${context.blockHeight || 'Unknown'}
- Wallet Connected: ${context.isConnected ? 'Yes' : 'No'}

Analyze this context and proactively mention any concerns or opportunities.`;
    }

    console.log("Sending request to AI gateway with context:", JSON.stringify(context));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("DeFi chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
