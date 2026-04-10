import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}) => {
  return (
    <div>
      <Navbar />
      <main className='mt-20'>{children}</main>
    </div>
  )
}

export default Layout