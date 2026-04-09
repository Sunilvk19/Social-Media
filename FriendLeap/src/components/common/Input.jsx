import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Input = ({placeholder, className, containerClassName, value, onChange, type}) => {
  return (
    <div className={`relative group ${containerClassName || ''}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors hover:cursor-pointer" />
            </div>
        <input type={type} placeholder={placeholder} className={className} value={value} onChange={onChange} />
    </div>
  )
}

export default Input