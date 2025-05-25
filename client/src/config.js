const config = {
    // 개발 환경에서는 백엔드 서버의 URL을 사용
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
};

export default config; 