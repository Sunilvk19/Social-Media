import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import Post from "./Pages/Post";
import Login from "./Pages/Login";
import Layout from "./components/layout/Layout";
import Profile from "./Pages/Profile";
import Chat from "./components/post/Chat";
import Circle from "./Pages/Circle";

const App = () => {
  const [isPostOpen, setIsPostOpen] = useState(false);

  const handleOpenPost = () => setIsPostOpen(true);
  const handleClosePost = () => setIsPostOpen(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <Layout onCreatePost={handleOpenPost}>
              <Home isPostOpen={isPostOpen} setIsPostOpen={setIsPostOpen} />
            </Layout>
          }
        />

        <Route
          path="/post"
          element={
            <Layout onCreatePost={handleOpenPost}>
              <Post />
            </Layout>
          }
        />

        <Route
          path="/explore"
          element={
              <Explore />
          }
        />
        <Route
          path="/messages"
          element={
              <Chat />
          }
        />
        <Route
          path="/circle"
          element={
              <Circle/>
          }
        />
        <Route
          path="/profile"
          element={
              <Profile />
          }
        />
      </Routes>
    
    </BrowserRouter>
  );
};

export default App;
