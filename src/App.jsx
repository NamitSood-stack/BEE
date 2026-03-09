import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import './styles/globals.css';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [page, setPage] = useState('landing');

  // Once Clerk loads, if already signed in go straight to chat
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setPage('chat');
    }
  }, [isLoaded, isSignedIn]);

  // Don't render anything until Clerk has checked the session
  if (!isLoaded) return null;

  const userData = user
    ? { name: user.firstName || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'you' }
    : { name: 'you' };

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
          onSuccess={() => setPage('chat')}
        />
      )}
      {page === 'chat' && isSignedIn && (
        <ChatPage user={userData} />
      )}
    </>
  );
}