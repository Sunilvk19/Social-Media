import React, { useEffect, useState } from "react";
import { getMockUsers, getMockPosts } from "../services/Mock";
import { getRealUsers } from "../services/User";

import Button from "../components/common/Button";
import Post from "./Post";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getRealUsers } from "../services/User";

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(4);
  const [isFollowing, setIsFollowing] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

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
        throw new Error("Failed to fetch data");
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

  console.log(users);

  const filteredUsers = users.filter((user) => user.id !== currentUser.id);

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
    <>
      {loading && <div>Loading......</div>}
      {!loading && (
        <div className="min-h-screen bg-gray-50 pt-8 pb-5 font-sans">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-14">
              <div className="hidden lg:block w-80 shrink-0 space-y-6 animate-in slide-in-from-left-8 duration-700">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-all">
                  <div className="h-28 bg-linear-to-r from-cyan-500 to-blue-500 via-purple-500 w-full group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="px-8 pb-8 relative">
                    <div className="flex justify-center -mt-16 mb-6">
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                        {currentUser?.image ? (
                          <img
                            src={currentUser.image}
                            alt="User_Profile"
                            className="w-full h-full object-cover hover:cursor-pointer"
                            onClick={() => navigate("/profile")}
                          />
                        ) : (
                          <div className="w-full h-full bg-amber-200 flex items-center justify-center text-4xl font-extrabold text-indigo-500 shadow-inner">
                            {currentUser?.firstName
                              ? currentUser.firstName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                        {currentUser?.firstName + " " + currentUser?.lastName ||
                          "User"}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {currentUser?.email || "Email"}
                      </p>
                    </div>
                    <div className="flex justify-between text-center pt-2">
                      <div className="group/stat cursor-pointer">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {
                            posts.filter(
                              (post) => post.userId === currentUser?.id,
                            ).length
                          }
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Posts
                        </p>
                      </div>
                      <div className="group/stat cursor-pointer gap">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {
                            Object.values(isFollowing).filter(
                              (value) => value === true,
                            ).length
                          }
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Following
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-2xl w-full flex flex-col space-y-6">
                <div className="bg-white ">
                  <Post onPostCreated={handleNewPost} />
                  {fetchFeed?.map((post) => {
                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden mt-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full border-2 border-gray-50 bg-gray-100 overflow-hidden shadow-sm">
                            {post?.authorImage ? (
                              <img
                                src={`${post.authorImage}`}
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-indigo-500 bg-amber-100 hover:cursor-pointer">
                                {post?.authorName
                                  ? post.authorName.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-800">
                            {post.authorName || "User"}
                          </h3>
                        </div>
                        {post.image && post.image.startsWith("data:video/") ? (
                          <video
                            src={post.image}
                            controls
                            className="w-full max-h-96 rounded-xl object-cover mb-4 bg-black"
                          />
                        ) : post.image ? (
                          <img
                            src={post.image}
                            alt="post"
                            className="w-full h-auto rounded-xl object-cover mb-4"
                          />
                        ) : null}
                        <p className="text-gray-800 font-medium">{post.name}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            className={`flex items-center gap-2 ${likedPosts.has(post.id) ? "bg-red-100 text-red-800" : "bg-white text-gray-800"}`}
                            onClick={() => handleLike(post.id)}
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className={
                                likedPosts.has(post.id)
                                  ? "text-red-500"
                                  : "text-gray-800"
                              }
                            />
                            {likedPosts.has(post.id) ? "Like" : "Like"}
                          </Button>
                          <Button className="flex items-center gap-2 bg-white text-gray-800">
                            <FontAwesomeIcon icon={faComment} />
                            Comments
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="hidden xl:block w-80 shrink-0 -space-y-12 sticky top-24 h-max animate-in slide-in-from-right-8 duration-700">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[16px] font-bold text-gray-800">
                      Who to follow
                    </h2>
                    <Button
                      onClick={handleSuggestion}
                      className="bg-transparent text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-transparent shadow-none px-0"
                    >
                      See all
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {filteredUsers.slice(0, count).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 w-full min-w-0 pr-2">
                          <div className="relative w-11 h-11 shrink-0">
                            <img
                              src={user.image}
                              alt="User"
                              className="w-full h-full rounded-full object-cover border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-[14px] font-bold text-gray-800 truncate hover:text-indigo-600 transition-colors cursor-pointer">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-[12px] text-gray-500 font-medium truncate">
                              @{user.username}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleFollowing(user.id)}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                            isFollowing[user.id]
                              ? "bg-indigo-50 border-2 border-indigo-200 text-indigo-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                              : "bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          {isFollowing[user.id] ? "Following" : "Follow"}
                        </Button>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full">
                        <span className="text-2xl mb-2 block">🎉</span>
                        <p className="text-[13px] font-bold text-gray-600">
                          You're following everyone!
                        </p>
                      </div>
                    )}
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
