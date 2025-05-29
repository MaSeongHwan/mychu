import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    PhoneAuthProvider,
    linkWithCredential,
    EmailAuthProvider,
    fetchSignInMethodsForEmail,
    signInWithCredential
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

// 이메일 회원가입
export async function signUpWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("이메일 회원가입 성공:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("이메일 회원가입 실패:", error.code, error.message);
        throw error;
    }
}

// 전화번호 회원가입
export async function signUpWithPhone(phoneNumber, recaptchaVerifier) {
    try {
        const provider = new PhoneAuthProvider(auth);
        const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
        return verificationId;
    } catch (error) {
        console.error("전화번호 인증 요청 실패:", error.code, error.message);
        throw error;
    }
}

// SMS 코드 확인 및 회원가입 완료
export async function confirmPhoneSignUp(verificationId, verificationCode) {
    try {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        const userCredential = await signInWithCredential(auth, credential);
        console.log("전화번호 회원가입 성공:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("전화번호 회원가입 실패:", error.code, error.message);
        throw error;
    }
}

// 이메일 로그인
export async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("로그인 성공:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("로그인 실패:", error.code, error.message);
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