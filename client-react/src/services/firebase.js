// Firebase 설정 (환경변수 사용)
// 실제 설정값은 firebase_config.js 파일에서 로드됩니다

import { firebaseConfig } from './firebase_config.js';

// 환경변수 fallback을 위한 기본 설정
const defaultConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// firebase_config.js가 있으면 사용하고, 없으면 환경변수 사용
export const getFirebaseConfig = () => {
  try {
    // firebase_config.js에서 설정이 있는지 확인
    if (firebaseConfig && firebaseConfig.apiKey) {
      console.log('Firebase 설정을 firebase_config.js에서 로드했습니다.');
      return firebaseConfig;
    }
  } catch (error) {
    console.log('firebase_config.js 파일을 찾을 수 없습니다. 환경변수를 사용합니다.');
  }
  
  // 환경변수에서 설정 로드
  const hasEnvConfig = defaultConfig.apiKey && defaultConfig.projectId;
  if (hasEnvConfig) {
    console.log('Firebase 설정을 환경변수에서 로드했습니다.');
    return defaultConfig;
  }
  
  throw new Error('Firebase 설정을 찾을 수 없습니다. firebase_config.js 파일이나 환경변수를 확인해주세요.');
};

export default getFirebaseConfig;
