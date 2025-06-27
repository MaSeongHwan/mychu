// Firebase npm 패키지 사용
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  PhoneAuthProvider,
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithCredential
} from 'firebase/auth';

// Firebase 설정 (환경변수 지원)
import { getFirebaseConfig } from './firebase.js';
import { API_BASE_URL } from '../utils/apiConfig.js';

// Firebase 초기화
const firebaseConfig = getFirebaseConfig();
console.log('🔥 Firebase 설정:', firebaseConfig);

// Firebase 설정 유효성 검사
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'test-api-key') {
  console.error('⚠️ Firebase API 키가 설정되지 않았거나 테스트 키입니다:', firebaseConfig.apiKey);
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// 이메일 회원가입
export async function signUpWithEmail(email, password, nickname, birthdate) {
    let userCredential = null;
    let user = null;
    try {
        console.log("Firebase 회원가입 시도:", email);
        
        // 1. Firebase Auth에 사용자 등록
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        console.log("Firebase 사용자 생성 성공:", user.uid);
        
        // 2. ID 토큰(JWT) 가져오기 - 이것은 서버에 인증하기 위한 용도
        const idToken = await user.getIdToken();
        
        // 3. 백엔드 서버에 사용자 등록 - JWT 토큰으로 인증, UID는 사용자 식별용
        const payload = {
            firebase_uid: user.uid,  // 백엔드에서 기대하는 필드명과 맞춤 (firebase_uid)
            sha2_hash: user.uid,     // 중요: 백엔드는 이 필드도 필요할 수 있음
            email: email,
            nickname: nickname || email.split('@')[0],  // 필드명 수정 (nick_name → nickname)
            birthdate: birthdate || null,                // 필드명 수정 (birth → birthdate)
            terms_agreed_at: new Date().toISOString(),
            is_adult: false,
            sec_password: "0000"
        };
        
        console.log(`백엔드 회원가입 요청: ${API_BASE_URL}/users/auth/register`);
        console.log("요청 데이터:", payload);
        
        const response = await fetch(`${API_BASE_URL}/users/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(payload)
        });
        
        // JSON 응답을 안전하게 파싱
        let responseJson;
        try {
            // Content-Type 확인
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                responseJson = await response.json();
            } else {
                const text = await response.text();
                responseJson = { detail: text || "알 수 없는 서버 오류" };
            }
        } catch (e) {
            console.error("JSON 파싱 오류:", e);
            responseJson = { detail: "서버 응답을 처리할 수 없습니다" };
        }

        if (!response.ok) {
            const errorMsg = responseJson.detail || '서버 등록 실패';
            console.error("백엔드 등록 실패:", response.status, errorMsg);
            throw new Error(errorMsg);
        }

        console.log("회원가입 성공:", responseJson);
        return responseJson;    } catch (error) {
        console.error("회원가입 실패:", error);
        
        // 사용자가 더 이해하기 쉬운 오류 메시지로 변환
        let betterErrorMessage;
        
        if (error.code) {
            // Firebase 인증 관련 오류
            switch(error.code) {
                case 'auth/email-already-in-use':
                    betterErrorMessage = '이미 사용 중인 이메일입니다.';
                    break;
                case 'auth/invalid-email':
                    betterErrorMessage = '유효하지 않은 이메일 형식입니다.';
                    break;
                case 'auth/weak-password':
                    betterErrorMessage = '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.';
                    break;
                case 'auth/network-request-failed':
                    betterErrorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
                    break;
                default:
                    betterErrorMessage = `Firebase 오류: ${error.message || error.code}`;
            }
        } 
        
        // 서버에서 온 오류일 수도 있음
        else if (error instanceof Error && error.message) {
            betterErrorMessage = error.message;
        }

        else {
            try {
                betterErrorMessage = JSON.stringify(error);
            } catch {
                betterErrorMessage = '알 수 없는 오류가 발생했습니다.';
            }
        }
        
        // Firebase Auth에서 생성된 사용자 삭제 (이미 존재하는 이메일 경우 제외)
        if (user && error.code !== 'auth/email-already-in-use') {
            try {
                console.log("Firebase 사용자 삭제 시도...");
                await user.delete();
                console.log("Firebase 사용자 삭제 성공");
            } catch (deleteError) {
                console.error("사용자 삭제 실패:", deleteError);
                // 사용자 삭제 실패해도 계속 진행
            }
        }
        
        // 원본 오류 대신 더 나은 메시지를 가진 새 오류를 throw
        const enhancedError = new Error(betterErrorMessage);
        enhancedError.originalError = error;
        throw enhancedError;
        console.error("🔥 회원가입 실패 (디버깅용):", error, JSON.stringify(error, null, 2));

    }
}

// 이메일 로그인
export async function signInWithEmail(email, password) {
    try {
        // 1. Firebase Auth로 로그인
        console.log("Firebase 로그인 시도:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase 로그인 성공:", user.uid);
        
        // 2. ID 토큰(JWT) 가져오기 - 서버에 인증하기 위한 용도
        const idToken = await user.getIdToken();
        
        // 3. 백엔드 서버에서 사용자 정보 가져오기 (JWT로 인증)
        console.log(`서버 인증 요청: ${API_BASE_URL}/users/auth/me`);
        const response = await fetch(`${API_BASE_URL}/users/auth/me`, {
            headers: {
                'Authorization': `Bearer ${idToken}` // JWT 토큰으로 인증
            }
        });

        // 응답 처리를 더 안전하게
        let userData = {};
        try {
            if (response.ok) {
                userData = await response.json();
                console.log("서버 인증 성공:", userData);
            } else {
                const errorData = await response.text();
                console.error("서버 인증 실패:", response.status, errorData);
                // 실패해도 계속 진행 (기본 사용자 정보만 반환)
                userData = { 
                    uid: user.uid, 
                    email: user.email,
                    displayName: user.displayName || email.split('@')[0]
                };
            }
        } catch (parseError) {
            console.error("응답 데이터 파싱 실패:", parseError);
            // 기본 사용자 정보만 반환
            userData = { 
                uid: user.uid, 
                email: user.email,
                displayName: user.displayName || email.split('@')[0]
            };
        }
          // 4. 데이터셋 정보 가져오기 (있는 경우) - 동일하게 JWT로 인증
        try {
            console.log(`데이터셋 정보 요청: ${API_BASE_URL}/users/auth/${user.uid}/dataset`);
            const datasetResponse = await fetch(`${API_BASE_URL}/users/auth/${user.uid}/dataset`, {
                headers: {
                    'Authorization': `Bearer ${idToken}` // JWT 토큰으로 인증
                }
            });

            if (datasetResponse.ok) {
                const contentType = datasetResponse.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const datasetData = await datasetResponse.json();
                    if (datasetData) {
                        userData.dataset = datasetData;
                        console.log("데이터셋 정보 가져오기 성공:", datasetData);
                    } else {
                        console.log("데이터셋 정보가 비어 있습니다.");
                    }
                } else {
                    console.log("데이터셋 응답이 JSON 형식이 아닙니다.");
                }
            } else if (datasetResponse.status === 404) {
                console.log("데이터셋 정보가 없습니다 (404)");
                userData.dataset = null;
            } else {
                console.warn(`데이터셋 정보 가져오기 실패: ${datasetResponse.status}`);
            }
        } catch (datasetError) {
            console.error("데이터셋 정보 가져오기 실패:", datasetError);
            // 데이터셋이 없어도 로그인은 계속 진행
        }

        console.log("최종 로그인 성공:", userData);
        
        // 로그인 성공 시 사용자 정보를 localStorage에 저장
        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            console.log('사용자 정보가 localStorage에 저장되었습니다:', userData);
        } catch (storageError) {
            console.error('localStorage 저장 실패:', storageError);
        }
        
        return userData;
    } catch (error) {
        console.error("로그인 실패:", error);
        throw error;
    }
}


// 이메일 중복 체크
export async function checkEmailExists(email) {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log("이메일에 사용 가능한 로그인 방식:", methods);
        
        // 이메일/비밀번호 방식으로 가입된 계정인지 확인
        // 더 정확한 확인을 위해 "password" 메서드가 있는지 명시적으로 체크
        return methods.includes("password");
    } catch (error) {
        console.error("이메일 체크 실패:", error.code, error.message);
        throw error;
    }
}

// 현재 로그인된 사용자 가져오기
export function getCurrentUser() {
    return auth.currentUser;
}

// 로그아웃
export async function signOut() {
    try {
        await auth.signOut();
        console.log("로그아웃 성공");
        return true;
    } catch (error) {
        console.error("로그아웃 실패:", error.code, error.message);
        throw error;
    }
}

// 현재 사용자의 데이터를 가져오거나 업데이트하는 함수
async function fetchOrUpdateUserData(user) {
    if (!user) return null;

    try {
        const idToken = await user.getIdToken();
          // 1. 현재 사용자 정보 가져오기
        const response = await fetch(`${API_BASE_URL}/users/auth/me`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
              // 2. 데이터셋 정보 가져오기
            const datasetResponse = await fetch(`${API_BASE_URL}/users/auth/${user.uid}/dataset`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (datasetResponse.ok) {
                const datasetData = await datasetResponse.json();
                if (datasetData) {
                    userData.dataset = datasetData;
                }
            }

            return userData;
        }          // 사용자 정보가 없으면 새로 등록
        if (response.status === 404) {
            console.log("사용자 정보 없음, 자동 등록 시도...");
            const registerResponse = await fetch(`${API_BASE_URL}/users/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: user.uid,
                    sha2_hash: user.uid, // 두 필드 모두 포함하여 백엔드 호환성 보장
                    email: user.email,
                    nickname: user.displayName || user.email.split('@')[0],
                    terms_agreed_at: new Date().toISOString(),
                    is_adult: false,
                    sec_password: "0000"
                })
            });

            if (registerResponse.ok) {
                return registerResponse.json();
            }
        }

        throw new Error('Failed to fetch or update user data');
    } catch (error) {
        console.error('Error fetching/updating user data:', error);
        throw error;
    }
}

// Auth 상태 변경 리스너 설정
export function initAuthStateListener(onUserDataChange) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // 사용자 데이터 가져오기 또는 업데이트
                const userData = await fetchOrUpdateUserData(user);
                onUserDataChange({ ...userData, isLoggedIn: true });
            } catch (error) {
                console.error('Error in auth state change:', error);
                onUserDataChange({ isLoggedIn: false, error });
            }
        } else {
            // 로그아웃 상태
            onUserDataChange({ isLoggedIn: false });
        }
    });
}

/**
 * 현재 인증된 사용자의 ID 토큰을 가져옵니다.
 * @returns {Promise<string>} Firebase ID 토큰
 * @throws {Error} 로그인되지 않은 경우 에러 발생
 */
export async function getCurrentUserToken() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('로그인이 필요합니다');
    }
    return await user.getIdToken();
}