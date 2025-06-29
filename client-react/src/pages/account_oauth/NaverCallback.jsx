import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const NaverCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      console.log('✅ 네이버 로그인 성공: code =', code);
      // TODO: 서버에 code 전송 → 사용자 인증 처리
      // fetch('/api/naver/login', { method: 'POST', body: JSON.stringify({ code, state }) })

      alert('네이버 로그인 성공 (예시)');
      navigate('/main');
    } else {
      alert('네이버 로그인 실패');
      navigate('/account');
    }
  }, [searchParams, navigate]);

  return <div style={{ color: 'white', padding: '2rem' }}>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;
