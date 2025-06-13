const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Create firebase config object from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Create the config file content
const configContent = `// filepath: c:\\Users\\LG\\mychu\\client\\src\\firebase\\config.js
// 주의: 이 파일은 generate-firebase-config.js 스크립트로 자동 생성됩니다
// 직접 수정하지 마세요

export const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};
`;

// Write to the config file
const configFilePath = path.resolve(__dirname, '..', 'client', 'src', 'firebase', 'config.js');
fs.writeFileSync(configFilePath, configContent);

console.log(`Firebase config written to ${configFilePath}`);