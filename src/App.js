import React, { useEffect, useState } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import StorageService from './services/StorageService';
import './App.css';

function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sharedMessages, setSharedMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryInfo, setRetryInfo] = useState(null);
  const [currentShareHash, setCurrentShareHash] = useState(null);
  const countdownIntervalRef = React.useRef(null);

  useEffect(() => {
    const shareHash = searchParams.get('share');
    if (shareHash) {
      setCurrentShareHash(shareHash);
      loadSharedSession(shareHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadSharedSession = async (rootHash, retryCount = 0, maxRetries = 12) => {
    setLoading(true);
    try {
      console.log(`📥 Loading shared session: ${rootHash}${retryCount > 0 ? ` (attempt ${retryCount + 1})` : ''}`);
      const result = await StorageService.downloadChatSession(rootHash);
      if (result.success) {
        setSharedMessages(result.data.messages);
        console.log('✅ Shared session loaded:', result.data.sessionName);
        setRetryInfo(null);
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        navigate('/chat');
      } else {
        // Session not found - offer retry after delay
        if (retryCount < maxRetries) {
          const delaySeconds = 30;
          console.log(`⏳ Session not indexed yet. Retrying in ${delaySeconds} seconds...`);
          setRetryInfo({
            error: result.error,
            retryCount: retryCount + 1,
            maxRetries,
            nextRetry: delaySeconds
          });
          
          // Clear previous interval if exists
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          
          // Start countdown
          let countdown = delaySeconds;
          countdownIntervalRef.current = setInterval(() => {
            countdown--;
            setRetryInfo(prev => prev ? { ...prev, nextRetry: countdown } : null);
            if (countdown <= 0) {
              clearInterval(countdownIntervalRef.current);
              loadSharedSession(rootHash, retryCount + 1, maxRetries);
            }
          }, 1000);
        } else {
          console.error('❌ Failed to load shared session after retries:', result.error);
          setRetryInfo({
            error: result.error,
            retryCount: retryCount + 1,
            maxRetries,
            nextRetry: 0,
            allRetriesFailed: true
          });
        }
      }
    } catch (error) {
      console.error('❌ Error loading shared session:', error);
      
      // Offer retry on error too
      if (retryCount < maxRetries) {
        setRetryInfo({
          error: error.message,
          retryCount: retryCount + 1,
          maxRetries,
          nextRetry: 30
        });
        
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
        
        let countdown = 30;
        countdownIntervalRef.current = setInterval(() => {
          countdown--;
          setRetryInfo(prev => prev ? { ...prev, nextRetry: countdown } : null);
          if (countdown <= 0) {
            clearInterval(countdownIntervalRef.current);
            loadSharedSession(rootHash, retryCount + 1, maxRetries);
          }
        }, 1000);
      } else {
        setRetryInfo({
          error: error.message,
          retryCount: retryCount + 1,
          maxRetries,
          allRetriesFailed: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRetry = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (currentShareHash) {
      loadSharedSession(currentShareHash);
    }
  };

  return (
    <div className="App">
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#6366f1',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '3rem' }}>⏳</div>
          <div>Loading shared chat session...</div>
          {retryInfo && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              maxWidth: '500px',
              textAlign: 'center',
              color: '#92400e'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ⏱️ Session Indexing in Progress
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                The file is being indexed on the 0G network. Retrying automatically...
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Attempt {retryInfo.retryCount} of {retryInfo.maxRetries}
              </div>
              {!retryInfo.allRetriesFailed && (
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                  Next retry in: {retryInfo.nextRetry}s
                </div>
              )}
              {retryInfo.allRetriesFailed && (
                <div style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#dc2626' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    ❌ Auto-retries exhausted
                  </div>
                  <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                    The file may still be indexing. You can:
                  </div>
                  <div style={{ fontSize: '0.8rem', textAlign: 'left', marginBottom: '1rem' }}>
                    <div>• Try manual retry below</div>
                    <div>• Wait 5 more minutes and refresh</div>
                    <div>• Check back later</div>
                  </div>
                  <button
                    onClick={handleManualRetry}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#d97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    🔄 Try Again Now
                  </button>
                </div>
              )}
              <div style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.8 }}>
                {!retryInfo.allRetriesFailed && '⏳ This is normal - 0G Storage takes 5-10 minutes to index new files'}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/chat" 
            element={<ChatInterface initialMessages={sharedMessages} />} 
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
