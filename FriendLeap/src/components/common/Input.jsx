import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Input = forwardRef(({ 
  placeholder,
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
  onIconClick,
  onKeyDown,
  endAdornment,
  accept,
}, ref) => {
    const inputClass = `w-full ${type === 'file' ? '' : 'pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white'} transition-all shadow-inner
     ${className || ''} ${icon ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''}`;
    
  return (  
    <div className={`relative group ${containerClassName || ''}`}>
      {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none hover:cursor-pointer">
              <FontAwesomeIcon icon={icon} className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors hover:cursor-pointer" />
            </div>
      )}
        <input 
        type={type}
        accept={accept}
        placeholder={placeholder}
        className={inputClass}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        onClick={onIconClick}
        onKeyDown={onKeyDown}
        ref={ref}
        />
        {endAdornment && (
          <div
          className='flex items-center absolute inset-y-0 right-0 pr-3 pt-1 pb-1'
          > {endAdornment} </div>
        )}
    </div>
  )
});

export default Input;