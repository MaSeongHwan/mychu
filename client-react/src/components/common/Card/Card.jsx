import './Card.css';

/**
 * 재사용 가능한 카드 컴포넌트
 */
const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  onClick,
  ...props 
}) => {
  const cardClassName = `card card--${variant} ${className}`;
  
  return (
    <div 
      className={cardClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
