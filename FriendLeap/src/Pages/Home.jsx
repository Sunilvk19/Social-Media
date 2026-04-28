import React, { useEffect, useState } from "react";
import { getMockUsers, getMockPosts } from "../services/Mock";
import { getRealUsers } from "../services/User";
import Button from "../components/common/Button";
import Post from "./Post";
import PostCard from "../components/post/PostCard";
import MoodFilter from "../components/post/MoodFilter";
import MoodStoriesBar from "../components/mood/MoodStoriesBar";
import TrendingSidebar from "../components/layout/TrendingSidebar";
import { sendNotification } from "../services/Notification";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faFire,
  faUsers,
  faStar,
  faUser,
  faTimes,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Home = ({ isPostOpen, setIsPostOpen }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [activeMood, setActiveMood] = useState("all");

  const Icons = {
    Zap: ({ className, fill = "none" }) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <path d="M4 14.89 14 3v9.11L20 9.11 10 21v-9.11Z" />
      </svg>
    ),
  };

  const handleLike = (id) => {
    const isCurrentlyLiked = likedPosts.has(id);

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localforage.setItem(`liked_posts_${currentUser.id}`, Array.from(newSet));
      
      // Notify author if liked
      if (!isCurrentlyLiked) {
        const post = posts.find(p => p.id === id);
        if (post && post.userId !== currentUser.id) {
          sendNotification({
            userId: post.userId,
            senderId: currentUser.id,
            type: "like",
            content: "liked your Leap"
          });
        }
      }
      return newSet;
    });

    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            like: isCurrentlyLiked
              ? (post.like || 0) - 1
              : (post.like || 0) + 1,
          };
        }
        return post;
      });
      localforage.setItem(`posts_${currentUser.id}`, updatedPosts);
      return updatedPosts;
    });
  };

  const handleFollowing = async (id) => {
    setIsFollowing((prev) => {
      const updatedState = { ...prev, [id]: !prev[id] };
      localforage.setItem(`Following_state_${currentUser.id}`, updatedState);
      
      // Notify if following
      if (updatedState[id]) {
        sendNotification({
          userId: id,
          senderId: currentUser.id,
          type: "follow",
          content: "started following you"
        });
      }
      return updatedState;
    });
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const userData = await localforage.getItem("Current_user");
        if (!userData) {
          navigate("/login");
          return;
        }
        setCurrentUser(userData);

        const [mockPostsRes, mockUsers, realUsers] = await Promise.all([
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
          if (mockPostsRes?.posts) {
            setPosts(mockPostsRes.posts);
            await localforage.setItem(
              `posts_${userData.id}`,
              mockPostsRes.posts,
            );
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
  }, [navigate]);

 
  useEffect(() => {
    const handleMoodUpdate = (e) => {
      const updatedUser = e.detail;
      setCurrentUser(updatedUser);
      setUsers((prev) => {
        const exists = prev.some((u) => String(u.id) === String(updatedUser.id));
        if (exists) {
          return prev.map((u) =>
            String(u.id) === String(updatedUser.id) ? { ...u, mood: updatedUser.mood } : u
          );
        }
        return [...prev, updatedUser];
      });
    };
    window.addEventListener("moodUpdated", handleMoodUpdate);
    return () => window.removeEventListener("moodUpdated", handleMoodUpdate);
  }, []);



  const handleNewPost = (newPost) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      localforage.setItem(`posts_${currentUser.id}`, updated);
      return updated;
    });
    setIsPostOpen(false);
  };

  const filteredFeed = posts
    ?.filter((post) => {
      const isOwner = post.userId === currentUser.id;
      const author = users.find(u => u.id === post.userId);
      const moodVisibility = author?.mood?.visibility || "Friends";

      if (isOwner) return true; // Always see your own posts
      if (moodVisibility === "Only Me") return false; // Hide private moods
      
      // For "Close Friends", we check if the current user is in the author's circle
      // (Mocking this check by looking at a hypothetical 'closeFriends' array)
      if (moodVisibility === "Close Friends") {
        return author.closeFriends?.includes(currentUser.id);
      }

      return isFollowing[post.userId];
    })
    .filter((post) => activeMood === "all" || post.mood === activeMood);

  const visibleUsers = users.filter(user => {
    const isSelf = user.id === currentUser.id;
    const moodVisibility = user.mood?.visibility || "Friends";

    if (isSelf) return true;
    if (moodVisibility === "Only Me") return false;
    if (moodVisibility === "Close Friends") {
      return user.closeFriends?.includes(currentUser.id);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brand-dark to-cyan-400">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleDeletePost = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this leap?")) return;

  setPosts((prevPosts) => {
    const updatedPosts = prevPosts.filter((post) => post.id !== postId);    
    localforage.setItem(`posts_${currentUser.id}`, updatedPosts);
    return updatedPosts;
  });
};

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_350px] gap-8">
        {/* Left Column: Profile & Nav */}
        <aside className="hidden lg:flex flex-col gap-6 animate-in slide-in-from-left-8 duration-700">
          <div className="glass-card rounded-[40px] p-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-brand-dark to-cyan-400 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 transition-all duration-500 ${currentUser?.mood ? 'p-1 bg-linear-to-tr ' + currentUser.mood.color : 'border-white/10 bg-linear-to-tr from-rose-400 to-pink-500'}`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-brand-dark flex items-center justify-center">
                    {currentUser?.image ? (
                      <img src={currentUser.image} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-3xl">🚀</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col truncate">
                  <h2 className="text-xl font-black text-white truncate">
                    {currentUser?.firstName} 
                    {currentUser?.lastName}
                  </h2>
                  <p className="text-white/30 text-sm font-bold truncate">
                    @{currentUser?.firstName}.leap
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Leaps",
                    value: posts.filter((p) => p.userId === currentUser?.id)
                      .length,
                  },
                  {
                    label: "Friends",
                    value: Object.values(isFollowing).filter((v) => v === true)
                      .length,
                    onClick: () => setShowFollowingModal(true),
                  },
                  { label: "Sparks", value: 0 },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={stat.onClick}
                    className={`bg-white/5 rounded-[24px] py-4 flex flex-col items-center justify-center transition-all hover:bg-white/10 ${stat.onClick ? "cursor-pointer" : ""}`}
                  >
                    <span className="text-xl font-black text-white">
                      {stat.value}
                    </span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <nav className="glass-card rounded-[40px] p-4 flex flex-col gap-1">
            {[
              { icon: faCompass, label: "Settings", color: "text-cyan-400" },
              { icon: faFire, label: "Trending", onClick: () => navigate("/explore"),color: "text-orange-500" },
              { icon: faUsers, label: "Circless",onClick: () => navigate("/circle"), color: "text-indigo-400" },
              { icon: faMessage, label: "Messages",onClick: () => navigate("/messages"), color: "text-indigo-400" },
              { icon: faUser, label: "Your profile", onClick: () => navigate("/profile"), color: "text-rose-400" },
            ].map((item, index) => (
              <Button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-5 p-5 rounded-[30px] bg-transparent backdrop-blur-2xl border border-white/10 hover:bg-white/5 transition-all group w-full text-left"
              >
                <div
                  className={`${item.color} text-xl group-hover:scale-125 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="text-[17px] font-bold text-white/70 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>
        </aside>

        <main className="space-y-8 animate-in fade-in duration-1000">
          <MoodStoriesBar users={visibleUsers} />
          <MoodFilter activeMood={activeMood} onMoodChange={setActiveMood} />

          <div className="space-y-8">
            {filteredFeed?.length > 0 ? (
              filteredFeed.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  isLiked={likedPosts.has(post.id)}
                  authorMood={users.find((u) => u.id === post.userId)?.mood}
                  className="glass-card rounded-[40px] p-4"
                />
              ))
            ) : (
              <div className="text-center py-20 glass-card rounded-[40px]">
                <div className="text-6xl mb-6">🌌</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No leaps in this vibe yet
                </h3>
                <p className="text-white/40">Be the first to share a moment!</p>
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:block animate-in slide-in-from-right-8 duration-700">
          <TrendingSidebar />
        </aside>
      </div>

      {isPostOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
            onClick={() => setIsPostOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
            <Post
              onPostCreated={handleNewPost}
              onCancel={() => setIsPostOpen(false)}
            />
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card rounded-[40px] w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">Friends</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {users
                .filter((u) => isFollowing[u.id])
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-[30px]"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.image ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                        alt={user.firstName}
                      />
                      <div>
                        <p className="font-bold text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-white/30">
                          @{user.username || user.firstName.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFollowing(user.id)}
                      className="px-5 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border-none rounded-full text-xs font-black"
                    >
                      Unfollow
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
