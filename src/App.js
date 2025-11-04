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

  useEffect(() => {
    const shareHash = searchParams.get('share');
    if (shareHash) {
      loadSharedSession(shareHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadSharedSession = async (rootHash) => {
    setLoading(true);
    try {
      console.log(`📥 Loading shared session: ${rootHash}`);
      const result = await StorageService.downloadChatSession(rootHash);
      if (result.success) {
        setSharedMessages(result.data.messages);
        console.log('✅ Shared session loaded:', result.data.sessionName);
        // Automatically navigate to chat
        navigate('/chat');
      } else {
        console.error('❌ Failed to load shared session:', result.error);
        alert('❌ Could not load shared chat session. ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error loading shared session:', error);
      alert('❌ Error loading shared session: ' + error.message);
    } finally {
      setLoading(false);
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
          gap: '1rem'
        }}>
          <div style={{ fontSize: '3rem' }}>⏳</div>
          <div>Loading shared chat session...</div>
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
