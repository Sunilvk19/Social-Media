import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import Post from "./Pages/Post";
import Login from "./Pages/Login";
import Layout from "./components/layout/Layout";
import Profile from "./Pages/Profile";
import Chat from "./components/post/Chat";

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
            <Layout onCreatePost={handleOpenPost}>
              <Explore />
            </Layout>
          }
        />
        <Route
          path="/messages"
          element={
            <Layout onCreatePost={handleOpenPost} isChat={true}>
              <Chat />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout onCreatePost={handleOpenPost}>
              <Profile />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
