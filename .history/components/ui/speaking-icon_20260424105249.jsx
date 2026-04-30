import React from 'react';

// This is a small circular icon with animated bars, similar to the provided image.
// You can adjust the color and size as needed.
const SpeakingIcon = ({ color = '#A3D86E', size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      background: color,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}
  >
    <div style={{ display: 'flex', gap: 2 }}>
      <div className="speaking-bar" style={{ height: size * 0.5, width: size * 0.12, background: '#222', borderRadius: 2, animation: 'bar1 1s infinite' }} />
      <div className="speaking-bar" style={{ height: size * 0.7, width: size * 0.12, background: '#222', borderRadius: 2, animation: 'bar2 1s infinite' }} />
      <div className="speaking-bar" style={{ height: size * 0.9, width: size * 0.12, background: '#222', borderRadius: 2, animation: 'bar3 1s infinite' }} />
      <div className="speaking-bar" style={{ height: size * 0.7, width: size * 0.12, background: '#222', borderRadius: 2, animation: 'bar2 1s infinite' }} />
      <div className="speaking-bar" style={{ height: size * 0.5, width: size * 0.12, background: '#222', borderRadius: 2, animation: 'bar1 1s infinite' }} />
    </div>
    <style jsx>{`
      @keyframes bar1 {
        0%, 100% { transform: scaleY(0.7); }
        50% { transform: scaleY(1.2); }
      }
      @keyframes bar2 {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.5); }
      }
      @keyframes bar3 {
        0%, 100% { transform: scaleY(0.5); }
        50% { transform: scaleY(1.4); }
      }
    `}</style>
  </div>
);

export default SpeakingIcon;
