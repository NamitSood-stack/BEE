import '../styles/landing.css';
import ChatPreview from '../components/ChatPreview';

export default function LandingPage({ onGetStarted, onSignIn }) {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="logo">Kind<span>eled</span></div>
        <div className="nav-links">
          <button className="nav-link" onClick={onSignIn}>Sign in</button>
          <button className="btn-primary" onClick={onGetStarted}>Get started</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          Local & private — runs on your device
        </div>

        <h1 className="hero-title">
          A Calm Companion
        </h1>

        <p className="hero-sub">
          Not a therapist. Not an assistant. Just a calm presence when
          the night gets quiet and your thoughts get loud.
        </p>

        <div className="hero-actions">
          <button className="btn-large" onClick={onGetStarted}>Start talking</button>
          <button className="btn-ghost" onClick={onSignIn}>Sign in</button>
        </div>

        <div className="hero-visual">
          <ChatPreview />
        </div>
      </section>

      <section className="features">
        <div className="features-inner">
          <p className="section-label">Why it's different</p>
          <h2 className="section-title">
            Built for the hours when everything feels heavier
          </h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <div className="feature-title">Fully private</div>
              <p className="feature-desc">
                Runs entirely on your machine via Ollama. Nothing leaves
                your device. No logs, no cloud, no one listening.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <div className="feature-title">No performance required</div>
              <p className="feature-desc">
                Say whatever's on your mind. No need to be articulate or
                make sense. It just talks back like a person would.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-title">Low-key by design</div>
              <p className="feature-desc">
                No motivational speeches. No structured advice. Just short,
                natural responses that don't try too hard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="logo">Kind<span>eled</span></div>
        <p className="footer-text">Local AI companion. Private by default.</p>
      </footer>
    </div>
  );
}