const config = {
    // 개발 환경에서는 백엔드 서버의 URL을 사용
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    
    // 서버 API의 기본 엔드포인트
    apiEndpoints: {
        users: '/users',
        auth: '/users/auth',
        assets: '/assets',
        recommendations: '/recommendations'
    }
    
    // Firebase 설정은 자동 생성되는 client/src/firebase/config.js 파일을 통해 로드됩니다.
    // 보안을 위해 Firebase 설정은 환경 변수를 통해 관리합니다.
};

export default config; 