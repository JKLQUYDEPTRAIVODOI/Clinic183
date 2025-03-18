const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClass = 'rounded font-medium focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
    outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
  };
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6'
  };
  
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClass = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`;
  
  return (
    <button 
      type={type} 
      className={buttonClass} 
      disabled={disabled} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 