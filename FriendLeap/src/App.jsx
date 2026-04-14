import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Explore from './Pages/Explore';
import Messages from './Pages/Messages';
import Post from './Pages/Post';
import Login from './Pages/Login';
import Layout from './components/layout/Layout'

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/home' element={<Layout><Home/></Layout>} />
        <Route path='/post' element={<Layout><Post/></Layout>} />
        <Route path='/explore' element={<Layout><Explore/></Layout>} />
        <Route path='/messages' element={<Layout><Messages/></Layout>} />
        <Route path='/profile' element={<Layout><Profile /></Layout>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
