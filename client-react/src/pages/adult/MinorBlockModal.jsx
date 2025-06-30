import React from 'react';
import './MinorBlockModal.css';

/**
 * 미성년자 접근 차단 모달 컴포넌트
 */
const MinorBlockModal = ({ onGoBack }) => {
  return (
    <div className="minor-block-modal active">
      <div className="minor-block-container">
        <div className="warning-icon">⚠️</div>
        <h2 className="minor-block-title">접근 제한</h2>
        <div className="minor-block-message">
          <p className="main-message">
            이 사이트는 성인용 콘텐츠를 포함하고 있습니다.
          </p>
          <p className="sub-message">
            만 19세 미만의 미성년자는 이용하실 수 없습니다.
          </p>
        </div>
        <div className="minor-block-actions">
          <button 
            className="go-back-button" 
            onClick={onGoBack}
            autoFocus
          >
            이전 페이지로 돌아가기
          </button>
        </div>
        <div className="legal-notice">
          <p>청소년보호법에 의해 만 19세 미만 청소년의 접근이 제한됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default MinorBlockModal;
