# ⚙️ Mezo Defi - Institutional-Grade Bitcoin DeFi System

This project represents a **sophisticated cross-protocol DeFi platform** designed to **unlock Bitcoin’s full financial potential** through **composable**, **automated**, and **institutionally robust strategies**.

It unifies **real-time market intelligence**, **capital-efficient lending**, and **cross-protocol arbitrage execution** into one cohesive ecosystem — enabling professional-grade yield generation, liquidity optimization, and portfolio automation on Bitcoin.


## 🔧 Core Capabilities

### ⚡ Cross-Protocol Arbitrage Engine
- Scans and exploits **MUSD/BTC price disparities** across **Tigris DEX** and **Pyth Oracle** in real time.  
- **Backend scanner** updates every **400 ms**, identifying arbitrage spreads and pushing **live trade alerts** to the dashboard.  
- Integrated **Arbitrage Dashboard** visualizes **profit margins**, **trade readiness**, and **capital utilization efficiency** for precision execution.

### 🔄 Smart Swap Module
- Implements a **2-step swap flow (Approve → Swap)** with **slippage control** and **transaction status tracking**.  
- Fetches **real-time price quotes** directly from the **Tigris Router** to guarantee optimal routing and full transparency.  
- Robust **error handling**, **wallet validation**, and **transaction integrity checks** ensure a smooth, reliable trading experience.

### 📊 Pyth Oracle Integration
- Utilizes **Pyth Network’s ultra-low-latency BTC/USD feed** (e.g. *$106,780.21*, updated every 400 ms).  
- **On-chain verification** via **Mezo Mainnet** ensures **accurate, tamper-proof price data**.  
- Incorporates **confidence intervals** and **timestamp validation** mechanisms for **high-frequency, low-latency trading strategies**.

---

## 💸 Lending & Collateral Framework
- **Borrow MUSD against BTC** at a **1 % fixed interest rate** while maintaining **full custody** of your collateral.  
- Real-time **collateral ratio tracking** and **risk assessment** ensure continuous portfolio visibility.  
- Dynamically **add**, **withdraw**, or **rebalance collateral** for adaptive liquidity management.  
- Comprehensive **loan health monitoring** and **ROI analytics** displayed through an intuitive interface.

---

## 🔐 Wallet & Integration Layer
- **Seamless wallet connectivity** via **Mezo Passport** and **RainbowKit** for instant access.  
- **Direct Pyth Network price feeds** deliver **sub-second precision** and verifiable on-chain accuracy.  
- **Modular backend architecture** enables composability with other DeFi protocols, liquidity layers, and arbitrage systems.

---

## 🧩 Advanced & Upcoming Features
- **Automated Yield Strategies** – Deploy idle collateral into optimized yield loops for **passive income generation**.  
- **Liquidation Protection** – AI-driven **auto-collateral adjustments** to mitigate liquidation risk.  
- **Multi-Position Portfolio Management** – Track, analyze, and rebalance positions across **multiple chains and protocols**.  
- **Institutional Analytics Dashboard** – Access **profit/loss**, **volatility**, and **Sharpe ratio** metrics for data-driven decisions.  
- **Derivatives Expansion** – Upcoming modules for **BTC options**, **perpetuals**, and **structured yield vaults**.

---

## 🛠 Tech Stack

### Frontend
- **React 18** – Modern UI framework  
- **TypeScript** – Type-safe development  
- **Tailwind CSS** – Utility-first styling  
- **Radix UI** – Accessible component primitives  

### Blockchain & Wallet Integration
- `@mezo-org/passport` – Bitcoin wallet connectivity  
- **RainbowKit** – Wallet management  
- **Sats Connect** – Bitcoin transaction handling  
- **Wagmi + Viem** – Blockchain interaction layer  
- **MUSD Integration** – Stablecoin operations  

### State Management & Forms
- **React Query** – Server state management  
- **Zod** – Schema validation  
- **React Hook Form** – Form handling  

### UI Components & Visualization
- **Lucide Icons** – Beautiful iconography  
- **Sonner** – Toast notifications  
- **Recharts** – Data visualization  
- **Embla Carousel** – Smooth carousels  


---

##  💡  Usage

## 🛡 Built on Trust & Security

Our platform leverages the security and efficiency of:
- **Mezo Network** - For fast, low-cost transactions
- **MUSD Stablecoin** - For price stability and reliability
- **Bitcoin Security** - Through integrated wallet support

## 💡 Core Principles

- **Simplicity** - Manage your money without complexity
- **Accessibility** - Financial services for everyone
- **Transparency** - Clear fees and operations
- **Security** - Built on proven blockchain technology

## Components

<img width="407" height="372" alt="image" src="https://github.com/user-attachments/assets/a3ff980e-d0bc-4069-a0ac-c1b3b7f0f77f" />

# ⚡ Mezo Mainnet Configuration & Contracts

This repository documents the key smart contracts, network parameters, and package dependencies for the **Mezo Mainnet**, including integrations with **Pyth Network**, **Tigris DEX**, and **Mezo Passport** authentication.

---

## 🧠 Pyth Network Oracle

**Contract Address:**  
`0x2880aB155794e7179c9eE2e38200202908C17B43`  
*(Mainnet & Testnet)*

**Type:**  
Price Feed Oracle  

**Purpose:**  
Provides real-time price feeds for crypto assets to power smart contracts and automated trading strategies.

### Supported Price Feeds

| Asset Pair | Feed Address |
|-------------|--------------|
| **BTC/USD** | `0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43` |
| **ETH/USD** | `0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace` |
| **USDT/USD** | `0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b` |

---

## 📚 Libraries Overview

npm install @pythnetwork/pyth-evm-js@2.0.0-alpha2 @pythnetwork/price-service-client@1.9.0

### **Pyth Network**
| Package | Version | Purpose |
|----------|----------|----------|
| `@pythnetwork/pyth-evm-js` | v2.0.0-alpha2 | For on-chain oracle interactions and price verification. |
| `@pythnetwork/price-service-client` | v1.9.0 | For fetching and updating off-chain price data. |

---

## 🦈 Tigris DEX Contracts (Mezo Mainnet)

### **Core Components**
| Component | Address |
|------------|----------|
| **Router** | `0x16A76d3cd3C1e3CE843C6680d6B37E9116b5C706` |
| **Pool Factory** | `0x83FE469C636C4081b87bA5b3Ae9991c6Ed104248` |

### **Liquidity Pools**
| Pair | Contract Address |
|------|-------------------|
| **MUSD/BTC** | `0x52e604c44417233b6CcEDDDc0d640A405Caacefb` |
| **MUSD/mUSDC** | `0xEd812AEc0Fecc8fD882Ac3eccC43f3aA80A6c356` |
| **MUSD/mUSDT** | `0x10906a9E9215939561597b4C8e4b98F93c02031A` |

---

## 💰 Token Contracts (Mezo Mainnet)

| Token | Address | Description | Decimals |
|--------|----------|-------------|-----------|
| **BTC (tBTC)** | `0x7b7C000000000000000000000000000000000000` | Native Bitcoin representation | 18 |
| **MUSD** | `0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186` | Mezo USD stablecoin proxy | 18 |
| **mUSDC** | `0x04671C72Aab5AC02A03c1098314b1BB6B560c197` | Bridged USDC | 6 |
| **mUSDT** | `0xeB5a5d39dE4Ea42C2Aa6A57EcA2894376683bB8E` | Bridged USDT | 6 |

---

## 🪪 Mezo Passport Integration

### **Package**
 npm install @mezo-org/passport @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query
`@mezo-org/passport` v0.11.0

### **Type**
WebAuthn-based decentralized authentication system.

### **Integration**
Integrated via [`@rainbow-me/rainbowkit`](https://www.rainbowkit.com/) wallet connector for seamless onboarding and wallet-free authentication.

### **Network**
- **Network:** Mezo Mainnet  
- **Chain ID:** `31612`

---

## 🔧 Development

### Available Scripts

```bash
# Clone the repository
git clone https://github.com/rohithr8484/mezo-btc-yield-hub.git
cd mezo-Defi-IQ

```

```bash
# Development server
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview

# Linting
npm run lint

Open your browser at `http://localhost:5173`
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues to help improve Simple Financial Services.

## 📄 License

This project is proprietary. Please contact the maintainers for access and usage information.

---





