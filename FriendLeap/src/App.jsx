import React from 'react'
import Navbar from './components/layout/Navbar'
import Home from './Pages/Home'
import Layout from './components/layout/Layout'
import Login from './Pages/Login'

const App = () => {
  return (
    <Layout>
      <Login />
      {/* <Home /> */}
    </Layout>
  )
}

export default App
