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

        <Route element={<Layout/>} >
          <Route path='/home' element={<Home/>} />
          <Route path='/post' element={<Post/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/messages' element={<Messages/>} />
        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
