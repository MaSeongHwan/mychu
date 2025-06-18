// 사용자 정보 및 내 리스트 관련 스크립트
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { firebaseConfig } from '../firebase/config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('마이리스트 스크립트 로드됨');

// 페이지 초기화 함수
async function initializePage() {
    try {
        // init.js에서 이미 헤더와 검색이 초기화되었으므로
        // 마이리스트 페이지 전용 기능만 초기화
        
        // 1. 사용자 정보 로드
        console.log('사용자 정보 로딩 중...');
        loadUserData();
        
        // 2. UI 이벤트 설정
        setupTabs();
        setupViewToggle();
        setupRemoveButtons();
        
        console.log('마이리스트 페이지 초기화 완료');
    } catch (error) {
        console.error('마이리스트 페이지 초기화 오류:', error);
    }
}

// DOM이 로드된 후 초기화 (init.js 이후에 실행됨)
document.addEventListener('DOMContentLoaded', () => {
    // init.js가 완료된 후 실행되도록 약간의 지연 추가
    setTimeout(initializePage, 100);
});

// 사용자 인증 상태 확인 및 사용자 데이터 로드
function loadUserData() {
    console.log("Firebase 인증 상태 확인 중...");
    
    // 로딩 상태 표시
    showLoadingState();
    
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
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('사용자 데이터 가져오기 오류:', error);
                showErrorState();
            }
        } else {
            console.log("로그인된 사용자 없음, 로그인 페이지로 리다이렉트");
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
    });
}

// 로딩 상태 표시
function showLoadingState() {
    const profileName = document.querySelector('.profile-name');
    const profileJoinDate = document.querySelector('.profile-join-date');
    const headerUserName = document.querySelector('.dropdown-header .user-name');
    
    if (profileName) {
        profileName.textContent = '로딩중...';
    }
    if (profileJoinDate) {
        profileJoinDate.textContent = '가입일: 로딩중...';
    }
    if (headerUserName) {
        headerUserName.textContent = '로딩중...';
    }
}

// 에러 상태 표시
function showErrorState() {
    const profileName = document.querySelector('.profile-name');
    const profileJoinDate = document.querySelector('.profile-join-date');
    const headerUserName = document.querySelector('.dropdown-header .user-name');
    
    if (profileName) {
        profileName.textContent = '사용자 정보를 불러올 수 없습니다';
    }
    if (profileJoinDate) {
        profileJoinDate.textContent = '가입일: 정보 없음';
    }
    if (headerUserName) {
        headerUserName.textContent = '사용자 정보 오류';
    }
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
    const profileJoinDate = document.querySelector('.profile-join-date');
    
    // 사용자 이름 설정 및 로깅
    console.log('사용자 데이터:', userData);
    
    if (headerUserName) {
        headerUserName.textContent = userData.nick_name + '님';
        console.log('헤더 이름 업데이트됨:', headerUserName.textContent);
    } else {
        console.error('헤더 사용자 이름 요소를 찾을 수 없음');
    }
    
    if (profileName) {
        profileName.textContent = userData.nick_name + '님';
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
        if (profileJoinDate) {
            profileJoinDate.textContent = joinDateFormatted;
            console.log('가입일 업데이트됨:', joinDateFormatted);
        }
    } else {
        if (profileJoinDate) {
            profileJoinDate.textContent = '가입일: 정보 없음';
        }
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
            
            // 탭 전환 시 통계 업데이트
            updateContentCount();
            
            // 탭에 따른 라벨 업데이트
            const statLabel = document.querySelector('.stat-label');
            if (statLabel) {
                if (tabId === 'watch-history') {
                    statLabel.textContent = '시청 기록';
                } else if (tabId === 'wishlist') {
                    statLabel.textContent = '찜한 콘텐츠';
                }
            }
        });
    });
}

// 리스트 뷰 타입 전환 기능 설정
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            const parentSection = this.closest('.content-section');
            const viewToggle = parentSection.querySelector('.view-toggle');
            const grid = parentSection.querySelector('.content-grid');
            const items = grid.querySelectorAll('.content-item');
            
            // 같은 섹션 내의 뷰 버튼들에서 active 클래스 제거
            viewToggle.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            // 그리드에 뷰 타입 클래스 적용
            grid.className = `content-grid ${viewType}-view`;

            // 리스트 뷰일 때 이미지/오버레이 숨기기, 그리드 뷰일 때 다시 보이기
            items.forEach(item => {
                const poster = item.querySelector('.item-poster');
                const overlay = item.querySelector('.item-overlay');
                if (viewType === 'list') {
                    if (poster) poster.style.display = 'none';
                    if (overlay) overlay.style.display = 'none';
                } else {
                    if (poster) poster.style.display = '';
                    if (overlay) overlay.style.display = '';
                }
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
            const title = contentItem.querySelector('.item-title').textContent;
            const isWatchHistory = contentItem.closest('#watch-history') !== null;
            
            const confirmMessage = isWatchHistory 
                ? `"${title}" 시청 기록을 삭제하시겠습니까?`
                : `"${title}"을(를) 찜 목록에서 제거하시겠습니까?`;
            
            if (confirm(confirmMessage)) {
                // 실제 서버 요청 구현 필요
                console.log(isWatchHistory ? '시청 기록 삭제:' : '찜 해제:', title);
                contentItem.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    contentItem.remove();
                    updateContentCount();
                }, 300);
            }
        });
    });
    
    // 재생 버튼 기능
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = this.closest('.content-item');
            const title = item.querySelector('.item-title').textContent;
            const isWatchHistory = item.closest('#watch-history') !== null;
            
            if (isWatchHistory) {
                alert(`"${title}" 이어보기를 시작합니다.`);
            } else {
                alert(`"${title}" 재생을 시작합니다.`);
            }
        });
    });
    
    // 정렬 기능
    const sortSelects = document.querySelectorAll('.sort-select');
    sortSelects.forEach(select => {
        select.addEventListener('change', function() {
            const sortType = this.value;
            const grid = this.closest('.content-section').querySelector('.content-grid');
            const items = Array.from(grid.querySelectorAll('.content-item'));
            const isWatchHistory = grid.closest('#watch-history') !== null;
            
            items.sort((a, b) => {
                switch(sortType) {
                    case 'name':
                        return a.querySelector('.item-title').textContent.localeCompare(b.querySelector('.item-title').textContent);
                    case 'genre':
                        const genreA = a.querySelector('.item-genre')?.textContent || '';
                        const genreB = b.querySelector('.item-genre')?.textContent || '';
                        return genreA.localeCompare(genreB);
                    case 'duration':
                        if (isWatchHistory) {
                            // 시청 진행률로 정렬
                            const progressA = parseInt(a.querySelector('.progress-fill')?.style.width || '0');
                            const progressB = parseInt(b.querySelector('.progress-fill')?.style.width || '0');
                            return progressB - progressA;
                        }
                        return 0;
                    case 'recent':
                    default:
                        return 0; // 기본 순서 유지
                }
            });
            
            // 정렬된 순서로 다시 배치
            items.forEach(item => grid.appendChild(item));
        });
    });
}

// 콘텐츠 개수 업데이트
function updateContentCount() {
    const wishlistCount = document.querySelectorAll('#wishlist .content-item').length;
    const wishlistBadge = document.getElementById('wishlistCountBadge');
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount + '개';
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
