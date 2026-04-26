import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import localforage from "localforage";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { getMockUsers } from "../services/Mock";
import { getRealUsers } from "../services/User";

const Profile = () => {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: "Leaping between moments, collecting good vibes." });
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
  
  const [selectedColor, setSelectedColor] = useState('bg-pink-500');

  const navigate = useNavigate();

  const colors = [
    'bg-pink-500', 'bg-orange-400', 'bg-purple-500', 
    'bg-teal-400', 'bg-blue-400', 'bg-yellow-400'
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await localforage.getItem("Current_user");
        if (!userData) return;

        const [postData, profileData, followingData, mockUsersRes, realUsersRes] = await Promise.all([
          localforage.getItem(`posts_${userData.id}`),
          localforage.getItem(`User_Profile_${userData.id}`),
          localforage.getItem(`Following_state_${userData.id}`),
          getMockUsers(),
          getRealUsers().catch(() => [])
        ]);

        setUser(userData);
        setEditData({ ...userData, bio: profileData?.bio || "Leaping between moments, collecting good vibes." });
        if (profileData?.image) setImage(profileData.image);
        if (profileData?.color) setSelectedColor(profileData.color);

        if (postData) {
          const myPosts = postData.filter((post) => post.userId === userData.id);
          setPosts(myPosts);
        }

        const followingMap = followingData || {};
        setIsFollowing(followingMap);
        setFollowingCount(Object.values(followingMap).filter(v => v === true).length);

        const allUsers = [...(realUsersRes || []), ...(mockUsersRes?.users || [])];
        setFollowedUsers(allUsers.filter(u => followingMap[u.id] === true));

      } catch (error) {
        console.error("Failed to load data", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = { ...user, ...editData };
      await localforage.setItem("Current_user", updatedUser);
      await localforage.setItem(`User_Profile_${user.id}`, {
        image,
        bio: editData.bio,
        color: selectedColor
      });
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated!");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const Icons = {
    Zap: ({ className, fill = "none" }) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" className={className}><path d="M4 14.89 14 3v9.11L20 9.11 10 21v-9.11Z"/></svg>
    ),
    Rocket: () => (
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
    )
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-white flex items-center gap-2">
            <span>←</span> Back to leaps
          </button>
          <div className="flex items-center gap-2 bg-[#1c1c2d] px-4 py-2 rounded-full border border-gray-800">
            <div className="bg-purple-600 p-1 rounded-lg"><Icons.Zap fill="white" /></div>
            <span className="font-bold">FriendLeap</span>
          </div>
        </div>

        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className={`w-32 h-32 ${selectedColor} rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500`}>
              <Icons.Rocket />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-gray-400 font-medium">You</h2>
                  <p className="text-gray-500 text-sm">@{user.username || 'you.leap'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleUpdateProfile}
                    className="bg-gradient-to-r from-purple-500 to-blue-400 px-8 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
                  >
                    Save
                  </button>
                  <button className="text-gray-400 text-sm hover:text-white">✕ Cancel</button>
                </div>
              </div>

              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none h-20 text-gray-200 placeholder-gray-600"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                maxLength={140}
              />
              <p className="text-right text-xs text-gray-600">{editData.bio?.length}/140</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-800/50">
            <div>
              <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Avatar Emoji</h3>
              <div className="flex flex-wrap gap-4 text-2xl">
                {['🚀', '🌸', '🎧', '🌙', '🌿', '⚡', '🐚', '🦋', '🍓', '🪐', '🔥'].map(emoji => (
                  <button key={emoji} className="hover:scale-125 transition-transform">{emoji}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Avatar Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-white ring-offset-4 ring-offset-[#161b22]' : ''}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'LEAPS', val: posts.length, color: 'text-purple-400' },
            { label: 'HEARTS', val: 0, color: 'text-pink-400' },
            { label: 'ECHOES', val: 0, color: 'text-blue-400' },
            { label: 'SPARKS', val: followingCount, color: 'text-yellow-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#161b22] border border-gray-800 p-4 rounded-2xl">
              <p className={`text-[10px] font-bold ${stat.color} tracking-widest mb-1`}>{stat.label}</p>
              <p className="text-2xl font-bold">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6">Your network</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {followedUsers.map((fUser) => (
              <div key={fUser.id} className="bg-[#1c1c2d] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                    {fUser.firstName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{fUser.firstName} {fUser.lastName}</p>
                    <p className="text-xs text-gray-500">@{fUser.username || 'user'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFollowing(fUser.id)}
                  className="bg-gray-800 hover:bg-red-900/30 hover:text-red-400 px-4 py-1.5 rounded-full text-xs transition-colors"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;