// 데이터 포맷팅 함수들
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('ko-KR', { ...defaultOptions, ...options }).format(new Date(date));
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}시간 ${remainingMinutes}분`;
  }
  return `${remainingMinutes}분`;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('ko-KR').format(number);
};

export const formatPercent = (value, total) => {
  const percent = (value / total) * 100;
  return `${Math.round(percent)}%`;
};

export const formatRating = (rating, maxRating = 5) => {
  const normalized = Math.min(Math.max(rating, 0), maxRating);
  return normalized.toFixed(1);
};

export const formatGenres = (genres) => {
  if (!Array.isArray(genres)) return '';
  return genres.join(', ');
};

export const formatTitle = (title, maxLength = 30) => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
};
