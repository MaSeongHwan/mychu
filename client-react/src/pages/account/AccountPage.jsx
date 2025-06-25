import { useState, useEffect } from 'react';
import './AccountPage.css';

/**
 * 계정 관리 페이지 컴포넌트
 * 사용자 계정 정보, 설정, 히스토리 등을 관리
 */
const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 실제 API 구현 시 사용자 정보 가져오기
        const response = await fetch('/api/users/me');
        
        if (!response.ok) {
          throw new Error('사용자 정보를 불러올 수 없습니다.');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('사용자 데이터 로드 오류:', err);
        setError(err.message);
        
        // 개발용 샘플 사용자 데이터
        setUser({
          name: '샘플 사용자',
          email: 'user@example.com',
          profileImage: 'https://via.placeholder.com/150',
          subscription: {
            plan: '프리미엄',
            expiryDate: '2024-12-31'
          },
          preferences: {
            language: '한국어',
            notifications: true
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리 로직
    console.log('로그아웃 요청');
    // 로그인 페이지로 리다이렉트
    // window.location.href = '/login';
  };

  const handlePreferencesUpdate = (newPreferences) => {
    // 사용자 설정 업데이트 로직
    console.log('설정 업데이트:', newPreferences);
  };

  if (loading) {
    return (
      <div className="account-page loading">
        <div className="account-loading">정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="account-page error">
        <div className="account-error">
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>내 계정</h1>
      </div>

      <div className="account-content">
        {/* 프로필 섹션 */}
        <section className="account-section profile-section">
          <h2>프로필</h2>
          <div className="profile-info">
            <div className="profile-image">
              <img 
                src={user?.profileImage || 'https://via.placeholder.com/150'} 
                alt="프로필 이미지" 
              />
            </div>
            <div className="profile-details">
              <h3>{user?.name || '사용자'}</h3>
              <p>{user?.email || 'email@example.com'}</p>
              <button className="edit-profile-btn">프로필 수정</button>
            </div>
          </div>
        </section>

        {/* 구독 정보 섹션 */}
        <section className="account-section subscription-section">
          <h2>구독 정보</h2>
          <div className="subscription-info">
            <div className="subscription-details">
              <div className="subscription-plan">
                <span className="label">현재 요금제:</span>
                <span className="value">{user?.subscription?.plan || '기본'}</span>
              </div>
              <div className="subscription-expiry">
                <span className="label">만료일:</span>
                <span className="value">{user?.subscription?.expiryDate || '정보 없음'}</span>
              </div>
            </div>
            <button className="subscription-btn">구독 관리</button>
          </div>
        </section>

        {/* 설정 섹션 */}
        <section className="account-section preferences-section">
          <h2>설정</h2>
          <div className="preferences-list">
            <div className="preference-item">
              <span className="label">언어</span>
              <select 
                value={user?.preferences?.language || '한국어'}
                onChange={(e) => handlePreferencesUpdate({ ...user?.preferences, language: e.target.value })}
              >
                <option value="한국어">한국어</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="preference-item">
              <span className="label">알림 설정</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={user?.preferences?.notifications || false}
                  onChange={(e) => handlePreferencesUpdate({ ...user?.preferences, notifications: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* 로그아웃 섹션 */}
        <section className="account-section logout-section">
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </section>
      </div>
    </div>
  );
};

export default AccountPage;
