import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            🚀 Powered by 0G Mainnet Blockchain & AI
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">DeFi AI Assistant</span>
          </h1>
          
          <p className="hero-subtitle">
            Your intelligent companion for seamless DeFi operations. Chat naturally to manage your wallet, 
            execute transactions, explore yield opportunities, and learn about decentralized finance.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">$20M+</div>
              <div className="stat-label">Total Value Locked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">DeFi Protocols</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Support</div>
            </div>
          </div>
          
          <div className="hero-actions">
            <Link to="/chat" className="primary-button">
              Start Chatting 💬
            </Link>
            <button className="secondary-button" onClick={() => {
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }}>
              Learn More ↓
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="floating-card card-1">
              <div className="card-icon">💰</div>
              <div className="card-title">Balance: 1,250 0G</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🚀</div>
              <div className="card-title">Transaction Sent ✅</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📈</div>
              <div className="card-title">Staking APY: 18.7%</div>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">🌾</div>
              <div className="card-title">Yield Farming: 45.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need for DeFi</h2>
          <p className="section-subtitle">
            Powerful features wrapped in an intuitive conversational interface
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">💰</div>
            </div>
            <h3 className="feature-title">Smart Wallet Management</h3>
            <p className="feature-description">
              Check balances, view transaction history, and manage your assets with simple voice commands. 
              Real-time updates keep you informed.
            </p>
            <div className="feature-tags">
              <span className="tag">Balance Tracking</span>
              <span className="tag">Transaction History</span>
            </div>
          </div>
          
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🚀</div>
            </div>
            <h3 className="feature-title">Instant Transactions</h3>
            <p className="feature-description">
              Send 0G tokens securely with AI-powered gas optimization and recipient validation. 
              Smart fee estimation saves you money.
            </p>
            <div className="feature-tags">
              <span className="tag">Gas Optimization</span>
              <span className="tag">Smart Validation</span>
            </div>
          </div>
          
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🥩</div>
            </div>
            <h3 className="feature-title">Staking & Rewards</h3>
            <p className="feature-description">
              Discover staking opportunities with competitive APYs. Automated reward tracking and 
              compound interest calculations maximize your returns.
            </p>
            <div className="feature-tags">
              <span className="tag">Auto-compound</span>
              <span className="tag">18.7% APY</span>
            </div>
          </div>
          
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">�</div>
            </div>
            <h3 className="feature-title">Liquidity Pools</h3>
            <p className="feature-description">
              Provide liquidity to earn trading fees and additional rewards. Impermanent loss protection 
              and yield optimization strategies included.
            </p>
            <div className="feature-tags">
              <span className="tag">LP Rewards</span>
              <span className="tag">Fee Sharing</span>
            </div>
          </div>
          
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🌾</div>
            </div>
            <h3 className="feature-title">Yield Farming</h3>
            <p className="feature-description">
              Access high-yield farming opportunities with automated harvesting and reinvestment. 
              Risk assessment helps you make informed decisions.
            </p>
            <div className="feature-tags">
              <span className="tag">Auto-harvest</span>
              <span className="tag">Up to 89% APY</span>
            </div>
          </div>
          
          <div className="feature-card modern">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🤖</div>
            </div>
            <h3 className="feature-title">AI-Powered Insights</h3>
            <p className="feature-description">
              Get personalized DeFi strategies, risk assessments, and market insights. 
              Natural language processing understands your questions perfectly.
            </p>
            <div className="feature-tags">
              <span className="tag">Smart Analysis</span>
              <span className="tag">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Experience the Future of DeFi?</h2>
          <p className="cta-subtitle">
            Join thousands of users who are already using AI to optimize their DeFi strategies
          </p>
          <Link to="/chat" className="cta-button-large">
            Launch DeFi AI Assistant 🚀
          </Link>
          <div className="cta-features">
            <span>✅ No signup required</span>
            <span>✅ Secure & private</span>
            <span>✅ Instant access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
