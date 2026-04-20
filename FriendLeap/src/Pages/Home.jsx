import React, { useEffect, useState } from "react";
import { getMockUsers } from "../services/Mock";
import Button from "../components/common/Button";
import Post from "./Post";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";


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
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      localforage.setItem("posts", updated);
      return updated;
    });
  };

  const filteredUsers = users.filter(
    (user) => !isFollowing[user.id] && user.id !== currentUser.id,
  );
  const handleSuggestion = () => {
    setCount(filteredUsers.length);
  };

  return (
    <>
      {!loading && (
        <div className="min-h-screen bg-gray-50 pt-8 pb-5 font-sans">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="hidden lg:block w-80 shrink-0 space-y-6 animate-in slide-in-from-left-8 duration-700">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-all">
                  <div className="h-28 bg-cyan-500 w-full group-hover:scale-105 transition-transform duration-700"></div>
                  <div className="px-6 pb-6 relative">
                    <div className="flex justify-center -mt-12 mb-4">
                      <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
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
                      <div className="group/stat cursor-pointer">
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
                      <div className="group/stat cursor-pointer">
                        <p className="font-extrabold text-gray-800 group-hover/stat:text-indigo-600 transition-colors">
                          {currentUser?.followers || 0}
                        </p>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                          Followers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-2xl w-full flex flex-col space-y-6">
                <div className="bg-white ">
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
                          <Button className="flex items-center gap-2 bg-white hover:bg-gray-300 text-gray-800 border border-gray-100"><FontAwesomeIcon icon={faHeart} />Like</Button>
                          <Button className="flex items-center gap-2 bg-white hover:bg-gray-300 text-gray-800 border border-gray-100"><FontAwesomeIcon icon={faComment} />Comments</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="hidden xl:block w-80 shrink-0 space-y-6 sticky top-24 h-max animate-in slide-in-from-right-8 duration-700">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[16px] font-bold text-gray-800">
                      Who to follow
                    </h2>
                    <Button onClick={handleSuggestion} className="bg-transparent text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-transparent shadow-none px-0"> 
                      See all
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {users
                      .filter(
                        (user) =>
                          !isFollowing[user.id] && user.id !== currentUser?.id,
                      )
                      .slice(0, count)
                      .map((user) => (
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
                            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm"
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
