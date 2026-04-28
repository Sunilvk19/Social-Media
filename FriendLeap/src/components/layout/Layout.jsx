import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children, isChat = false, onCreatePost }) => {
  return (
    <div className='bg-linear-to-br from-brand-dark to-cyan-400'>
      <Navbar onCreatePost={onCreatePost} />
      <main>{children}</main>
    </div>
  )
}

export default Layout