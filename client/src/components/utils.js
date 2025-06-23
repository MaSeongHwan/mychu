/**
 * 디바운스 유틸리티 함수
 * 
 * 연속적인 이벤트 발생 시 지정된 시간이 지난 후에만 함수를 실행합니다.
 * 주로 검색 입력 같은 빈번한 이벤트에 사용하여 API 호출 횟수를 줄입니다.
 * 
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {Function} 디바운싱된 함수
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
