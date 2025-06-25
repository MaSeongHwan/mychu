const NAVER_CLIENT_ID = "처드야";
const KAKAO_CLIENT_ID = "노션보고 바꿔줘 부탁해~";

/* 기존 이메일 로그인*/
document.querySelector('.account-btn.welllist')?.addEventListener('click', () => {
  window.location.href = "/";
});

/* 네이버 로그인*/
document.getElementById("naverLoginBtn").addEventListener("click", () => {
  const clientId = NAVER_CLIENT_ID;
  const redirectUri = encodeURIComponent("http://localhost:8080/login/naver/code");
  const state = generateRandomState(); // CSRF 방지용 랜덤 문자열
  
  // 생성한 state 값을 세션스토리지 등에 저장해두면 나중에 비교 가능
  sessionStorage.setItem("naver_auth_state", state);

  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  // 네이버 로그인 페이지로 이동
  window.location.href = naverLoginUrl;
});

// 랜덤 문자열 생성 함수
function generateRandomState(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/* 카카오 로그인*/
document.getElementById("kakaoLoginBtn").addEventListener("click", () => {
  const kakaoClientId = KAKAO_CLIENT_ID;
  const redirectUri = encodeURIComponent("http://localhost:8080/login/kakao/code");

  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUri}`;

  window.location.href = kakaoLoginUrl;
});
