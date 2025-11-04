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

### ☁️ **Decentralized Chat Storage (0G Storage)**
- **Save chat sessions** permanently on 0G decentralized storage
- **Share conversations** with unique links (available on all devices)
- **Export locally** as JSON, TXT, or CSV
- **Auto-retry mechanism** for cross-device sharing (30s intervals)
- **Instant availability** on same device via browser cache
- **Global availability** after 5-10 minutes of indexing

## 🔗 Network Information

| Property | Value |
|----------|-------|
| **Network Name** | 0G Mainnet |
| **Chain ID** | 16661 |
| **Token Symbol** | 0G |
| **RPC Endpoint** | https://evmrpc.0g.ai |
| **Block Explorer** | https://chainscan.0g.ai |
| **Storage Network** | 0G Galileo Testnet |
| **Storage Chain ID** | 16602 |
| **Storage RPC** | https://evmrpc-testnet.0g.ai |
| **Storage Indexer** | https://indexer-storage-testnet-turbo.0g.ai |
| **Flow Contract** | 0x22E03a6A89B950F1c82ec5e74F8eCa321a105296 |

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

### Chat Storage & Sharing
```
"Share Chat"                → Save conversation to 0G Storage
"Export Chat"               → Download as JSON/TXT/CSV
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

## ☁️ 0G Storage - Chat Sharing

### Save & Share Conversations

The app supports permanent storage and sharing of chat sessions using **0G Decentralized Storage**:

#### How It Works
1. **Click "Share Chat"** button after messages
2. **Name your session** (auto-filled with timestamp)
3. **Connect wallet** to pay gas fees
4. **Click "Upload to 0G Storage"**
5. **Get shareable link** - valid on all devices worldwide

#### Share Link Timeline
- **Instant** ⚡ - Works on same device (localStorage)
- **5 minutes** 🔄 - Available on new devices via auto-retry
- **10+ minutes** 🌍 - Globally indexed and queryable
- **Forever** 📌 - Permanently stored on 0G network

#### Share Features
```
✅ Save conversations to blockchain
✅ Share with unique hash-based links
✅ Export as JSON, TXT, or CSV locally
✅ Auto-retry on new devices (5-10 min wait)
✅ Works across browsers and devices
✅ Permanent decentralized storage
```

#### Example
```
Session uploaded:
  Hash: 0x428af307c64fc0d2f933efd05744e1d450a20275a14beb6e13f54e317297b4f5
  Link: http://localhost:3000/?share=0x428af307...
  Share this link to access conversation on any device
```

### Technical Details
- **Storage Network**: 0G Galileo Testnet (Mainnet coming soon)
- **Data Format**: JSON with metadata
- **File Size**: Optimized for blockchain
- **MIME Type**: application/json
- **Fallback**: Browser cache for instant retrieval
- **Indexer**: https://indexer-storage-turbo.0g.ai

## 🔥 How It Works

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
| shareChat | share, save, export | "Share this chat" |
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

### Share Conversation
```
User: Clicks "Share Chat" button
1. Names session: "DeFi Discussion Nov 4"
2. Clicks "Upload to 0G Storage"
3. Approves transaction in wallet
4. Gets link: http://localhost:3000/?share=0x428af307...
5. Shares link with others
6. Others access on same device instantly, or auto-retry on new device
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
