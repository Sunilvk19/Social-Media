import React, { useEffect, useState } from "react";
import { getMockUsers } from "../services/Mock";
import Button from "../components/common/Button";
import Post from "./Post";
import localforage from "localforage";

const Home = () => {
  const [currentUser, setcurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(4);
  const [isFollowing, setIsFollowing] = useState({});

  const handleFollowing = (id) => {
    setIsFollowing((prev) => {
      const updatedState = { ...prev, [id]: !prev[id] };
      localforage.setItem("Following_state", updatedState);
      return updatedState;
    });
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const [userData, mockData, postsData, followingData, userProfile] =
          await Promise.all([
            localforage.getItem("Current_user"),
            getMockUsers(),
            localforage.getItem("posts"),
            localforage.getItem("Following_state"),
            localforage.getItem("User_Profile"),
          ]);
        if (userData) {
          setcurrentUser({
            ...userData,
            image: userProfile?.image || null,
          });
        }
        if (mockData?.users) setUsers(mockData.users);
        if (postsData) setPosts(postsData);
        if (followingData) setIsFollowing(followingData);
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleSuggestion = () => {
    setCount(users.length);
  };

  return (
    <>
      {!loading && (
        <div className="min-h-screen bg-gray-50 pt-8 pb-5 font-sans">
          <div className="max-w-7/12xl mx-auto px-6 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block w-80 shrink-0 space-y-6 animate-in slide-in-from-left-8 duration-700">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-all">
                  <div className="h-28 bg-cyan-500 w-full group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="px-6 pb-6 relative">
                    <div className="flex justify-center -mt-12 mb-4">
                      <div className="w-22 h-22 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                        {currentUser?.image ? (
                          <img
                            src={currentUser.image}
                            alt="User_Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-amber-200 flex items-center justify-center text-4xl font-extrabold text-indigo-500 shadow-inner">
                            {currentUser?.name
                              ? currentUser.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        {currentUser?.name || "User"}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {currentUser?.email || "Email"}
                      </p>
                    </div>
                    <div className="flex justify-between text-center pt-2">
                      <div className="group/stat cursor-pointer">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {posts.filter(post => post.userId === currentUser?.id).length}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Posts
                        </p>
                      </div>
                      <div className="group/stat cursor-pointer">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {Object.values(isFollowing).filter(value => value === true).length}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Followers
                        </p>
                      </div>
                      <div className="group/stat cursor-pointer">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {currentUser?.following || 0}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Following
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex gap-4 overflow-x-auto hide-scrollbar snap-x">
                  <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0 snap-start">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-500 transition-all text-gray-400 group">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        +
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      Add Story
                    </span>
                  </div>
                </div>
                <div>
                  <Post onPostCreated={handleNewPost} />
                  {posts.map((post) => {
                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden mt-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold uppercase shadow-sm">
                            {post.authorName ? post.authorName.charAt(0) : "U"}
                          </div>
                          <h3 className="font-bold text-gray-800">
                            {post.authorName || "User"}
                          </h3>
                        </div>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="post"
                            className="w-full h-auto rounded-xl object-cover mb-4"
                          />
                        )}
                        <p className="text-gray-800 font-medium">{post.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800">
                      Suggestions For You
                    </h2>
                    <Button onClick={handleSuggestion}> See all</Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
                    {users.slice(0, count).map((user) => (
                      <div
                        key={user.id}
                        className="bg-gray-50 rounded-2xl p-4 text-center hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <img
                            src={user.image}
                            alt="User"
                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </span>

                        <span className="text-xs text-gray-500 mb-3">
                          @{user.username}
                        </span>

                        <Button
                          onClick={() => handleFollowing(user.id)}
                          className="w-full py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-gray-600 transition-all"
                        >
                          {isFollowing[user.id] ? "Following" : "Follow"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
