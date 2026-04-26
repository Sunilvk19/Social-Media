import React, { useEffect, useState } from "react";
import { getMockUsers, getMockPosts } from "../services/Mock";
import { getRealUsers } from "../services/User";

import Button from "../components/common/Button";
import Post from "./Post";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(6);
  const [isFollowing, setIsFollowing] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const Icons = {
    Zap: ({ className, fill = "none" }) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}><path d="M4 14.89 14 3v9.11L20 9.11 10 21v-9.11Z"/></svg>
    ),
  };

  const handleLike = (id) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.map((post) => {
          if (post.id === id) {
            if (newSet.has(id)) {
              newSet.delete(id);
              return { ...post, like: post.like - 1 };
            } else {
              newSet.add(id);
              return { ...post, like: post.like + 1 };
            }
          }
          return post;
        });
        localforage.setItem(`posts_${currentUser.id}`, updatedPosts);
        return updatedPosts;
      });
      localforage.setItem(`liked_posts_${currentUser.id}`, Array.from(newSet));
      return newSet;
    });
  };

  const handleFollowing = async (id) => {
    setIsFollowing((prev) => {
      const updatedState = { ...prev, [id]: !prev[id] };
      localforage.setItem(`Following_state_${currentUser.id}`, updatedState);
      return updatedState;
    });
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const userData = await localforage.getItem("Current_user");
        if (!userData) return;
        setCurrentUser(userData);

        const [mockPosts, mockUsers, realUsers] = await Promise.all([
          getMockPosts(),
          getMockUsers(),
          getRealUsers(),
        ]);

        const totalUsers = [...realUsers, ...mockUsers.users];
        setUsers(totalUsers);
        
        const localPosts = await localforage.getItem(`posts_${userData.id}`);
        if (localPosts) {
          setPosts(localPosts);
        } else {
          const postsRes = await getMockPosts();
          if (postsRes?.posts) {
            setPosts(postsRes.posts);
            await localforage.setItem(`posts_${userData.id}`, postsRes.posts);
          }
        }
        
        const [followingData, userProfile, likedData] = await Promise.all([
          localforage.getItem(`Following_state_${userData.id}`),
          localforage.getItem(`User_Profile_${userData.id}`),
          localforage.getItem(`liked_posts_${userData.id}`),
        ]);
        
        if (userProfile?.image) {
          setCurrentUser((prev) => ({
            ...prev,
            image: userProfile.image,
          }));
        }
        if (followingData) setIsFollowing(followingData);
        if (likedData) setLikedPosts(new Set(likedData));
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      localforage.setItem(`posts_${currentUser.id}`, updated);
      return updated;
    });
  };

  const filteredUsers = users.filter((user) =>
    user.id !== currentUser.id && !isFollowing[user.id]);

  const followingUsersList = users.filter((user) => isFollowing[user.id]);

  const handleSuggestion = () => {
    setCount((prev) => {
      const next = prev + 4;
      return next >= filteredUsers.length ? filteredUsers.length : next;
    });
  };

  const fetchFeed = posts?.filter((post) => {
    return post.userId === currentUser.id || isFollowing[post.userId];
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {loading && <div className="flex items-center justify-center h-screen text-purple-500 font-bold">Loading leaps...</div>}
      
      {!loading && (
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Your Feed
            </h1>
            <div className="flex items-center gap-2 bg-[#1c1c2d] px-4 py-2 rounded-full border border-gray-800">
              <div className="bg-purple-600 p-1 rounded-lg"><Icons.Zap fill="white" /></div>
              <span className="font-bold">FriendLeap</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            <div className="hidden lg:block w-72 shrink-0">
              <div className="bg-[#161b22] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden sticky top-8">
                <div className="h-20 bg-gradient-to-r from-purple-600 to-blue-500"></div>
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="w-20 h-20 rounded-2xl border-4 border-[#161b22] bg-[#0d1117] overflow-hidden shadow-xl">
                      {currentUser?.image ? (
                        <img
                          src={currentUser.image}
                          alt="Profile"
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => navigate("/profile")}
                        />
                      ) : (
                        <div 
                          className="w-full h-full bg-purple-500 flex items-center justify-center text-2xl font-bold cursor-pointer"
                          onClick={() => navigate("/profile")}
                        >
                          {currentUser?.firstName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="font-bold text-lg text-gray-100">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </h2>
                    <p className="text-gray-500 text-xs">@{currentUser?.username || 'user'}</p>
                  </div>
                  
                  <div className="flex justify-around border-t border-gray-800 pt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-400">{posts.filter(p => p.userId === currentUser.id).length}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Leaps</p>
                    </div>
                    <button onClick={() => setShowFollowingModal(true)} className="text-center hover:opacity-80 transition-opacity">
                      <p className="text-lg font-bold text-blue-400">{Object.values(isFollowing).filter(v => v === true).length}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Sparks</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content: Feed */}
            <div className="flex-1 max-w-2xl space-y-6">
              <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-2 shadow-lg">
                <Post onPostCreated={handleNewPost} />
              </div>

              <div className="space-y-6">
                {fetchFeed?.map((post) => (
                  <div key={post.id} className="bg-[#161b22] rounded-3xl border border-gray-800 p-6 shadow-md hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 overflow-hidden">
                        {post?.authorImage ? (
                          <img src={post.authorImage} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-purple-500 to-blue-500">
                            {post?.authorName?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-100">{post.authorName || "User"}</h3>
                        <p className="text-[10px] text-gray-500">Just now</p>
                      </div>
                    </div>

                    <p className="text-gray-300 font-medium mb-4">{post.name}</p>

                    {post.image && post.image.startsWith("data:video/") ? (
                      <video src={post.image} controls className="w-full max-h-96 rounded-2xl object-cover mb-4 bg-black border border-gray-800" />
                    ) : post.image ? (
                      <img src={post.image} alt="post" className="w-full h-auto rounded-2xl object-cover mb-4 border border-gray-800" />
                    ) : null}

                    <div className="flex items-center gap-4 pt-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          likedPosts.has(post.id) ? "bg-pink-500/10 text-pink-500" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        {post.like || 0}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all">
                        <FontAwesomeIcon icon={faComment} />
                        Discuss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar: Suggestions */}
            <div className="hidden xl:block w-72 shrink-0">
              <div className="bg-[#161b22] rounded-3xl border border-gray-800 p-5 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Discover</h2>
                  <button onClick={handleSuggestion} className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                    Refresh
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  {filteredUsers.slice(0, count).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 truncate">
                        <img 
                           src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                           className="w-10 h-10 rounded-xl object-cover border border-gray-800" 
                           alt="User" 
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-gray-200 truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-gray-500">@{user.username || 'user'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollowing(user.id)}
                        className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                          isFollowing[user.id] 
                            ? "bg-transparent border-gray-700 text-gray-500" 
                            : "bg-white text-black border-white hover:bg-gray-200"
                        }`}
                      >
                        {isFollowing[user.id] ? "Following" : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal matching Profile theme */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-[#161b22] border border-gray-800 rounded-3xl w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Your Network</h2>
              <button 
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {followingUsersList.length > 0 ? (
                followingUsersList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-[#0d1117] rounded-2xl border border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-800"
                        alt={user.firstName}
                      />
                      <div>
                        <p className="font-bold text-gray-200 text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-gray-500 font-medium">@{user.username || 'user'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollowing(user.id)}
                      className="px-4 py-1.5 text-[10px] bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50 rounded-full font-bold transition-all"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Your leap network is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;