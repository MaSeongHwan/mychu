# Firebase 설정 가이드

이 프로젝트는 Firebase 설정을 두 가지 방법으로 지원합니다:

## 방법 1: firebase_config.js 파일 사용 (권장)

1. `client-react/src/services/firebase_config.js` 파일을 생성합니다:

```javascript
// 주의: 이 파일은 generate-firebase-config.js 스크립트로 자동 생성됩니다
// 직접 수정하지 마세요

export const firebaseConfig = {
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your-sender-id",
  "appId": "your-app-id",
  "measurementId": "your-measurement-id"
};
```

2. 이 파일은 `.gitignore`에 추가되어 있어 Git에 커밋되지 않습니다.

## 방법 2: 환경변수 사용

1. `.env.example` 파일을 복사해서 `.env.local` 파일을 만듭니다:

```bash
cp .env.example .env.local
```

2. `.env.local` 파일의 값들을 실제 Firebase 설정값으로 변경합니다:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## 우선순위

1. `firebase_config.js` 파일이 존재하면 해당 설정을 사용합니다.
2. `firebase_config.js` 파일이 없으면 환경변수에서 설정을 로드합니다.
3. 둘 다 없으면 오류가 발생합니다.

## 자동 생성 스크립트

프로젝트 루트의 `scripts/generate-firebase-config.js` 스크립트를 사용하면 Firebase 설정 파일을 자동으로 생성할 수 있습니다:

```bash
node scripts/generate-firebase-config.js
```

## 보안 주의사항

- `firebase_config.js` 파일과 `.env.local` 파일은 절대 Git에 커밋하지 마세요.
- 실제 Firebase 키는 팀원들과 안전한 방법으로 공유하세요.
- 프로덕션 환경에서는 환경변수를 사용하는 것을 권장합니다.
