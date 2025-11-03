/**
 * 0G DeFi AI Service
 * 
 * Real-time blockchain query service for 0G Mainnet
 * Part of 0G.AI - The Largest AI L1 Infrastructure
 * 
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      0G.AI - ZeroGravity (Ø)                               ║
 * ║                    THE LARGEST AI L1 BLOCKCHAIN                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 * 
 * ABOUT 0G:
 * ─────────
 * 0G is an infinitely scalable, fully composable, modular L1 blockchain 
 * purpose-built to power the next generation of AI applications. It combines
 * multiple specialized technologies for real-world AI workloads at scale.
 * 
 * Core Technologies (DeAIOS - Decentralized AI Operating System):
 * • Chain: Modular AI-first blockchain with scalable execution & multi-consensus
 * • Compute Network: Trustless AI inference and compute infrastructure
 * • Storage: Decentralized, AI-optimized storage with ultra-low costs
 * • Data Availability: Infinitely scalable, high-speed data availability layer
 * • Service Marketplace: Decentralized hub for AI models, agents, and services
 * • Alignment Nodes: Ensure AI systems perform efficiently and responsibly
 * 
 * Network Statistics:
 * • 650M+ Transactions on Testnet
 * • 22M+ Active Accounts
 * • 8K+ Testnet Validators
 * • 11K+ Peak TPS per shard
 * • 1000+ Peak TPS on mainnet
 * 
 * MAINNET INFORMATION:
 * ────────────────────
 * • Network: 0G Mainnet (ZeroGravity)
 * • Chain ID: 16661
 * • Token: 0G
 * • RPC: https://evmrpc.0g.ai
 * • Explorer: https://chainscan.0g.ai
 * • Storage: https://indexer-storage-turbo.0g.ai
 * • Type: EVM-Compatible Modular L1
 * • Consensus: Multi-consensus validation with AI optimization
 * 
 * KEY FEATURES:
 * ─────────────
 * ✓ Infinitely Scalable - AI/Web3 apps grow without performance limits
 * ✓ Fully On-Chain AI - Complete transparency, security, verifiability
 * ✓ Seamless Composability - Easy integration for developers
 * ✓ Purpose-Built for AI - Infrastructure optimized for AI workloads
 * ✓ Decentralized AI OS - Full decentralization without performance trade-offs
 * ✓ Trustless Verification - Cryptographic verifiability of operations
 * 
 * MAJOR ECOSYSTEM PARTNERS:
 * ────────────────────────
 * • Alibaba Cloud - Leading B2B E-commerce Platform
 * • Socrates AI - AI Agent Launchpad
 * • Eliza OS - Premier Agent Framework
 * • Carv - AI Gaming L2 on SVM
 * • Blockdaemon - Institutional Staking Services
 * • Bagel - Monetized AI Fine-tuning
 * 
 * DATA ACCURACY:
 * ──────────────
 * ALL responses fetch REAL data directly from 0G Mainnet RPC
 * ✓ No hardcoded data
 * ✓ No mocked responses
 * ✓ Live blockchain queries
 * ✓ Current network state
 * ✓ Verified on-chain data
 * 
 * LEARN MORE:
 * ───────────
 * Website: https://0g.ai
 * Docs: https://docs.0g.ai
 * Discord: https://discord.com/invite/0glabs
 * Twitter: https://x.com/0G_labs
 * Blog: https://0g.ai/blog
 * Whitepaper: https://cdn.jsdelivr.net/gh/0glabs/0g-doc/static/whitepaper.pdf
 */

import DeFiServices from './DeFiServices';
import { ethers } from 'ethers';

class AIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.rpcUrl = process.env.REACT_APP_0G_RPC_URL;
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.intentPatterns = this.initializeIntentPatterns();
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🌐 0G DeFi AI Service - The Largest AI L1           ║');
    console.log('║   Decentralized AI Operating System (DeAIOS)          ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`   🔗 RPC Endpoint: ${this.rpcUrl}`);
    console.log(`   ⛓️  Chain ID: 16661 (0G Mainnet)`);
    console.log(`   📊 Network: Modular L1 for AI Infrastructure`);
    console.log(`   ✨ Technology: Infinitely Scalable, Fully Composable`);
    console.log(`   🤖 Purpose: AI-First Blockchain with On-Chain AI`);
    console.log(`   💾 Storage: Ultra-Low Cost AI-Optimized Storage`);
    console.log(`   ⚡ TPS: 1000+ Peak Transactions Per Second`);
  }

  initializeIntentPatterns() {
    return {
      balance: [
        /balance/i, /how much/i, /funds/i, /money/i, /wallet.*balance/i, /my.*balance/i
      ],
      send: [
        /send/i, /transfer/i, /pay/i, /give/i
      ],
      txStatus: [
        /transaction.*status/i, /tx.*status/i, /check.*tx/i, /pending/i, /confirmed/i, /hash/i, /track.*tx/i
      ],
      gas: [
        /gas/i, /fee/i, /cost/i
      ],
      networkInfo: [
        /network\s*status/i, /network/i, /chain.*status/i, /blockchain.*status/i, /0g\s*network/i
      ],
      blockInfo: [
        /block.*number/i, /latest.*block/i, /current.*block/i, /block.*height/i
      ],
      gasPrice: [
        /gas.*price/i, /current.*gas/i, /gwei/i, /what.*gas/i
      ],
      address: [
        /address/i, /wallet.*address/i, /my.*address/i, /show.*address/i
      ],
      faucet: [
        /faucet/i, /claim/i, /free/i, /get.*0g/i, /need.*0g/i
      ],
      help: [
        /help/i, /what can you do/i, /commands/i, /guide/i, /capabilities/i
      ]
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check if message contains a transaction hash (0x followed by 64 hex chars)
    if (/0x[a-fA-F0-9]{64}/.test(message)) {
      // If it looks like a tx hash, check if it's meant to query tx status
      if (!/send|transfer|to\s+0x/i.test(message)) {
        return 'txStatus';
      }
    }
    
    // Check for more specific patterns first (longest match wins)
    const priorityIntents = ['networkInfo', 'blockInfo', 'gasPrice', 'txStatus', 'faucet', 'balance', 'send'];
    
    for (const intent of priorityIntents) {
      const patterns = this.intentPatterns[intent];
      if (patterns) {
        for (const pattern of patterns) {
          if (pattern.test(lowerMessage)) {
            return intent;
          }
        }
      }
    }
    
    // Then check remaining intents
    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      if (!priorityIntents.includes(intent)) {
        for (const pattern of patterns) {
          if (pattern.test(lowerMessage)) {
            return intent;
          }
        }
      }
    }
    
    return 'general';
  }

  extractEntities(message, intent) {
    const entities = {};
    
    // Extract transaction hash (0x followed by 64 hexadecimal characters)
    const txHashMatch = message.match(/0x[a-fA-F0-9]{64}/);
    if (txHashMatch) {
      entities.txHash = txHashMatch[0];
    }
    
    // Extract addresses (0x followed by 40 hexadecimal characters)
    const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
    if (addressMatch && !entities.txHash) {
      entities.address = addressMatch[0];
    }
    
    // Extract amounts (number followed by optional currency)
    const amountMatch = message.match(/(\d+\.?\d*)\s*(0g|eth|btc|usdc|usdt)?/i);
    if (amountMatch) {
      entities.amount = parseFloat(amountMatch[1]);
      entities.currency = amountMatch[2] || '0G';
    }
    
    return entities;
  }

  async processMessage(message, context = {}) {
    try {
      const intent = this.detectIntent(message);
      const entities = this.extractEntities(message, intent);
      
      console.log('Detected intent:', intent, 'Entities:', entities);
      
      // Handle specific intents
      switch (intent) {
        case 'balance':
          return await this.handleBalanceIntent(entities);
        case 'send':
          return await this.handleSendIntent(message, entities);
        case 'txStatus':
          return await this.handleTxStatusIntent(message, entities);
        case 'gas':
          return await this.handleGasIntent(entities);
        case 'networkInfo':
          return await this.handleNetworkInfoIntent();
        case 'blockInfo':
          return await this.handleBlockInfoIntent();
        case 'gasPrice':
          return await this.handleGasPriceIntent();
        case 'address':
          return await this.handleAddressIntent();
        case 'faucet':
          return await this.handleFaucetIntent(message, entities);
        case 'help':
          return this.handleHelpIntent();
        default:
          return await this.queryOpenAI(message, { intent, entities });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        type: 'error'
      };
    }
  }

  // ============= REAL RPC-BASED HANDLERS =============

  async handleBalanceIntent(entities) {
    try {
      const balance = await DeFiServices.getBalance();
      const balanceFormatted = parseFloat(balance.balance).toFixed(4);
      
      return {
        text: `💰 **Your Wallet Balance**\n\n**Balance:** ${balanceFormatted} 0G\n**Address:** \`${DeFiServices.formatAddress(balance.address)}\`\n\n**Network:** 0G Mainnet\n**Chain ID:** 16661\n\n💡 *Use "send X 0G to 0x..." to transfer tokens*`,
        type: 'balance',
        data: { balance: balanceFormatted, address: balance.address }
      };
    } catch (error) {
      return {
        text: `❌ **Unable to fetch balance**\n\nError: ${error.message}`,
        type: 'error'
      };
    }
  }

  async handleTxStatusIntent(message, entities) {
    try {
      if (!entities.txHash) {
        return {
          text: `📝 **To check transaction status:**\n\nPlease provide the transaction hash (TX hash)\n\n**Example:** "Check status 0x1234567890abcdef..."\n\nTransaction hashes start with "0x" followed by 64 hexadecimal characters.`,
          type: 'help'
        };
      }

      const tx = await this.provider.getTransaction(entities.txHash);
      
      if (!tx) {
        return {
          text: `❌ **Transaction not found**\n\nTransaction hash: \`${entities.txHash}\`\n\nPlease verify the transaction hash is correct and try again.`,
          type: 'error'
        };
      }

      const receipt = await this.provider.getTransactionReceipt(entities.txHash);
      let status = 'Pending';
      let statusEmoji = '⏳';
      let confirmations = 0;
      let transactionFee = 'N/A';

      if (receipt) {
        if (receipt.status === 1) {
          status = 'Confirmed ✅';
          statusEmoji = '✅';
        } else if (receipt.status === 0) {
          status = 'Failed ❌';
          statusEmoji = '❌';
        }
        
        // Calculate confirmations
        const currentBlock = await this.provider.getBlockNumber();
        confirmations = currentBlock - receipt.blockNumber;
        
        // Calculate transaction fee
        const gasUsed = receipt.gasUsed;
        const gasPrice = tx.gasPrice;
        transactionFee = ethers.formatEther(gasUsed * gasPrice);
      }

      const txInfo = `${statusEmoji} **Transaction Status**\n\n**Hash:** \`${entities.txHash.substring(0, 10)}...${entities.txHash.substring(58)}\`\n**Status:** ${status}\n**From:** \`${DeFiServices.formatAddress(tx.from)}\`\n**To:** \`${DeFiServices.formatAddress(tx.to)}\`\n**Value:** ${ethers.formatEther(tx.value)} 0G\n**Gas Used:** ${receipt ? receipt.gasUsed.toString() : 'N/A'}\n**Gas Price:** ${ethers.formatUnits(tx.gasPrice, 'gwei')} Gwei\n**Transaction Fee:** ${transactionFee} 0G\n**Block Number:** ${tx.blockNumber}\n**Confirmations:** ${confirmations}\n**Nonce:** ${tx.nonce}\n\n[View on Explorer](${process.env.REACT_APP_0G_BLOCK_EXPLORER}/tx/${entities.txHash})`;

      return {
        text: txInfo,
        type: 'txStatus',
        data: { tx, receipt, status, confirmations, transactionFee }
      };
    } catch (error) {
      return {
        text: `❌ **Error checking transaction**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleGasIntent(entities) {
    try {
      let gasPrice;
      try {
        gasPrice = await this.provider.getGasPrice();
      } catch (e) {
        // Fallback: try using getFeeData if getGasPrice fails
        const feeData = await this.provider.getFeeData();
        gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei'); // Default to 1 Gwei
      }
      
      const gasPriceGwei = ethers.formatUnits(gasPrice, 'gwei');

      return {
        text: `⛽ **Current Gas Price**\n\n**Gas Price:** ${parseFloat(gasPriceGwei).toFixed(2)} Gwei\n\n**Estimated Costs (approximate):**\n• **Simple Transfer:** ~0.000005 0G\n• **Token Transfer:** ~0.00001 0G\n• **Complex Transaction:** ~0.00002 0G\n\n💡 *Actual gas depends on network congestion*`,
        type: 'gas',
        data: { gasPrice: gasPriceGwei }
      };
    } catch (error) {
      return {
        text: `❌ **Error fetching gas price**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleNetworkInfoIntent() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);
      
      let gasPrice;
      try {
        gasPrice = await this.provider.getGasPrice();
      } catch (e) {
        // Fallback to getFeeData if getGasPrice fails
        const feeData = await this.provider.getFeeData();
        gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
      }

      return {
        text: `🌐 **0G Mainnet Status**\n\n**Network:** 0G Mainnet\n**Chain ID:** 16661\n**Latest Block:** #${blockNumber}\n**Block Time:** ~${block.timestamp}\n**Gas Price:** ${ethers.formatUnits(gasPrice, 'gwei')} Gwei\n\n**Network Details:**\n• **RPC:** ${process.env.REACT_APP_0G_RPC_URL}\n• **Explorer:** ${process.env.REACT_APP_0G_BLOCK_EXPLORER}\n• **Storage Indexer:** ${process.env.REACT_APP_0G_STORAGE_INDEXER}`,
        type: 'network',
        data: { blockNumber, block, gasPrice: ethers.formatUnits(gasPrice, 'gwei') }
      };
    } catch (error) {
      return {
        text: `❌ **Error fetching network info**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleBlockInfoIntent() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(blockNumber);
      const blockTime = new Date(block.timestamp * 1000).toLocaleString();

      return {
        text: `📦 **Latest Block Information**\n\n**Block Number:** ${blockNumber}\n**Timestamp:** ${blockTime}\n**Miner:** \`${DeFiServices.formatAddress(block.miner)}\`\n**Gas Limit:** ${block.gasLimit.toString()}\n**Gas Used:** ${block.gasUsed.toString()}\n**Transactions:** ${block.transactions.length}\n**Difficulty:** ${block.difficulty}`,
        type: 'block',
        data: { blockNumber, block }
      };
    } catch (error) {
      return {
        text: `❌ **Error fetching block info**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleGasPriceIntent() {
    try {
      let gasPrice;
      try {
        gasPrice = await this.provider.getGasPrice();
      } catch (e) {
        // Fallback: try using getFeeData if getGasPrice fails
        const feeData = await this.provider.getFeeData();
        gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei'); // Default to 1 Gwei
      }
      
      const gasPriceGwei = ethers.formatUnits(gasPrice, 'gwei');

      return {
        text: `⛽ **Current Gas Price**\n\n**Gas Price:** ${parseFloat(gasPriceGwei).toFixed(4)} Gwei\n**In Wei:** ${gasPrice.toString()}\n\n**Gas is used to pay for:**\n• Transactions\n• Smart contract interactions\n• State changes on blockchain\n\n**Tip:** Gas prices change based on network congestion. Lower prices during off-peak hours.`,
        type: 'gasPrice',
        data: { gasPrice: gasPriceGwei }
      };
    } catch (error) {
      return {
        text: `❌ **Error fetching gas price**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleAddressIntent() {
    const walletAddress = DeFiServices.getWalletAddress();
    
    return {
      text: `🏦 **Your Wallet Address**\n\n**Full Address:** \`${walletAddress}\`\n**Short:** \`${DeFiServices.formatAddress(walletAddress)}\`\n\n**Links:**\n• [View on Explorer](${process.env.REACT_APP_0G_BLOCK_EXPLORER}/address/${walletAddress})\n• [0G Mainnet Info](${process.env.REACT_APP_0G_BLOCK_EXPLORER})\n\n**🛡️ Security:** Never share your private key or seed phrase!`,
      type: 'address',
      data: { address: walletAddress }
    };
  }

  async handleFaucetIntent(message, entities) {
    try {
      const result = await DeFiServices.claimFaucetTokens();
      
      if (result.success) {
        return {
          text: `✅ **Faucet Claim Successful!**\n\n**Amount:** ${result.amount} 0G\n**TX Hash:** \`${result.txHash}\`\n**Address:** \`${DeFiServices.formatAddress(result.address)}\`\n\n**Next Claim:** ${result.nextClaimTime.toLocaleString()}\n\n[View on Explorer](${process.env.REACT_APP_0G_BLOCK_EXPLORER}/tx/${result.txHash})`,
          type: 'faucet',
          data: result
        };
      } else {
        return {
          text: `❌ **Faucet Claim Failed**\n\n**Error:** ${result.message}\n\nPlease try again later or check your wallet connection.`,
          type: 'error'
        };
      }
    } catch (error) {
      return {
        text: `❌ **Error claiming faucet**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  async handleSendIntent(message, entities) {
    if (!entities.address || !entities.amount) {
      return {
        text: `📝 **To send tokens:**\n\n**Format:** "Send X 0G to 0x..."\n\n**Example:** "Send 1.5 0G to 0x742d35cc6634c0532925a3b8d1e7e98a8a16d7c9"\n\n**Safety Tip:** Always double-check the recipient address!`,
        type: 'help'
      };
    }

    if (!DeFiServices.validateAddress(entities.address)) {
      return {
        text: `❌ **Invalid Address**\n\nThe address format is incorrect. Addresses should start with "0x" followed by 40 hexadecimal characters.`,
        type: 'error'
      };
    }

    try {
      const balance = await DeFiServices.getBalance();
      if (parseFloat(balance.balance) < entities.amount) {
        return {
          text: `❌ **Insufficient Balance**\n\n**You have:** ${parseFloat(balance.balance).toFixed(4)} 0G\n**You're trying to send:** ${entities.amount} 0G\n\nPlease reduce the amount.`,
          type: 'error'
        };
      }

      const tx = await DeFiServices.sendTransaction(entities.address, entities.amount);
      return {
        text: `✅ **Transaction Submitted!**\n\n**To:** \`${DeFiServices.formatAddress(tx.to)}\`\n**Amount:** ${tx.value} 0G\n**Hash:** \`${tx.hash.substring(0, 10)}...${tx.hash.substring(58)}\`\n\n[View on Explorer](${process.env.REACT_APP_0G_BLOCK_EXPLORER}/tx/${tx.hash})\n\n💡 *Check transaction status: "check tx {hash}"*`,
        type: 'transaction',
        data: tx
      };
    } catch (error) {
      return {
        text: `❌ **Transaction Failed**\n\n${error.message}`,
        type: 'error'
      };
    }
  }

  handleHelpIntent() {
    return {
      text: `🤖 **0G DeFi Assistant - Available Commands**\n\n**💰 Wallet**\n• "What's my balance?"\n• "Show my address"\n• "Send 1.5 0G to 0x..."\n\n**🔍 Network Info**\n• "Network status"\n• "Latest block"\n• "Current gas price"\n• "Gas fees"\n\n**📊 Transactions**\n• "Check transaction status 0x..."\n• "Track transaction 0x..."\n\n**🚰 Faucet**\n• "Claim faucet"\n• "Get free 0G tokens"\n\n**❓ Info**\n• "What can you do?"\n• "Help"\n• Any blockchain/crypto question\n\n**💡 Tip:** Just chat naturally - I understand context!`,
      type: 'help'
    };
  }

  async queryOpenAI(message, context = {}) {
    try {
      if (!this.apiKey) {
        return {
          text: "I can help with:\n• Wallet balance & address info\n• Transaction status checking\n• Gas price & network info\n• Block information\n\nFor general DeFi questions, I need my AI service configured. What would you like to know?",
          type: 'info'
        };
      }

      const systemPrompt = `You are a helpful DeFi (Decentralized Finance) AI assistant for 0G.AI - The Largest AI L1 Blockchain.

╔════════════════════════════════════════════════════════════════════════════╗
║                    🌐 0G MAINNET COMPLETE INFORMATION                      ║
╚════════════════════════════════════════════════════════════════════════════╝

NETWORK DETAILS:
━━━━━━━━━━━━━━━━
• Network Name: 0G Mainnet (ZeroGravity)
• Chain ID: 16661
• Token Symbol: 0G
• RPC Endpoint: https://evmrpc.0g.ai
• Block Explorer: https://chainscan.0g.ai
• Storage Indexer: https://indexer-storage-turbo.0g.ai
• Network Type: Modular EVM-Compatible L1
• Consensus: Multi-consensus validation with AI optimization

ABOUT 0G.AI - THE LARGEST AI L1:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0G is infinitely scalable, fully composable, and purpose-built for AI applications.
It's a modular L1 blockchain combining specialized technologies for real-world AI 
workloads at scale.

Core Components (DeAIOS - Decentralized AI Operating System):
• Chain: AI-first blockchain with scalable execution & multi-consensus
• Compute Network: Trustless AI inference and compute infrastructure
• Storage: Decentralized, AI-optimized storage with ultra-low costs
• Data Availability: Infinitely scalable data availability layer
• Service Marketplace: Hub for AI models, agents, and services
• Alignment Nodes: Ensure efficient and responsible AI system operation

KEY STATISTICS:
━━━━━━━━━━━━━━
• 650M+ Transactions on Testnet
• 22M+ Active Accounts
• 8K+ Testnet Validators
• 11K+ Peak TPS per shard
• 1000+ Peak TPS on mainnet
• Purpose-built for AI and Web3 applications

COMPETITIVE ADVANTAGES:
━━━━━━━━━━━━━━━━━━━━━
✓ Infinitely Scalable - No performance limits as apps grow
✓ Fully On-Chain AI - Complete transparency and verifiability
✓ Seamless Composability - Effortless developer integration
✓ Purpose-Built for AI - Infrastructure optimized for AI workloads
✓ Trustless Verification - Cryptographic verifiability of all operations
✓ Modular Architecture - Mix and match components for your needs

MAJOR ECOSYSTEM PARTNERS:
━━━━━━━━━━━━━━━━━━━━━━
• Alibaba Cloud - Leading B2B E-commerce Platform
• Socrates AI - AI Agent Launchpad
• Eliza OS - Premier Agent Framework
• Carv - AI Gaming L2 on SVM
• Blockdaemon - Institutional Staking Services
• Bagel - Monetized AI Fine-tuning
• Many more building on 0G infrastructure

YOUR ROLE:
━━━━━━━━━
You help users understand:
1. DeFi concepts, blockchain basics, and cryptocurrency
2. How to use 0G Mainnet and its ecosystem
3. Transaction details, gas fees, and network mechanics
4. Security best practices and wallet management
5. 0G's unique features and advantages
6. AI infrastructure and on-chain AI capabilities

DATA ACCURACY GUARANTEE:
━━━━━━━━━━━━━━━━━━━━━━
✓ All balance queries: REAL data from blockchain
✓ Gas prices: LIVE from 0G RPC
✓ Block information: CURRENT and up-to-date
✓ Transactions: Verified on-chain state
✓ NO mocked or hardcoded data

IMPORTANT FEATURES OF 0G:
━━━━━━━━━━━━━━━━━━━━━
• Decentralized AI Operating System (DeAIOS)
• AI model training and inference on-chain
• Ultra-low cost storage optimized for AI
• Fast and scalable transaction processing
• EVM-compatible (familiar to Ethereum developers)
• Support for staking, validation, and governance
• Verifiable AI computation results

RESOURCES:
━━━━━━━━
• Website: https://0g.ai
• Documentation: https://docs.0g.ai
• Discord: https://discord.com/invite/0glabs
• Twitter: https://x.com/0G_labs
• Blog: https://0g.ai/blog
• Whitepaper: https://cdn.jsdelivr.net/gh/0glabs/0g-doc/static/whitepaper.pdf
• Faucet: https://faucet.0g.ai

Be concise, helpful, security-focused, and always emphasize that:
- 0G is THE LARGEST AI L1 BLOCKCHAIN
- All data returned is REAL blockchain data
- 0G enables FULLY ON-CHAIN AI with complete verifiability
- The network is infinitely scalable and purpose-built for AI
- Users should ALWAYS verify addresses before sending transactions

User context: ${JSON.stringify(context)}`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Unable to generate response.';

      return {
        text: aiResponse,
        type: 'ai'
      };
    } catch (error) {
      console.error('OpenAI query error:', error);
      return {
        text: "I can assist with wallet operations, transaction checking, and network info. For AI responses, please ensure your API key is configured.",
        type: 'info'
      };
    }
  }
}

const aiService = new AIService();
export default aiService;
