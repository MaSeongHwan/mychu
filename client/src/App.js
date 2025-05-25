import React from 'react';

function App() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="frame-48">
          <div className="hero-image"></div>
          <div className="hero-image-shadow"></div>
          <button className="btn sign-in-btn"> 로그인 </button>
        </div>
        <header className="header">
          <div className="logo"></div>
          <div className="combo-2">
            <div className="translate-button"> 회원가입 </div>
            <button className="btn sign-in-btn-header">Sign In</button>
          </div>
        </header>
        <div className="home-preview">
          <div className="frame-16">
            <h1 className="hero-title">Unlimited movies, TV shows, and more</h1>
            <p className="hero-subtitle">Watch anywhere. Cancel anytime.</p>
          </div>
          <div className="email-signup">
            <p className="signup-text">Ready to watch? Enter your email to create or restart your membership.</p>
            <div className="email-input-button">
              <div className="input-field">
                <span>Email address</span>
              </div>
              <button className="btn get-started-btn">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* 나머지 섹션들은 기존 HTML과 동일하게 유지 */}
    </div>
  );
}

export default App; 