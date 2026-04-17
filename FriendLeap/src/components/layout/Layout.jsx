import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}) => {
  return (
    <div>
      <Navbar />
      <main className='pt-2'>{children}</main>
      {/* <Outlet /> */}
    </div>
  )
}

export default Layout