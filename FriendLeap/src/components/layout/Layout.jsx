import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children, isChat = false, onCreatePost }) => {
  return (
    <div className=''>
      <Navbar onCreatePost={onCreatePost} />
      <main>{children}</main>
    </div>
  )
}

export default Layout