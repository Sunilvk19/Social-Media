import React from 'react'

const Modal = ({isOpen, onClose, children}) => {
  if(!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black bg-opacity-50 h-screen w-screen' onClick={onClose}></div>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg z-50 max-h-screen overflow-y-auto'>{children}</div>
    </div>
  )
}

export default Modal;