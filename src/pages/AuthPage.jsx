import { useState } from 'react';
import '../styles/auth.css';

// export default function AuthPage({ onBack, onSuccess }) {
//   const [tab, setTab] = useState('signin');
//   const [form, setForm] = useState({ name: '', email: '', password: '' });

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = () => {
//     if (onSuccess) onSuccess({ name: form.name || form.email.split('@')[0] || 'you' });
//   };

//   return (
//     <div className="auth-page">
//       {/* Left panel */}
//       <div className="auth-left">
//         <div className="logo">just<span>awake</span></div>
//         <div className="auth-quote">
//           <p className="quote-text">
//             "The night is the hardest time to be alive and 4am knows all my secrets."
//           </p>
//           <p className="quote-attr">— POPPY Z. BRITE</p>
//         </div>
//         <p className="footer-text">Local · Private · Always on</p>
//       </div>

//       {/* Right panel */}
//       <div className="auth-right">
//         <div className="auth-box">
//           <button className="back-link" onClick={onBack}>← back</button>

//           <h1 className="auth-title">
//             {tab === 'signin' ? 'Welcome back.' : 'Join us.'}
//           </h1>
//           <p className="auth-sub">
//             {tab === 'signin'
//               ? 'Pick up where you left off.'
//               : 'Takes 30 seconds. No card needed.'}
//           </p>

//           <div className="tabs">
//             <button
//               className={`tab ${tab === 'signin' ? 'active' : ''}`}
//               onClick={() => setTab('signin')}
//             >
//               Sign in
//             </button>
//             <button
//               className={`tab ${tab === 'signup' ? 'active' : ''}`}
//               onClick={() => setTab('signup')}
//             >
//               Sign up
//             </button>
//           </div>

//           {tab === 'signup' && (
//             <div className="form-group">
//               <label className="form-label">Name</label>
//               <input
//                 className="form-input"
//                 name="name"
//                 type="text"
//                 placeholder="what should we call you?"
//                 value={form.name}
//                 onChange={handle}
//               />
//             </div>
//           )}

//           <div className="form-group">
//             <label className="form-label">Email</label>
//             <input
//               className="form-input"
//               name="email"
//               type="email"
//               placeholder="you@email.com"
//               value={form.email}
//               onChange={handle}
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">Password</label>
//             <input
//               className="form-input"
//               name="password"
//               type="password"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={handle}
//             />
//           </div>

//           <button className="btn-submit" onClick={handleSubmit}>
//             {tab === 'signin' ? 'Sign in' : 'Create account'}
//           </button>

//           {tab === 'signin' && (
//             <>
//               <div className="auth-divider">
//                 <div className="divider-line" />
//                 <span className="divider-text">or</span>
//                 <div className="divider-line" />
//               </div>
//               <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', textAlign: 'center' }}>
//                 Don't have an account?{' '}
//                 <span className="switch-link" onClick={() => setTab('signup')}>
//                   Sign up free
//                 </span>
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { SignIn, SignUp } from '@clerk/clerk-react';

export default function AuthPage({ onBack }) {
  const [tab, setTab] = useState('signin');

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="logo">just<span>awake</span></div>
        <div className="auth-quote">
          <p className="quote-text">"The night is the hardest time to be alive..."</p>
          <p className="quote-attr">— POPPY Z. BRITE</p>
        </div>
      </div>

      <div className="auth-right">
        <button className="back-link" onClick={onBack}>← back</button>
        {tab === 'signin'
          ? <SignIn afterSignInUrl="/chat" />
          : <SignUp afterSignUpUrl="/chat" />
        }
        <button onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}>
          {tab === 'signin' ? 'Need an account?' : 'Already have one?'}
        </button>
      </div>
    </div>
  );
}