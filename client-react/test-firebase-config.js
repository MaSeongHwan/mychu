// Firebase 웹앱 설정을 가져오는 임시 테스트 스크립트
// bootcamp-19343 프로젝트의 실제 설정을 확인하기 위함

const testFirebaseConnection = async () => {
  const projectId = 'bootcamp-19343';
  
  // 일반적인 Firebase API 키 패턴들 시도
  const possibleApiKeys = [
    'AIzaSyAGjSbj8JQV5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', // 현재 사용 중
    'AIzaSyBKxvK-this-is-not-a-real-key-but-format', // 다른 패턴
    'AIzaSyDGvK3K9Jm2u5L8qJ7XQ8aB9rC4P1Z2M3n'  // 다른 패턴
  ];
  
  console.log('Firebase 프로젝트 정보:');
  console.log('Project ID:', projectId);
  console.log('Auth Domain:', `${projectId}.firebaseapp.com`);
  console.log('Storage Bucket:', `${projectId}.appspot.com`);
  
  // 실제 Firebase Console에서 확인해야 할 정보들
  console.log('\n실제 Firebase Console에서 확인 필요:');
  console.log('1. https://console.firebase.google.com/');
  console.log('2. bootcamp-19343 프로젝트 선택');
  console.log('3. 프로젝트 설정 > 일반 > 웹앱');
  console.log('4. SDK 설정 및 구성 정보 복사');
};

testFirebaseConnection();
