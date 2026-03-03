import { useState } from 'react';
import './styles/globals.css';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setPage('chat');
  };

  return (
    <>
      {page === 'landing' && (
        <LandingPage
          onGetStarted={() => setPage('auth')}
          onSignIn={() => setPage('auth')}
        />
      )}
      {page === 'auth' && (
        <AuthPage
          onBack={() => setPage('landing')}
          onSuccess={handleAuthSuccess}
        />
      )}
      {page === 'chat' && (
        <ChatPage user={user || { name: 'you' }} />
      )}
    </>
  );
}