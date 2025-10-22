# ⚙️ Institutional-Grade Bitcoin DeFi System

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



## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/rohithr8484/mezo-btc-yield-hub.git
cd mezo-btc-yield-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`

## 🔧 Development

### Available Scripts

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
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues to help improve Simple Financial Services.

## 📄 License

This project is proprietary. Please contact the maintainers for access and usage information.

---





