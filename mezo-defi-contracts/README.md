# Mezo DeFi Contracts

Smart contracts powering the Mezo DeFi platform - a Bitcoin-backed stablecoin protocol with no-loss prize savings and LP staking.

## 📁 Structure

```
mezo-defi-contracts/
├── contracts/
│   ├── SavingsVault.sol    # No-loss prize savings pool
│   └── Staking.sol         # LP token staking for rewards
├── scripts/
│   └── deploy.ts           # Deployment script
├── test/
│   └── SavingsVault.test.ts
├── hardhat.config.ts
├── package.json
└── README.md
```

## 🚀 Contracts

### SavingsVault.sol

A no-loss prize savings pool where users deposit MUSD to earn prize entries:

- **Deposit MUSD** → Receive prize entries (1 entry per MUSD)
- **Pool generates yield** → Yield flows to prize pool
- **Random winner selected** → Winner takes all yield
- **Original deposits safe** → Everyone keeps their principal

**Key Functions:**
- `deposit(uint256 amount)` - Deposit MUSD into vault
- `withdraw(uint256 amount)` - Withdraw MUSD from vault  
- `claimPrize()` - Claim prize if selected as winner

**Deployed Address:** `0x77922c638Da9a4fBC6f2f3B04ae625632deCD12F`

### Staking.sol

LP token staking contract for Mezo liquidity providers:

- **Stake LP tokens** → Earn MATS emissions
- **Accumulate rewards** → Based on time staked and pool share
- **Claim anytime** → Flexible reward claiming

**Key Functions:**
- `stake(uint256 amount)` - Stake LP tokens
- `unstake(uint256 amount)` - Unstake LP tokens
- `claimRewards()` - Claim accumulated MATS rewards

**Deployed Address:** `0x0E6756cfc93f2b90fC24992F794940d6f5a6912d`

## 🛠 Development

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
cd mezo-defi-contracts
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy

```bash
# Local
npm run deploy:local

# Mezo Testnet
npm run deploy:testnet

# Mezo Mainnet
npm run deploy:mezo
```

## ⚙️ Configuration

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key
MEZO_RPC_URL=https://mainnet.mezo.validationcloud.io/v1/YOUR_API_KEY
MEZO_EXPLORER_API_KEY=your_explorer_api_key
REPORT_GAS=true
```

## 🔗 Network Details

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Mezo Mainnet | 31612 | https://mainnet.mezo.validationcloud.io |
| Mezo Testnet | 31611 | https://testnet.mezo.org/rpc |

## 📜 License

MIT
