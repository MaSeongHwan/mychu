import './Loading.css';

/**
 * 로딩 인디케이터 컴포넌트
 */
const Loading = ({ 
  size = 'medium',
  text = '로딩 중...',
  showText = true
}) => {
  return (
    <div className={`loading loading--${size}`}>
      <div className="loading__spinner">
        <div className="loading__dot"></div>
        <div className="loading__dot"></div>
        <div className="loading__dot"></div>
      </div>
      {showText && <p className="loading__text">{text}</p>}
    </div>
  );
};

export default Loading;
