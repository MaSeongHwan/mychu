// Firebase 설정 (환경변수 사용)
// 실제 설정값은 환경변수에서 로드됩니다

// 환경변수에서 Firebase 설정을 가져오는 함수
const getConfigFromEnv = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
});

// Firebase 설정을 반환하는 함수
export const getFirebaseConfig = () => {
  try {
    // 환경변수에서 설정 가져오기
    const envConfig = getConfigFromEnv();
    
    // 필수 설정값이 있는지 확인
    const hasRequiredConfig = envConfig.apiKey && envConfig.projectId;
    if (hasRequiredConfig) {
      console.log('Firebase 설정을 환경변수에서 로드했습니다.');
      return envConfig;
    }
    
    // 테스트용 기본 설정 (실제 운영에서는 제거해야 함)
    console.warn('Firebase 환경변수가 설정되지 않았습니다. 테스트용 기본값을 사용합니다.');
    return {
      apiKey: 'test-api-key',
      authDomain: 'test-project.firebaseapp.com',
      projectId: 'test-project',
      storageBucket: 'test-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456',
      measurementId: 'G-XXXXXXXXXX'
    };
    
  } catch (error) {
    console.error('Firebase 설정 로드 실패:', error);
    throw new Error('Firebase 설정을 찾을 수 없습니다. 환경변수를 확인해주세요.');
  }
};

export default getFirebaseConfig;
