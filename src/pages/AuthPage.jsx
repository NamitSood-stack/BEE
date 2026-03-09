import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import '../styles/auth.css';

export default function AuthPage({ onBack }) {
  const [tab, setTab] = useState('signin');

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="logo">just<span>awake</span></div>
        <div className="auth-quote">
          <p className="quote-text">
            "The night is the hardest time to be alive and 4am knows all my secrets."
          </p>
          <p className="quote-attr">— POPPY Z. BRITE</p>
        </div>
        <p className="footer-text">Local · Private · Always on</p>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <button className="back-link" onClick={onBack}>← back</button>

          <h1 className="auth-title">
            {tab === 'signin' ? 'Welcome back.' : 'Join us.'}
          </h1>
          <p className="auth-sub">
            {tab === 'signin'
              ? 'Pick up where you left off.'
              : 'Takes 30 seconds. No card needed.'}
          </p>

          <div className="tabs">
            <button
              className={`tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign in
            </button>
            <button
              className={`tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Sign up
            </button>
          </div>


          <div className="clerk-wrapper">
            {tab === 'signin' ? (
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'clerk-root',
                    card: 'clerk-card',
                    headerTitle: 'clerk-hide',
                    headerSubtitle: 'clerk-hide',
                    socialButtonsBlockButton: 'clerk-social-btn',
                    formButtonPrimary: 'clerk-submit-btn',
                    formFieldInput: 'clerk-input',
                    formFieldLabel: 'clerk-label',
                    footerAction: 'clerk-hide',
                  },
                }}
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    rootBox: 'clerk-root',
                    card: 'clerk-card',
                    headerTitle: 'clerk-hide',
                    headerSubtitle: 'clerk-hide',
                    socialButtonsBlockButton: 'clerk-social-btn',
                    formButtonPrimary: 'clerk-submit-btn',
                    formFieldInput: 'clerk-input',
                    formFieldLabel: 'clerk-label',
                    footerAction: 'clerk-hide',
                  },
                }}
              />
            )}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', textAlign: 'center', marginTop: '16px' }}>
            {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <span className="switch-link" onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}>
              {tab === 'signin' ? 'Sign up free' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}