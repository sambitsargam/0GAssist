import React, { useState, useEffect } from 'react';
import DeFiServices from '../services/DeFiServices';

const WalletStatus = () => {
  const [walletInfo, setWalletInfo] = useState({
    address: '',
    balance: '0',
    isConnected: false,
    loading: true
  });

  useEffect(() => {
    loadWalletInfo();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(loadWalletInfo, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadWalletInfo = async () => {
    try {
      setWalletInfo(prev => ({ ...prev, loading: true }));
      
      const address = DeFiServices.getWalletAddress();
      if (address) {
        const balance = await DeFiServices.getBalance();
        
        setWalletInfo({
          address: address,
          balance: balance.balance,
          isConnected: true,
          loading: false
        });
      } else {
        setWalletInfo({
          address: '',
          balance: '0',
          isConnected: false,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading wallet info:', error);
      setWalletInfo(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const refreshBalance = () => {
    loadWalletInfo();
  };

  if (walletInfo.loading) {
    return (
      <div className="wallet-info">
        <div className="loading">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          Loading wallet...
        </div>
      </div>
    );
  }

  if (!walletInfo.isConnected) {
    return (
      <div className="wallet-info">
        <span style={{ color: '#ef4444' }}>❌ Wallet not connected</span>
      </div>
    );
  }

  return (
    <div className="wallet-info">
      <div className="wallet-address">
        {DeFiServices.formatAddress(walletInfo.address)}
      </div>
      <div className="wallet-balance">
        {parseFloat(walletInfo.balance).toFixed(4)} 0G
      </div>
      <button 
        onClick={refreshBalance}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '0.25rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        title="Refresh balance"
      >
        🔄
      </button>
    </div>
  );
};

export default WalletStatus;
