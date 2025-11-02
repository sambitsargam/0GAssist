# 🚀 0GAssist

**AI-Powered DeFi Assistant for 0G Mainnet** - Your intelligent companion for blockchain operations

![0G Network](https://img.shields.io/badge/Network-0G%20Mainnet-00FF00?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.8.1-627EEA?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai)

## 🌟 Overview

0G DeFi AI Assistant is a frontend-only chatbot that provides real-time access to 0G Mainnet blockchain data. Using advanced AI and natural language processing, it transforms complex blockchain operations into simple conversations.

## 🎯 Key Features

### 💰 **Wallet Operations**
- Real-time balance checking
- Send tokens with natural language: "Send 1.5 0G to 0x..."
- Display wallet address with explorer links
- Claim faucet tokens

### 📊 **Real-Time Network Data**
- Current gas prices (live from RPC)
- Latest block information
- Network status and chain details
- Block explorer links

### 📈 **Transaction Tracking**
- Check transaction status: "Check tx 0x..."
- View transaction details from blockchain
- Track pending and confirmed transactions
- Direct blockchain queries (no mocked data)

### 🤖 **Natural Language Interface**
- Understand user intent automatically
- Extract addresses, amounts, and transaction hashes
- Provide contextual responses
- Support for follow-up questions

## 🔗 Network Information

| Property | Value |
|----------|-------|
| **Network Name** | 0G Mainnet |
| **Chain ID** | 16661 |
| **Token Symbol** | 0G |
| **RPC Endpoint** | https://evmrpc.0g.ai |
| **Block Explorer** | https://chainscan.0g.ai |
| **Storage Indexer** | https://indexer-storage-turbo.0g.ai |

## 🛠️ Tech Stack

### **Frontend**
- React 18.2.0
- React Router DOM 6.4.3
- CSS3 with animations

### **Blockchain**
- Ethers.js 6.8.1 (RPC queries)
- 0G Mainnet (EVM-compatible)
- Real-time blockchain data

### **AI**
- OpenAI GPT-3.5-turbo
- Intent recognition system
- Entity extraction

## 📝 Available Commands

### Wallet & Balance
```
"What's my balance?"        → Check 0G balance
"My address"                → Show wallet address
"Send 1.5 0G to 0x..."      → Transfer tokens
```

### Network & Chain
```
"Network status"            → Get chain info
"Latest block"              → Show block details
"Current gas price"         → Get gas fees
```

### Transactions
```
"Check tx 0x..."            → Check transaction status
"Is my tx confirmed?"       → Verify transaction
```

### Help
```
"Help"                      → Show all commands
"What can you do?"          → List capabilities
```

## 🚀 Quick Start

### Installation
```bash
git clone <repository>
cd CircleDeFi-main
npm install
```

### Setup Environment
```bash
# Create .env file
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_PRIVATE_KEY=your_wallet_private_key
REACT_APP_0G_RPC_URL=https://evmrpc.0g.ai
REACT_APP_0G_CHAIN_ID=16661
REACT_APP_0G_TOKEN_SYMBOL=0G
REACT_APP_0G_BLOCK_EXPLORER=https://chainscan.0g.ai
REACT_APP_0G_STORAGE_INDEXER=https://indexer-storage-turbo.0g.ai
```

### Run Development Server
```bash
npm start
# Opens http://localhost:3000
```

### Build for Production
```bash
npm run build
# Creates optimized build in /build folder
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatInterface.js      # Main chat UI
│   ├── LandingPage.js        # Landing page
│   └── WalletStatus.js       # Wallet display
├── services/
│   ├── AIService.js          # AI logic & RPC queries
│   └── DeFiServices.js       # Blockchain operations
├── App.js                     # Main app component
└── index.js                   # Entry point
```

## 🔥 How It Works

### 1. **Intent Detection**
User message → Pattern matching → Detect intent (balance, send, tx status, etc.)

### 2. **Entity Extraction**
Extract addresses, transaction hashes, amounts from message

### 3. **RPC Query**
Query 0G Mainnet via ethers.js provider → Get real-time data

### 4. **Response Generation**
Format data → Add blockchain links → Return to user

## 📚 Data Accuracy

✅ **All data is real-time from the blockchain**
- No hardcoded or mocked responses
- Direct RPC queries to 0G Mainnet
- Live gas prices and block information
- Actual transaction status from chain

## 🔐 Security

✅ Private key stored locally only  
✅ No data sent to external servers except OpenAI API  
✅ Transactions signed locally  
✅ Read-only blockchain queries  

## 🌐 Available Intents

| Intent | Triggers | Example |
|--------|----------|---------|
| balance | balance, funds, how much | "What's my balance?" |
| send | send, transfer, pay | "Send 1 0G to 0x..." |
| txStatus | tx status, check, pending | "Check tx 0x..." |
| gasPrice | gas price, gwei | "Current gas?" |
| networkInfo | network, chain status | "Network status" |
| blockInfo | block, latest block | "Latest block" |
| address | address, my address | "My address" |
| faucet | faucet, claim | "Claim faucet" |
| help | help, what can you do | "Help" |

## 🎯 Example Interactions

### Check Balance
```
User: "What's my balance?"
Assistant: Shows wallet balance in 0G, queried from RPC
```

### Track Transaction
```
User: "Check tx 0x1234567890abcdef..."
Assistant: Queries blockchain, shows transaction status
```

### Network Info
```
User: "Network status"
Assistant: Shows latest block, gas price, chain ID
```

## 🚀 Deployment

```bash
# Build the project
npm run build

# Deploy build folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Any static host
```

## 📞 Support

For issues:
1. Check console for error messages
2. Verify .env configuration
3. Test RPC connection: `curl https://evmrpc.0g.ai`
4. Check wallet connection

## 📄 License

MIT License

## 🙏 Acknowledgments

- 0G Labs for the blockchain infrastructure
- OpenAI for GPT API
- Ethers.js community
- React community

---

**Network:** 0G Mainnet (Chain ID: 16661)  
**Status:** ✅ Production Ready  
**Last Updated:** November 3, 2025
