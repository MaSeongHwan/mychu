// 수정 후
import { initializeApp }                  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics  }                  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
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
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase 설정 (자동 생성된 설정 파일에서 로드)
import { firebaseConfig } from './config.js';
import { API_BASE_URL } from '../api/config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// 이메일 회원가입
export async function signUpWithEmail(email, password, nickname, birthdate) {
    let userCredential = null;
    let user = null;
    try {
        // 1. Firebase Auth에 사용자 등록
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // 2. ID 토큰(JWT) 가져오기 - 이것은 서버에 인증하기 위한 용도
        const idToken = await user.getIdToken();
        
        // 3. 백엔드 서버에 사용자 등록 - JWT 토큰으로 인증, UID는 사용자 식별용
        const payload = {
            sha2_hash: user.uid, // 이것은 Firebase에서 제공하는 고유 사용자 ID (UID)
            email: email,
            nick_name: nickname || email.split('@')[0],
            birth: birthdate || null,
            terms_agreed_at: new Date().toISOString(),
            is_adult: false,
            sec_password: "0000"
        };
        
        const response = await fetch(`${API_BASE_URL}/users/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(payload)
        });
        
        // JSON 응답을 한 번만 파싱
        let responseJson;
        try {
            responseJson = await response.json();
        } catch (e) {
            // JSON이 아닌 응답을 처리
            throw new Error('서버 응답을 처리할 수 없습니다');
        }

        if (!response.ok) {
            throw new Error(responseJson.detail || '서버 등록 실패');
        }

        console.log("회원가입 성공:", responseJson);
        return responseJson;
    } catch (error) {
        console.error("회원가입 실패:", error);
        // Firebase Auth에서 생성된 사용자 삭제
        if (user && error.code !== 'auth/email-already-in-use') {
            try {
                await user.delete();
            } catch (deleteError) {
                console.error("사용자 삭제 실패:", deleteError);
            }
        }
        throw error;
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
                const datasetData = await datasetResponse.json();
                if (datasetData) {
                    userData.dataset = datasetData;
                    console.log("데이터셋 정보 가져오기 성공:", datasetData);
                }
            }
        } catch (datasetError) {
            console.error("데이터셋 정보 가져오기 실패:", datasetError);
            // 데이터셋이 없어도 로그인은 계속 진행
        }

        console.log("최종 로그인 성공:", userData);
        return userData;
    } catch (error) {
        console.error("로그인 실패:", error);
        throw error;
    }
}

// 이메일로 가입한 사용자가 전화번호 추가
export async function linkPhoneNumberToEmailUser(user, phoneNumber, recaptchaVerifier) {
    try {
        const provider = new PhoneAuthProvider(auth);
        const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
        return verificationId;
    } catch (error) {
        console.error("전화번호 연동 요청 실패:", error.code, error.message);
        throw error;
    }
}

// 전화번호 인증 코드 확인 및 연동
export async function confirmPhoneLink(user, verificationId, verificationCode) {
    try {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        await linkWithCredential(user, credential);
        console.log("전화번호 연동 성공");
        return true;
    } catch (error) {
        console.error("전화번호 연동 실패:", error.code, error.message);
        throw error;
    }
}

// 전화번호로 가입한 사용자가 이메일 추가
export async function linkEmailToPhoneUser(user, email, password) {
    try {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(user, credential);
        console.log("이메일 연동 성공");
        return true;
    } catch (error) {
        console.error("이메일 연동 실패:", error.code, error.message);
        throw error;
    }
}

// 이메일 중복 체크
export async function checkEmailExists(email) {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return methods.length > 0;
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
        }
          // 사용자 정보가 없으면 새로 등록
        if (response.status === 404) {
            const registerResponse = await fetch(`${API_BASE_URL}/users/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: user.uid,
                    email: user.email,
                    nickname: user.displayName || user.email.split('@')[0],
                    terms_agreed_at: new Date().toISOString()
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