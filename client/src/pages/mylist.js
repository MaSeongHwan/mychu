// 사용자 정보 및 내 리스트 관련 스크립트
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { firebaseConfig } from '../firebase/config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('마이리스트 스크립트 로드됨');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 이벤트 발생');
    
    // 사용자 정보 로드
    loadUserData();
    
    // 탭 전환 처리
    setupTabs();
    
    // 리스트 뷰 타입 전환 처리
    setupViewToggle();
    
    // 찜 해제 버튼 이벤트 처리
    setupRemoveButtons();
});

// 사용자 인증 상태 확인 및 사용자 데이터 로드
function loadUserData() {
    console.log("Firebase 인증 상태 확인 중...");
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("사용자 로그인 확인됨:", user.email);
            try {
                // ID 토큰 가져오기
                const idToken = await user.getIdToken();
                console.log("ID 토큰 가져옴");
                
                // 백엔드 서버에서 사용자 정보 가져오기
                console.log("백엔드 서버에 사용자 정보 요청 중...");
                const response = await fetch('http://localhost:8000/users/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    console.log("사용자 정보를 성공적으로 가져옴:", userData);
                    updateUserInfo(userData);
                    
                    // 사용자의 데이터셋 정보 가져오기
                    if (userData.dataset_user_index) {
                        console.log("데이터셋 정보 로드 중...");
                        loadUserDatasetInfo(userData.dataset_user_index);
                    } else {
                        console.warn("사용자에게 dataset_user_index가 없음");
                    }
                } else {
                    console.error('사용자 데이터 가져오기 실패:', response.status, response.statusText);
                    // 로그인 페이지로 리다이렉트
                    window.location.href = '/login.html';
                }
            } catch (error) {
                console.error('사용자 데이터 가져오기 오류:', error);
            }
        } else {
            console.log("로그인된 사용자 없음, 로그인 페이지로 리다이렉트");
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            window.location.href = '/login.html';
        }
    });
}

// 사용자의 데이터셋 정보 가져오기
async function loadUserDatasetInfo(userIndex) {
    try {
        const response = await fetch(`http://localhost:8000/users/${userIndex}`);
        
        if (response.ok) {
            const datasetInfo = await response.json();
            updateUserStats(datasetInfo);
        } else {
            console.error('Failed to fetch user dataset info');
        }
    } catch (error) {
        console.error('Error fetching user dataset info:', error);
    }
}

// 사용자 정보로 UI 업데이트
function updateUserInfo(userData) {
    // 헤더 드롭다운의 사용자 이름
    const headerUserName = document.querySelector('.dropdown-header .user-name');
    
    // 프로필 섹션의 사용자 이름과 이메일
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    
    // 사용자 이름 설정 및 로깅
    console.log('사용자 데이터:', userData);
    
    if (headerUserName) {
        headerUserName.textContent = userData.nickname + '님';
        console.log('헤더 이름 업데이트됨:', headerUserName.textContent);
    } else {
        console.error('헤더 사용자 이름 요소를 찾을 수 없음');
    }
    
    if (profileName) {
        profileName.textContent = userData.nickname + '님';
        console.log('프로필 이름 업데이트됨:', profileName.textContent);
    } else {
        console.error('프로필 이름 요소를 찾을 수 없음');
    }
    
    if (profileEmail) {
        profileEmail.textContent = userData.email;
    }
    
    // 가입일 포맷팅
    if (userData.created_at) {
        const joinDate = new Date(userData.created_at);
        const joinDateFormatted = `가입일: ${joinDate.getFullYear()}년 ${joinDate.getMonth() + 1}월 ${joinDate.getDate()}일`;
        const profileJoinDate = document.querySelector('.profile-join-date');
        if (profileJoinDate) profileJoinDate.textContent = joinDateFormatted;
    }
      // 로그아웃 버튼 이벤트 핸들러 설정
    document.querySelectorAll('.dropdown-item').forEach(button => {
        // 버튼 텍스트에서 공백과 줄바꿈 제거
        const buttonText = button.textContent.replace(/\s+/g, ' ').trim();
        console.log('드롭다운 아이템 텍스트:', buttonText);
        
        // SVG 이후의 텍스트만 검사
        if (buttonText.includes('로그아웃')) {
            button.addEventListener('click', handleLogout);
            console.log('로그아웃 버튼 이벤트 핸들러 설정됨');
        }
    });
    
    // 로그아웃 버튼을 직접 선택해서 이벤트 핸들러 설정 (백업 방식)
    const logoutLinks = Array.from(document.querySelectorAll('.dropdown-item')).filter(
        link => link.innerHTML.includes('로그아웃') || 
               (link.querySelector('svg') && link.textContent.trim().includes('로그아웃'))
    );
    
    console.log('발견된 로그아웃 링크 수:', logoutLinks.length);
    logoutLinks.forEach(link => {
        link.removeEventListener('click', handleLogout); // 중복 방지를 위해 기존 핸들러 제거
        link.addEventListener('click', handleLogout);
        console.log('로그아웃 링크에 이벤트 핸들러 직접 설정됨');
    });
}

// 로그아웃 처리
async function handleLogout(event) {
    event.preventDefault();
    
    try {
        console.log("Logging out user...");
        await auth.signOut();
        console.log("User logged out successfully");
        // 로그아웃 후 로그인 페이지로 리다이렉트
        window.location.href = '/login.html';
    } catch (error) {
        console.error('로그아웃 실패:', error);
        alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 탭 전환 기능 설정
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 선택한 탭 버튼 활성화
            this.classList.add('active');
            
            // 선택한 탭 콘텐츠 표시
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 리스트 뷰 타입 전환 기능 설정
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const contentGrids = document.querySelectorAll('.content-grid');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // 모든 뷰 버튼 비활성화
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // 선택한 뷰 버튼 활성화
            this.classList.add('active');
            
            // 콘텐츠 그리드 뷰 타입 변경
            contentGrids.forEach(grid => {
                grid.className = `content-${viewType}`;
            });
        });
    });
}

// 찜 해제 버튼 이벤트 처리
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const contentItem = this.closest('.content-item');
            
            if (contentItem) {
                // 실제 서버 요청 구현 필요
                console.log('찜 해제:', contentItem.querySelector('.item-title').textContent);
                contentItem.remove();
                
                // 찜한 콘텐츠 수 업데이트
                updateContentCount();
            }
        });
    });
}

// 콘텐츠 개수 업데이트
function updateContentCount() {
    const wishlistCount = document.querySelector('#wishlistGrid').querySelectorAll('.content-item').length;
    const statNumber = document.querySelector('.stat-number');
    
    if (statNumber) {
        statNumber.textContent = wishlistCount;
    }
}

// 사용자 통계 업데이트
function updateUserStats(datasetInfo) {
    console.log('사용자 데이터셋 정보:', datasetInfo);
    
    const statItems = document.querySelectorAll('.stat-item');
    console.log('통계 항목 수:', statItems.length);
    
    if (statItems.length >= 3 && datasetInfo) {
        // 찜한 콘텐츠 수 - cnt 필드로 업데이트
        if (datasetInfo.cnt !== undefined) {
            const wishlistStatNumber = statItems[0].querySelector('.stat-number');
            if (wishlistStatNumber) {
                wishlistStatNumber.textContent = datasetInfo.cnt;
                console.log('찜한 콘텐츠 수 업데이트:', datasetInfo.cnt);
            }
        }
        
        // 시청 시간 - use_tms 필드로 업데이트, 시간 단위로 포맷팅
        if (datasetInfo.use_tms !== undefined) {
            const viewTimeStatNumber = statItems[2].querySelector('.stat-number');
            // use_tms는 분 단위로 저장된다고 가정
            const viewHours = Math.floor(datasetInfo.use_tms / 60);
            if (viewTimeStatNumber) {
                viewTimeStatNumber.textContent = `${viewHours}`;
                console.log('시청 시간 업데이트:', viewHours, '시간');
            }
        }
        
        // 구매한 콘텐츠 수 업데이트 (예시)
        const purchasedStatNumber = statItems[1].querySelector('.stat-number');
        if (purchasedStatNumber && datasetInfo.cnt !== undefined) {
            // 예시: 찜한 콘텐츠의 1/3을 구매했다고 가정
            const purchasedCount = Math.floor(datasetInfo.cnt / 3);
            purchasedStatNumber.textContent = purchasedCount;
            console.log('구매한 콘텐츠 수 업데이트:', purchasedCount);
        }
    } else {
        console.error('통계 항목을 찾을 수 없거나 데이터셋 정보가 없음');
    }
}

// 디버그용 테스트 함수 - Firebase 인증 없이 UI 테스트
function testUserInterface() {
    console.log('테스트 모드로 UI 업데이트 중...');
    
    // 테스트 사용자 데이터
    const mockUserData = {
        id: 1,
        nickname: '테스트사용자',
        email: 'test@example.com',
        firebase_uid: 'test123',
        dataset_user_index: 1,
        created_at: '2023-01-01T00:00:00.000Z'
    };
    
    // 테스트 데이터셋 정보
    const mockDatasetInfo = {
        user_index: 1,
        age_avg: 30,
        main_channels: ["넷플릭스", "왓챠"],
        use_tms: 480, // 8시간 (분 단위)
        cnt: 24
    };
    
    // UI 업데이트
    updateUserInfo(mockUserData);
    updateUserStats(mockDatasetInfo);
    
    console.log('테스트 모드로 UI 업데이트 완료');
}

// 페이지 URL에 ?test=1 파라미터가 있으면 테스트 모드 활성화
if (window.location.search.includes('test=1')) {
    console.log('테스트 모드 활성화됨');
    setTimeout(testUserInterface, 500); // 페이지 로드 후 약간의 지연을 두고 테스트 실행
}
