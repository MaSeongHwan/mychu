import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dropdown.css';

/**
 * 장르 선택 드롭다운 컴포넌트
 */
const GenreDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = [
    '드라마', '예능/오락', '키즈/어린이', '액션/무협', '애니메이션',
    '시사/교양', '로맨스', '공포/스릴러', '코미디', '다큐/교양',
    'SF/판타지', '스포츠', '건강/생활정보', '교육/학습', '음악/공연', '기타'
  ];

  // URL에서 현재 선택된 장르 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentGenre = urlParams.get('genre') || '';
    setSelectedGenre(currentGenre);
  }, [location.search]);

  // 장르 선택 처리
  const handleGenreChange = (event) => {
    const selected = event.target.value;
    setSelectedGenre(selected);
    
    if (selected) {
      // 현재 경로에 장르 파라미터 추가
      const currentPath = location.pathname;
      navigate(`${currentPath}?genre=${encodeURIComponent(selected)}`);
    } else {
      // 장르 선택 해제 시 원래 페이지로 이동
      navigate(location.pathname);
    }
  };

  return (
    <div className="genre-dropdown-container">
      <div className="genre-select-wrapper">
        <select
          className="genre-select"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">장르 선택</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <div className="genre-icon">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GenreDropdown;
