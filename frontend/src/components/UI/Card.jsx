const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b ${headerClassName}`}>
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 