const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  inputClassName = '',
  labelClassName = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
          ${error ? 'border-red-500' : ''} 
          ${inputClassName}
        `}
        required={required}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 