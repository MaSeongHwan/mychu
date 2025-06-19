// 사용자 정보 및 내 리스트 관련 스크립트
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { firebaseConfig } from '../firebase/config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log('마이리스트 스크립트 로드됨');

// ===== 더미 데이터 선언 (실제 서버 연동 전용) =====
const watchHistoryData = [
  {
    title: "오징어 게임",
    genre: "스릴러, 드라마",
    description: "456억 원의 상금을 차지하기 위해 목숨을 건 서바이벌 게임에 참가한 사람들의 이야기.",
    year: 2021,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/yACIAqAkSLkX4coHafpyLWAtQjw.jpg",
    actors: ["이정재", "박해수", "정호연", "위하준"],
    director: "황동혁",
    lastWatched: "2024.04.18 마지막 시청"
  },
  {
    title: "사랑의 불시착",
    genre: "로맨스, 코미디",
    description: "대한민국 재벌 상속녀와 북한 장교의 국경을 넘은 사랑 이야기.",
    year: 2020,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/mvy18bPg93JNLwTQHHP2ZjPYP0A.jpg",
    actors: ["현빈", "손예진", "서지혜", "김정현"],
    director: "이정효",
    lastWatched: "2024.04.10 마지막 시청"
  },
  {
    title: "이태원 클라쓰",
    genre: "드라마",
    description: "불의에 맞서며 이태원에서 자신의 꿈을 펼치는 청춘들의 성장기.",
    year: 2020,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/2tTMci6Hq99gkagpYe19RulNXRr.jpg",
    actors: ["박서준", "김다미", "유재명", "권나라"],
    director: "김성윤",
    lastWatched: "2024.04.08 마지막 시청"
  },
  {
    title: "슬기로운 의사생활",
    genre: "드라마, 의학",
    description: "20년 지기 친구인 5명의 의사들이 병원에서 펼치는 따뜻한 이야기.",
    year: 2020,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/cfI8eRuOqJpVnIro5GSEvbSlbph.jpg",
    actors: ["조정석", "유연석", "정경호", "김대명", "전미도"],
    director: "신원호",
    lastWatched: "2024.04.06 마지막 시청"
  },
  {
    title: "어벤져스: 엔드게임",
    genre: "액션, SF",
    description: "마블 히어로들이 인류의 운명을 걸고 타노스와 마지막 전투를 벌인다.",
    year: 2019,
    imageUrl: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    actors: ["로버트 다우니 주니어", "크리스 에반스", "스칼렛 요한슨"],
    director: "앤서니 루소, 조 루소",
    lastWatched: "2024.04.02 마지막 시청"
  },
  {
    title: "마이 네임",
    genre: "액션, 느와르",
    description: "아버지의 죽음에 대한 복수를 위해 조직에 들어가 경찰에 잠입한 여성의 이야기.",
    year: 2021,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ncAKKmr1sfFhQvn6LeGTY2QBge.jpg",
    actors: ["한소희", "박희순", "안보현"],
    director: "김진민",
    lastWatched: "2024.03.30 마지막 시청"
  }
];

const wishlistData = [
  {
    title: "오징어 게임",
    genre: "스릴러, 드라마",
    description: "456억 원의 상금을 차지하기 위해 목숨을 건 서바이벌 게임에 참가한 사람들의 이야기.",
    year: 2021,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/yACIAqAkSLkX4coHafpyLWAtQjw.jpg",
    actors: ["이정재", "박해수", "정호연", "위하준"],
    director: "황동혁",
    lastWatched: "2024.04.18 마지막 시청"
  },
  {
    title: "D.P.",
    genre: "드라마, 군대",
    description: "군무이탈 체포조(D.P.)가 군대 내 탈영병을 쫓으며 겪는 현실과 고뇌.",
    year: 2021,
    imageUrl: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ufovksqVTNogMdU5LlCVbJSiMVa.jpg",
    actors: ["정해인", "구교환", "김성균", "손석구"],
    director: "한준희",
    added: "2024.04.01 추가"
  },
  {
    title: "미스터 션샤인",
    genre: "드라마, 멜로",
    description: "신미양요 때 조선에서 미국으로 건너간 소년이 훗날 군인으로 돌아와 벌어지는 이야기.",
    year: 2018,
    imageUrl: "	https://media.themoviedb.org/t/p/w600_and_h900_bestv2/uSavP0BSfnyUaJe62f0ZTXIHLs8.jpg",
    actors: ["이병헌", "김태리", "유연석", "변요한", "김민정"],
    director: "이응복",
    added: "2024.03.29 추가"
  },
  {
    title: "인간수업",
    genre: "범죄, 드라마",
    description: "평범한 고등학생이 돈을 벌기 위해 범죄에 손을 대며 벌어지는 충격적인 이야기.",
    year: 2020,
    imageUrl: "	https://media.themoviedb.org/t/p/w600_and_h900_bestv2/2LTSggPYwuLvekQgvQfJ310auvP.jpg",
    actors: ["김동희", "정다빈", "박주현", "남윤수"],
    director: "김진민",
    added: "2024.03.27 추가"
  }
];

// 페이지 초기화 함수
async function initializePage() {
    try {
        // init.js에서 이미 헤더와 검색이 초기화되었으므로
        // 마이리스트 페이지 전용 기능만 초기화
        
        console.log('마이리스트 페이지 초기화 시작...');
        
        // 1. 사용자 정보 로드
        console.log('사용자 정보 로딩 중...');
        loadUserData();
        
        // 2. UI 이벤트 설정
        console.log('UI 이벤트 설정 중...');
        setupTabs();
        setupViewToggle();
        setupRemoveButtons();
        
        // 3. 초기 콘텐츠 개수 업데이트
        console.log('초기 콘텐츠 개수 업데이트...');
        updateContentCount();
        
        console.log('마이리스트 페이지 초기화 완료');
    } catch (error) {
        console.error('마이리스트 페이지 초기화 오류:', error);
    }
}

// DOM이 로드된 후 초기화 (init.js 이후에 실행됨)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializePage();
        renderWatchHistory();
        renderWishlist();
        setupRemoveButtons();
    }, 100);
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
    const tabNavigation = document.querySelector('.tab-navigation');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('탭 네비게이션 요소:', tabNavigation);
    console.log('탭 콘텐츠 수:', tabContents.length);
    
    if (!tabNavigation) {
        console.error('탭 네비게이션을 찾을 수 없음');
        return;
    }
    
    // 이벤트 위임을 사용하여 탭 버튼 클릭 처리
    tabNavigation.addEventListener('click', function(event) {
        const tabButton = event.target.closest('.tab-button');
        if (!tabButton) return;
        
        const tabId = tabButton.getAttribute('data-tab');
        console.log('클릭된 탭:', tabId);
        
        // 모든 탭 버튼 비활성화
        const allTabButtons = tabNavigation.querySelectorAll('.tab-button');
        allTabButtons.forEach(btn => btn.classList.remove('active'));
        
        // 모든 탭 콘텐츠 숨기기
        tabContents.forEach(content => {
            content.classList.remove('active');
            console.log('탭 콘텐츠 비활성화:', content.id);
        });
        
        // 선택한 탭 버튼 활성화
        tabButton.classList.add('active');
        console.log('탭 버튼 활성화:', tabId);
        
        // 선택한 탭 콘텐츠 표시
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log('탭 콘텐츠 활성화:', tabId);
        } else {
            console.error('탭 콘텐츠를 찾을 수 없음:', tabId);
        }
        
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
    
    // 초기 탭 상태 확인
    const activeTab = document.querySelector('.tab-button.active');
    const activeContent = document.querySelector('.tab-content.active');
    console.log('초기 활성 탭:', activeTab?.getAttribute('data-tab'));
    console.log('초기 활성 콘텐츠:', activeContent?.id);
    
    // 초기 상태가 없으면 첫 번째 탭을 활성화
    if (!activeTab && !activeContent) {
        const firstTab = tabNavigation.querySelector('.tab-button');
        const firstContent = document.querySelector('.tab-content');
        if (firstTab && firstContent) {
            firstTab.classList.add('active');
            firstContent.classList.add('active');
            console.log('첫 번째 탭을 기본으로 활성화');
        }
    }
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
            const grid = contentItem.closest('.content-grid');

            const confirmMessage = isWatchHistory 
                ? `"${title}" 시청 기록을 삭제하시겠습니까?`
                : `"${title}"을(를) 찜 목록에서 제거하시겠습니까?`;
            
            if (confirm(confirmMessage)) {
                // 실제 데이터에서도 삭제
                if (isWatchHistory) {
                    const idx = watchHistoryData.findIndex(item => item.title === title);
                    if (idx !== -1) watchHistoryData.splice(idx, 1);
                    renderWatchHistory();
                } else {
                    const idx = wishlistData.findIndex(item => item.title === title);
                    if (idx !== -1) wishlistData.splice(idx, 1);
                    renderWishlist();
                }
                updateContentCount();
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
    const wishlistItems = document.querySelectorAll('#wishlist .content-item');
    const watchHistoryItems = document.querySelectorAll('#watch-history .content-item');
    const wishlistTabBadge = document.getElementById('wishlistTabBadge');
    
    console.log('찜한 콘텐츠 개수:', wishlistItems.length);
    console.log('시청 기록 개수:', watchHistoryItems.length);
    
    if (wishlistTabBadge) {
        wishlistTabBadge.textContent = wishlistItems.length + '개';
    }
    
    // 시청 기록 탭의 기존 배지 제거
    const watchHistoryTabButton = document.querySelector('.tab-button[data-tab="watch-history"]');
    if (watchHistoryTabButton) {
        const existingBadge = watchHistoryTabButton.querySelector('.tab-badge');
        if (existingBadge) {
            existingBadge.remove();
            console.log('시청 기록 탭 배지 제거됨');
        }
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

function renderWatchHistory() {
    const grid = document.getElementById('watchHistoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    // 스켈레톤 UI
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-item';
        grid.appendChild(skeleton);
    }
    setTimeout(() => {
        grid.innerHTML = '';
        if (watchHistoryData.length === 0) {
            grid.innerHTML = `<div class=\"empty-state\">\n                <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='none' stroke='#6b7280' stroke-width='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18M9 21V9'/></svg>\n                <h3>시청 기록이 없습니다</h3>\n                <p>아직 시청한 콘텐츠가 없습니다.<br>지금 추천 콘텐츠를 확인해보세요!</p>\n                <button class=\"recommend-btn\" onclick=\"window.location.href='/main.html'\">추천 콘텐츠 보기</button>\n            </div>`;
            return;
        }
        watchHistoryData.forEach((item, idx) => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';
            contentItem.innerHTML = `
                <div class=\"item-poster\">
                    <img src=\"${item.imageUrl}\" alt=\"${item.title}\" class=\"poster-image\">
                    <div class=\"item-overlay\">
                      <button class=\"play-btn\">
                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"5 3 19 12 5 21 5 3\"></polygon></svg>
                      </button>
                      <button class=\"remove-btn\" title=\"기록 삭제\">
                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>
                      </button>
                    </div>
                    <div class=\"progress-bar\">
                      <div class=\"progress-fill\" style=\"width: ${item.progress ? item.progress : 100}%\"></div>
                    </div>
                </div>
                <div class=\"item-info\">
                    <h3 class=\"item-title\">${item.title} <span style='font-weight:400;font-size:0.95em;color:#aaa'>(${item.year})</span></h3>
                    <div class=\"item-meta\">
                      <span class=\"item-genre\">${item.genre}</span>
                      <span class=\"watch-progress${item.progress === 100 ? ' completed' : ''}\">${item.progress === 100 ? '완료' : (item.progress ? item.progress + '% 시청' : '완료')}</span>
                    </div>
                    <p class=\"item-desc\" style='margin:0.3em 0 0.5em 0;font-size:0.92em;color:#ccc;'>${item.description}</p>
                    <div style='font-size:0.88em;color:#b5b5b5;margin-bottom:0.2em;'>감독: <b>${item.director}</b></div>
                    <div style='font-size:0.88em;color:#b5b5b5;'>출연: ${item.actors.join(', ')}</div>
                    <p class=\"item-added-date\">${item.lastWatched}</p>
                </div>
            `;
            grid.appendChild(contentItem);
        });
    }, 500);
}

function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) return;
    grid.innerHTML = '';
    // 스켈레톤 UI
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-item';
        grid.appendChild(skeleton);
    }
    setTimeout(() => {
        grid.innerHTML = '';
        if (wishlistData.length === 0) {
            grid.innerHTML = `<div class=\"empty-state\">\n                <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' fill='none' stroke='#6b7280' stroke-width='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18M9 21V9'/></svg>\n                <h3>찜한 콘텐츠가 없습니다</h3>\n                <p>아직 찜한 콘텐츠가 없습니다.<br>지금 추천 콘텐츠를 확인해보세요!</p>\n                <button class=\"recommend-btn\" onclick=\"window.location.href='/main.html'\">추천 콘텐츠 보기</button>\n            </div>`;
            return;
        }
        wishlistData.forEach((item, idx) => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';
            contentItem.innerHTML = `
                <div class=\"item-poster\">
                    <img src=\"${item.imageUrl}\" alt=\"${item.title}\" class=\"poster-image\">
                    <div class=\"item-overlay\">
                      <button class=\"play-btn\">
                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"5 3 19 12 5 21 5 3\"></polygon></svg>
                      </button>
                      <button class=\"remove-btn\" title=\"찜 해제\">
                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>
                      </button>
                    </div>
                </div>
                <div class=\"item-info\">
                    <h3 class=\"item-title\">${item.title} <span style='font-weight:400;font-size:0.95em;color:#aaa'>(${item.year})</span></h3>
                    <div class=\"item-meta\">
                      <span class=\"item-genre\">${item.genre}</span>
                    </div>
                    <p class=\"item-desc\" style='margin:0.3em 0 0.5em 0;font-size:0.92em;color:#ccc;'>${item.description}</p>
                    <div style='font-size:0.88em;color:#b5b5b5;margin-bottom:0.2em;'>감독: <b>${item.director}</b></div>
                    <div style='font-size:0.88em;color:#b5b5b5;'>출연: ${item.actors.join(', ')}</div>
                    <p class=\"item-added-date\">${item.added}</p>
                </div>
            `;
            grid.appendChild(contentItem);
        });
    }, 500);
}