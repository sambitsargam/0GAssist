import { ethers } from 'ethers';

class DeFiServices {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.isInitialized = false;
    this.initPromise = this.init();
  }

  async init() {
    try {
      // Initialize provider for 0G Mainnet
      const rpcUrl = process.env.REACT_APP_0G_RPC_URL || 'https://rpc.ankr.com/0g_mainnet_evm';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Initialize wallet with private key
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      if (privateKey) {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.isInitialized = true;
        console.log('✅ DeFi Services initialized successfully');
        console.log(`   📍 RPC: ${rpcUrl}`);
        console.log(`   👤 Signer: ${this.wallet.address}`);
        return true;
      } else {
        console.error('❌ Private key not found in REACT_APP_PRIVATE_KEY environment variable');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize DeFi Services:', error);
      return false;
    }
  }

  // Faucet functionality for 0G Mainnet
  async claimFaucetTokens(walletAddress = null) {
    try {
      const targetAddress = walletAddress || this.wallet.address;
      
      // Validate address format
      if (!ethers.isAddress(targetAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Call 0G Mainnet faucet API
      const faucetResponse = await fetch('https://faucet-api.0g.ai/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: targetAddress,
          network: 'mainnet'
        })
      });

      const result = await faucetResponse.json();

      if (faucetResponse.ok) {
        return {
          success: true,
          txHash: result.txHash,
          amount: '1.0',
          address: targetAddress,
          message: `Successfully claimed 1 0G tokens!`,
          nextClaimTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        };
      } else {
        throw new Error(result.error || 'Faucet claim failed');
      }
    } catch (error) {
      // Handle common faucet errors
      if (error.message.includes('rate limit') || error.message.includes('24 hours')) {
        return {
          success: false,
          error: 'RATE_LIMITED',
          message: 'You can only claim once every 24 hours. Please try again tomorrow.',
          nextClaimTime: this.getNextClaimTime()
        };
      } else if (error.message.includes('Invalid')) {
        return {
          success: false,
          error: 'INVALID_ADDRESS',
          message: 'Please provide a valid EVM-compatible wallet address.'
        };
      } else {
        return {
          success: false,
          error: 'FAUCET_ERROR',
          message: `Faucet claim failed: ${error.message}`
        };
      }
    }
  }

  getNextClaimTime() {
    // Mock implementation - in real app, this would check last claim time
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  async checkFaucetEligibility(walletAddress = null) {
    try {
      const targetAddress = walletAddress || this.wallet.address;
      
      // Validate address
      if (!ethers.isAddress(targetAddress)) {
        return {
          eligible: false,
          reason: 'Invalid wallet address'
        };
      }

      // Check faucet eligibility
      const eligibilityResponse = await fetch(`https://faucet-api.0g.ai/eligibility/${targetAddress}`);
      const result = await eligibilityResponse.json();

      if (eligibilityResponse.ok) {
        return {
          eligible: result.eligible,
          lastClaim: result.lastClaim,
          nextClaim: result.nextClaim,
          dailyLimit: '1 0G',
          timeRemaining: result.timeRemaining
        };
      } else {
        // Fallback for development
        return {
          eligible: true,
          lastClaim: null,
          nextClaim: new Date(),
          dailyLimit: '1 0G',
          timeRemaining: 0
        };
      }
    } catch (error) {
      console.error('Error checking faucet eligibility:', error);
      // Default to eligible for development
      return {
        eligible: true,
        lastClaim: null,
        nextClaim: new Date(),
        dailyLimit: '1 0G',
        timeRemaining: 0
      };
    }
  }

  async getBalance(address = null) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const targetAddress = address || this.wallet?.address;
      if (!targetAddress) {
        throw new Error('No address provided and wallet not initialized');
      }

      const balance = await this.provider.getBalance(targetAddress);
      
      return {
        balance: ethers.formatEther(balance),
        address: this.wallet.address,
        currency: '0G'
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async estimateGasFee(to, amount) {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }

      const amountWei = ethers.parseEther(amount.toString());
      const tx = {
        to: to,
        value: amountWei
      };

      const gasLimit = await this.wallet.estimateGas(tx);
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei');
      
      const totalGasCost = gasLimit * gasPrice;
      
      return {
        gasLimit: gasLimit.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        totalGasCostWei: totalGasCost.toString(),
        totalGasCost: ethers.formatEther(totalGasCost),
        currency: 'CLAYER'
      };
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }

  async validateTransaction(to, amount) {
    try {
      const validations = {
        isValidAddress: this.validateAddress(to),
        hasEnoughBalance: false,
        gasEstimate: null,
        canAffordGas: false,
        errors: []
      };

      if (!validations.isValidAddress) {
        validations.errors.push('Invalid recipient address');
        return validations;
      }

      const balance = await this.getBalance();
      const balanceNum = parseFloat(balance.balance);
      
      if (balanceNum < amount) {
        validations.errors.push(`Insufficient balance. You have ${balanceNum.toFixed(4)} 0G but trying to send ${amount} 0G`);
      } else {
        validations.hasEnoughBalance = true;
      }

      try {
        const gasEstimate = await this.estimateGasFee(to, amount);
        validations.gasEstimate = gasEstimate;
        
        const totalCost = amount + parseFloat(gasEstimate.totalGasCost);
        if (balanceNum >= totalCost) {
          validations.canAffordGas = true;
        } else {
          validations.errors.push(`Insufficient balance for gas. Total cost: ${totalCost.toFixed(6)} 0G`);
        }
      } catch (gasError) {
        validations.errors.push('Could not estimate gas fees');
      }

      return validations;
    } catch (error) {
      return {
        isValidAddress: false,
        hasEnoughBalance: false,
        gasEstimate: null,
        canAffordGas: false,
        errors: ['Transaction validation failed: ' + error.message]
      };
    }
  }

  async sendTransaction(to, amount, gasLimit = null) {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }

      // Convert amount to wei
      const amountWei = ethers.parseEther(amount.toString());
      
      // Prepare transaction
      const tx = {
        to: to,
        value: amountWei,
        gasLimit: gasLimit || 21000
      };

      // Estimate gas if not provided
      if (!gasLimit) {
        try {
          const estimatedGas = await this.wallet.estimateGas(tx);
          tx.gasLimit = estimatedGas;
        } catch (error) {
          console.warn('Gas estimation failed, using default:', error);
          tx.gasLimit = 21000;
        }
      }

      // Send transaction
      const transaction = await this.wallet.sendTransaction(tx);
      
      return {
        hash: transaction.hash,
        to: transaction.to,
        value: ethers.formatEther(transaction.value),
        gasLimit: transaction.gasLimit.toString(),
        status: 'pending'
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async getTransactionHistory(address = null, limit = 10) {
    try {
      const targetAddress = address || this.wallet?.address;
      if (!targetAddress) {
        throw new Error('No address provided and wallet not initialized');
      }

      // Note: This is a simplified version. In a real app, you'd query the blockchain explorer API
      // For now, we'll return mock data or use basic provider methods
      
      try {
        const latestBlock = await this.provider.getBlockNumber();
        const transactions = [];
        
        // Search recent blocks for transactions involving this address
        const searchBlocks = Math.min(100, latestBlock); // Search last 100 blocks
        
        for (let i = 0; i < searchBlocks && transactions.length < limit; i++) {
          try {
            const blockNumber = latestBlock - i;
            const block = await this.provider.getBlock(blockNumber, true);
            
            if (block && block.transactions) {
              for (const tx of block.transactions) {
                if (tx.from === targetAddress || tx.to === targetAddress) {
                  transactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value || 0),
                    blockNumber: tx.blockNumber,
                    timestamp: block.timestamp,
                    status: 'confirmed',
                    type: tx.from === targetAddress ? 'sent' : 'received'
                  });
                }
                
                if (transactions.length >= limit) break;
              }
            }
          } catch (blockError) {
            console.warn(`Error fetching block ${latestBlock - i}:`, blockError);
            continue;
          }
        }
        
        return transactions;
      } catch (error) {
        console.warn('Error fetching transaction history from blocks:', error);
        // Return empty array if we can't fetch history
        return [];
      }
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber: blockNumber,
        gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
        maxFeePerGas: gasPrice.maxFeePerGas ? ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei') : null,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? ethers.formatUnits(gasPrice.maxPriorityFeePerGas, 'gwei') : null
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      throw error;
    }
  }

  async validateAddress(address) {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  getWalletAddress() {
    return this.wallet?.address || null;
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // DeFi Operations
  async getStakingInfo() {
    // Mock staking data for demonstration
    return {
      totalStaked: '1250.45',
      rewards: '45.67',
      apy: '15.7%',
      stakingPools: [
        { name: '0G Staking Pool', apy: '15.7%', tvl: '2.5M 0G', minStake: '100' },
        { name: '0G-ETH LP', apy: '25.3%', tvl: '1.2M 0G', minStake: '50' },
        { name: 'Validator Staking', apy: '12.1%', tvl: '5.8M 0G', minStake: '1000' }
      ]
    };
  }

  async getLiquidityPools() {
    return [
      {
        name: '0G/ETH',
        tvl: '1.2M',
        apy: '25.3%',
        volume24h: '45.2K',
        fees: '0.3%',
        userLiquidity: '0',
        poolShare: '0%'
      },
      {
        name: '0G/USDC',
        tvl: '850K',
        apy: '18.7%',
        volume24h: '32.1K',
        fees: '0.3%',
        userLiquidity: '0',
        poolShare: '0%'
      },
      {
        name: '0G/BTC',
        tvl: '650K',
        apy: '22.1%',
        volume24h: '28.5K',
        fees: '0.3%',
        userLiquidity: '0',
        poolShare: '0%'
      }
    ];
  }

  async getFarmingOpportunities() {
    return [
      {
        name: '0G Yield Farm',
        token: '0G',
        apy: '45.2%',
        tvl: '3.2M',
        rewards: '0G + Protocol Tokens',
        lockPeriod: 'None',
        risk: 'Low'
      },
      {
        name: 'LP Token Farm',
        token: '0G-ETH LP',
        apy: '67.8%',
        tvl: '1.8M',
        rewards: '0G + Bonus Tokens',
        lockPeriod: '30 days',
        risk: 'Medium'
      },
      {
        name: 'High Yield Farm',
        token: '0G-USDC LP',
        apy: '89.5%',
        tvl: '950K',
        rewards: 'Multiple Tokens',
        lockPeriod: '90 days',
        risk: 'High'
      }
    ];
  }

  async getLendingInfo() {
    return {
      totalSupplied: '0',
      totalBorrowed: '0',
      netApy: '0%',
      healthFactor: 'N/A',
      markets: [
        {
          asset: '0G',
          supplyApy: '8.2%',
          borrowApy: '12.5%',
          utilization: '65%',
          totalSupplied: '2.1M',
          totalBorrowed: '1.4M',
          collateralFactor: '75%'
        },
        {
          asset: 'ETH',
          supplyApy: '5.7%',
          borrowApy: '9.8%',
          utilization: '58%',
          totalSupplied: '850',
          totalBorrowed: '493',
          collateralFactor: '80%'
        },
        {
          asset: 'USDC',
          supplyApy: '4.1%',
          borrowApy: '7.2%',
          utilization: '72%',
          totalSupplied: '1.8M',
          totalBorrowed: '1.3M',
          collateralFactor: '85%'
        }
      ]
    };
  }

  async getGovernanceInfo() {
    return {
      votingPower: '0',
      activeProposals: 3,
      proposals: [
        {
          id: '001',
          title: 'Increase Staking Rewards by 2%',
          status: 'Active',
          endDate: '2025-08-30',
          forVotes: '2.5M',
          againstVotes: '450K',
          description: 'Proposal to increase staking rewards to attract more validators'
        },
        {
          id: '002',
          title: 'Add New Liquidity Pool: CLAYER/BNB',
          status: 'Active',
          endDate: '2025-09-05',
          forVotes: '1.8M',
          againstVotes: '320K',
          description: 'Create a new liquidity pool to expand cross-chain opportunities'
        },
        {
          id: '003',
          title: 'Reduce Transaction Fees',
          status: 'Pending',
          endDate: '2025-09-10',
          forVotes: '0',
          againstVotes: '0',
          description: 'Lower gas fees to improve user experience'
        }
      ]
    };
  }

  // Get DeFi protocol information
  getDeFiProtocols() {
    return [
      {
        name: '0G DEX',
        tvl: '4.2M',
        apy: '15.8%',
        description: 'Advanced AMM DEX with concentrated liquidity',
        category: 'Exchange',
        features: ['Spot Trading', 'Limit Orders', 'LP Farming']
      },
      {
        name: '0G Lending',
        tvl: '2.8M',
        apy: '12.3%',
        description: 'Overcollateralized lending and borrowing protocol',
        category: 'Lending',
        features: ['Lending', 'Borrowing', 'Flash Loans']
      },
      {
        name: '0G Staking',
        tvl: '8.1M',
        apy: '18.7%',
        description: 'Native 0G staking with validator rewards',
        category: 'Staking',
        features: ['Validator Staking', 'Delegation', 'Governance']
      },
      {
        name: '0G Yield',
        tvl: '3.5M',
        apy: '35.2%',
        description: 'Automated yield farming strategies',
        category: 'Yield Farming',
        features: ['Auto-compounding', 'Strategy Vaults', 'Multi-token Rewards']
      },
      {
        name: '0G Insurance',
        tvl: '1.2M',
        apy: '8.5%',
        description: 'Decentralized insurance for DeFi protocols',
        category: 'Insurance',
        features: ['Coverage Pools', 'Claims', 'Risk Assessment']
      }
    ];
  }
}

const defiServices = new DeFiServices();
export default defiServices;
