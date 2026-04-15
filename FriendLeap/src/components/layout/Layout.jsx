import React from 'react'
import Navbar from './Navbar'
import { Outlet } from "react-router-dom";

const Layout = ({children}) => {
  return (
    <div>
      <Navbar />
      <main className='mt-20'>{children}</main>
      {/* <Outlet /> */}
    </div>
  )
}

export default Layout