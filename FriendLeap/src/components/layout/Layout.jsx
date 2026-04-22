import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children, isChat = false }) => {
  return (
    <div>
      {!isChat && <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default Layout