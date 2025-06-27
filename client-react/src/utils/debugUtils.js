/**
 * 브라우저 콘솔에 디버그 도구를 주입하는 유틸리티
 * 개발 중 디버깅을 돕기 위한 함수들을 포함합니다.
 */

/**
 * 디버깅 도구 설정
 * 이 함수는 개발 모드에서만 호출되어야 합니다.
 */
export const setupDebugTools = () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // 전역 디버그 객체 생성
  window._debug = {
    // 컴포넌트 상태 저장소
    componentStates: {},
    
    // 컴포넌트 상태 저장
    registerState: (componentName, state) => {
      window._debug.componentStates[componentName] = state;
      console.log(`[Debug] Registered state for ${componentName}`, state);
    },
    
    // API 응답 로그
    logApiResponse: (endpoint, response) => {
      console.log(`[API] Response from ${endpoint}:`, response);
    },
    
    // 모든 콘텐츠 섹션 새로고침
    refreshContentSections: () => {
      const event = new CustomEvent('refreshContentSections');
      window.dispatchEvent(event);
      console.log('[Debug] Content sections refresh triggered');
    },
    
    // 창 상태 도우미
    windowState: {
      dimensions: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      }),
      userAgent: navigator.userAgent,
      isOnline: navigator.onLine
    },
    
    // DOM 탐색기
    inspectElement: (selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`[Debug] No element found for selector: ${selector}`);
        return null;
      }
      
      console.log(`[Debug] Element for ${selector}:`, element);
      return element;
    },

    // 문제해결 도우미
    troubleshoot: {
      emptyContentSections: () => {
        const sections = document.querySelectorAll('.content-section');
        let report = `Found ${sections.length} content sections:\n`;
        
        sections.forEach((section, i) => {
          const title = section.querySelector('h2')?.textContent;
          const cards = section.querySelectorAll('.content-card').length;
          const hasError = section.querySelector('.error-message') !== null;
          const isLoading = section.querySelector('.loading-indicator') !== null;
          
          report += `${i+1}. "${title || 'Untitled'}" - ${cards} cards, `;
          report += `${isLoading ? 'LOADING, ' : ''}${hasError ? 'HAS ERROR' : 'no error'}\n`;
        });
        
        console.log(report);
      }
    }
  };
  
  console.log('[Debug] Debug tools initialized. Access with window._debug');
};

/**
 * 유틸리티 함수를 내보냅니다
 */
export default {
  setupDebugTools
};
