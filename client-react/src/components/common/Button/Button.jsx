import './Button.css';

/**
 * 재사용 가능한 버튼 컴포넌트
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const className = `btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''}`;
  
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
