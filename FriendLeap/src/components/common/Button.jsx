import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Button = ({label, onClick, className, type = "button", disabled, variant = "primary", size = "md", icon}) => {
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
        {icon && <FontAwesomeIcon icon={icon} className='mr-2' />}
        {label}
    </button>
  )
}

export default Button;