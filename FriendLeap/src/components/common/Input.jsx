import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const Input = ({ placeholder,
  className = '',
  containerClassName = '',
  value,
  onChange,
  type = 'text',
  icon,
  name,
  id,
  disabled = false,
  required = false,
  autoFocus = false,
}) => {
    const inputClass = `w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner
     ${className || ''} ${icon ? 'pl-10' : ''}`;
    
  return (  
    <div className={`relative group ${containerClassName || ''}`}>
      {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={icon} className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors hover:cursor-pointer" />
            </div>
      )}
        <input 
        type={type}
        placeholder={placeholder}
        className={inputClass}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        />
    </div>
  )
}

export default Input;