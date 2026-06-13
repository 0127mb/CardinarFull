"use client";
 
import { useState } from 'react';
 
export default function VerifyEmailPage() {
  const [resendCount, setResendCount] = useState(0);
  const [resendMsg, setResendMsg] = useState('');
  const [showMsg, setShowMsg] = useState(false);
 
  const resendMessages = [
    "📨 Email resent! (Check spam too, we're not judged by Google yet)",
    '📨 Okay okay, sent again. The Bugatti is still waiting.',
    "🚗 Bro... check your spam folder. The car isn't going anywhere.",
    "😭 Please. Just check your inbox. The Bugatti is crying.",
  ];
 
  const handleResend = () => {
    const idx = Math.min(resendCount, resendMessages.length - 1);
    setResendMsg(resendMessages[idx]);
    setResendCount((c) => c + 1);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3500);
  };
 
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '2rem 1rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(24,95,165,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
 
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes drive {
          0%   { transform: translateX(-100px) translateY(-50%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateX(540px) translateY(-50%); opacity: 0; }
        }
        @keyframes drive2 {
          0%   { transform: translateX(-100px) translateY(-50%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateX(540px) translateY(-50%); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(24,95,165,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(24,95,165,0); }
        }
        @keyframes dash {
          from { background-position: 0 0; }
          to   { background-position: 48px 0; }
        }
 
        .bounce-anim  { animation: bounce 1.3s ease-in-out infinite; }
        .float-anim   { animation: float 3.2s ease-in-out infinite; }
        .car1-anim    { animation: drive 3.8s linear infinite; }
        .car2-anim    { animation: drive2 3.8s linear 1.9s infinite; }
 
        .dot1 { animation: blink 1.3s infinite 0s; }
        .dot2 { animation: blink 1.3s infinite 0.25s; }
        .dot3 { animation: blink 1.3s infinite 0.5s; }
 
        .slide-in { animation: fadeSlideIn 0.6s ease both; }
        .slide-in-2 { animation: fadeSlideIn 0.6s ease 0.15s both; }
        .slide-in-3 { animation: fadeSlideIn 0.6s ease 0.3s both; }
        .slide-in-4 { animation: fadeSlideIn 0.6s ease 0.45s both; }
 
        .resend-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #888;
          padding: 6px 16px;
          border-radius: 20px;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 8px;
        }
        .resend-btn:hover {
          border-color: #185FA5;
          color: #5aa7f0;
          background: rgba(24,95,165,0.08);
        }
        .resend-btn:active {
          transform: scale(0.97);
        }
 
        .step-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          padding: 8px 0;
          border-bottom: 1px solid #1a1a1a;
        }
        .step-row:last-child { border-bottom: none; }
 
        .toast {
          animation: toastIn 0.3s ease;
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #ccc;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          z-index: 100;
          white-space: nowrap;
          max-width: 90vw;
        }
 
        .pulse-ring {
          animation: pulse 2s infinite;
        }
      `}</style>
 
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '480px',
          width: '100%',
          gap: 0,
        }}
      >
        {/* Big icon */}
        <div className="bounce-anim slide-in" style={{ fontSize: '72px', lineHeight: 1, marginBottom: '1rem' }}>
          📬
        </div>
 
        {/* Title */}
        <h1
          className="slide-in-2"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: '28px',
            fontWeight: 800,
            color: '#f0f0f0',
            margin: '0 0 8px',
            textAlign: 'center',
            letterSpacing: '-0.5px',
          }}
        >
          Check your inbox, boss 👀
        </h1>
 
        <p
          className="slide-in-2"
          style={{
            fontSize: '14px',
            color: '#666',
            margin: '0 0 1.75rem',
            textAlign: 'center',
            lineHeight: 1.7,
            maxWidth: '360px',
          }}
        >
          We sent a verification link to your email. Confirm it and we move on to very serious business.
        </p>
 
        {/* Speech bubble */}
        <div
          className="float-anim slide-in-3"
          style={{
            background: '#111',
            border: '1px solid #222',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            width: '100%',
            marginBottom: '1.75rem',
            position: 'relative',
          }}
        >
          {/* Tail */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #222',
            }}
          />
          <p style={{ margin: 0, fontSize: '14px', color: '#bbb', lineHeight: 1.7, textAlign: 'center' }}>
            Sir, I am waiting for your login
            <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginLeft: '6px', verticalAlign: 'middle' }}>
              <span className="dot1" style={{ width: 6, height: 6, borderRadius: '50%', background: '#185FA5', display: 'inline-block' }} />
              <span className="dot2" style={{ width: 6, height: 6, borderRadius: '50%', background: '#185FA5', display: 'inline-block' }} />
              <span className="dot3" style={{ width: 6, height: 6, borderRadius: '50%', background: '#185FA5', display: 'inline-block' }} />
            </span>
            <br />
            <br />
            After that{' '}
            <span style={{ color: '#5aa7f0', fontWeight: 700 }}>we can buy a Bugatti</span> 🏎️💨
          </p>
        </div>
 
        {/* Steps */}
        <div
          className="slide-in-3"
          style={{
            width: '100%',
            background: '#0f0f0f',
            border: '1px solid #1e1e1e',
            borderRadius: '14px',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div className="step-row">
            <span style={{ fontSize: '18px' }}>✅</span>
            <span style={{ color: '#1D9E75', fontWeight: 500 }}>Account created</span>
            <span style={{ color: '#333', marginLeft: 'auto', fontSize: '12px' }}>done</span>
          </div>
          <div className="step-row">
            <span style={{ fontSize: '18px' }}>📧</span>
            <span style={{ color: '#5aa7f0', fontWeight: 500 }}>Verify your email</span>
            <span
              className="pulse-ring"
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                background: 'rgba(24,95,165,0.15)',
                color: '#5aa7f0',
                padding: '2px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(24,95,165,0.3)',
              }}
            >
              waiting
            </span>
          </div>
          <div className="step-row">
            <span style={{ fontSize: '18px' }}>🏎️</span>
            <span style={{ color: '#444' }}>Buy Bugatti</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                color: '#333',
                padding: '2px 10px',
                background: '#1a1a1a',
                borderRadius: '20px',
                border: '1px solid #222',
              }}
            >
              🔒 locked
            </span>
          </div>
        </div>
 
        {/* Car track */}
        <div
          className="slide-in-4"
          style={{
            width: '100%',
            height: '56px',
            background: '#0d0d0d',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '6px',
          }}
        >
          {/* Animated dashed road */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              transform: 'translateY(-50%)',
              backgroundImage: 'repeating-linear-gradient(90deg, #222 0 24px, transparent 24px 48px)',
              animation: 'dash 0.8s linear infinite',
            }}
          />
          <span
            className="car1-anim"
            style={{ position: 'absolute', top: '50%', left: 0, fontSize: '28px', lineHeight: 1 }}
          >
            🏎️
          </span>
          <span
            className="car2-anim"
            style={{ position: 'absolute', top: '50%', left: 0, fontSize: '22px', lineHeight: 1 }}
          >
            🚗
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#333', margin: '0 0 1.5rem', textAlign: 'center' }}>
          Your future Bugatti is already warming up the engine
        </p>
 
        {/* Resend */}
        <div className="slide-in-4" style={{ fontSize: '13px', color: '#444', textAlign: 'center' }}>
          Didn&apos;t receive it?
          <button className="resend-btn" onClick={handleResend}>
            Resend email
          </button>
        </div>
      </div>
 
      {/* Toast */}
      {showMsg && (
        <div className="toast">
          {resendMsg}
        </div>
      )}
    </main>
  );
}
 
