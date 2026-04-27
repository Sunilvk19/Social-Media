import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { getMockUsers } from "../services/Mock";
import { getRealUsers } from "../services/User";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const emojis = ["🚀", "🌸", "🎧", "🌙", "🌿", "⚡", "🍓", "🔥", "🌈", "🍋", "🦋", "🌊"];
const colors = [
  "bg-pink-500", "bg-orange-400", "bg-purple-500",
  "bg-teal-400", "bg-blue-400", "bg-yellow-400"
];

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    emoji: "🚀"
  });

  const [selectedColor, setSelectedColor] = useState("bg-pink-500");

  useEffect(() => {
    const load = async () => {
      const userData = await localforage.getItem("Current_user");
      if (!userData) return;

      const [
        postData,
        profileData,
        followingData,
        mockUsers,
        realUsers
      ] = await Promise.all([
        localforage.getItem(`posts_${userData.id}`),
        localforage.getItem(`User_Profile_${userData.id}`),
        localforage.getItem(`Following_state_${userData.id}`),
        getMockUsers(),
        getRealUsers().catch(() => [])
      ]);

      setUser(userData);

      setEditData({
        ...userData,
        bio: profileData?.bio || "Leaping between moments, collecting good vibes.",
        emoji: profileData?.emoji || "🚀"
      });

      if (profileData?.color) setSelectedColor(profileData.color);

      if (postData) {
        setPosts(postData.filter(p => p.userId === userData.id));
      }

      const map = followingData || {};
      setIsFollowing(map);

      setFollowingCount(Object.values(map).filter(Boolean).length);

      const allUsers = [...(realUsers || []), ...(mockUsers?.users || [])];
      setFollowedUsers(allUsers.filter(u => map[u.id]));
    };

    load();
  }, []);

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email
    };

    await localforage.setItem("Current_user", updatedUser);

    await localforage.setItem(`User_Profile_${user.id}`, {
      bio: editData.bio,
      emoji: editData.emoji,
      color: selectedColor
    });

    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleFollowing = (id) => {
    setIsFollowing(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localforage.setItem(`Following_state_${user.id}`, updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between">
          <Button onClick={() => navigate("/home")} className="text-white/60 bg-white/5 backdrop-blur-md border border-white/10 hover:text-white hover:border-cyan-500/20 hover:bg-cyan-500/10transition-colors font-bold uppercase tracking-widest text-xs">
            ← Back to Home
          </Button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>

          <div className="flex flex-col md:flex-row gap-8">

            {/* AVATAR SECTION */}
            <div className="flex flex-col items-center gap-4">
              <div className={`w-32 h-32 ${selectedColor} rounded-[32px] flex items-center justify-center text-5xl shadow-2xl border-4 border-white/10 transition-transform group-hover:scale-105 duration-500`}>
                {editData.emoji}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <h2 className="text-3xl font-black text-white tracking-tight">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-cyan-400 font-bold text-sm mt-1">
                        {user.email}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4 max-w-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">First Name</label>
                          <input
                            type="text"
                            value={editData.firstName || ""}
                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Last Name</label>
                          <input
                            type="text"
                            value={editData.lastName || ""}
                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Email Address</label>
                        <input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all shadow-lg"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSave}
                      className="px-8 py-2.5 rounded-full bg-linear-to-r from-cyan-400 to-indigo-500 text-black font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
                    >
                      ✓ Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all"
                    >
                      ✕ Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">About Me</label>
                {!isEditing ? (
                  <p className="mt-2 text-white/70 font-medium leading-relaxed max-w-2xl">
                    {editData.bio}
                  </p>
                ) : (
                  <div className="mt-2">
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 min-h-[120px] resize-none transition-all placeholder:text-white/10"
                      maxLength={140}
                      placeholder="Share a bit about your journey..."
                    />
                    <p className="text-right text-[10px] font-black text-white/20 mt-2 tracking-widest">
                      {editData.bio.length} / 140
                    </p>
                  </div>
                )}
              </div>

              {/* EDIT SECTION (EMOJIS & COLORS) */}
              {isEditing && (
                <div className="grid md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                  {/* EMOJI SELECTOR */}
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Choose your Vibe</p>
                    <div className="flex flex-wrap gap-2.5">
                      {emojis.map(e => (
                        <button
                          key={e}
                          onClick={() => setEditData({ ...editData, emoji: e })}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl transition-all ${
                            editData.emoji === e
                              ? "bg-cyan-500 text-black scale-110 shadow-lg shadow-cyan-500/20"
                              : "bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* COLOR SELECTOR */}
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Aura Color</p>
                    <div className="flex flex-wrap gap-3">
                      {colors.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-8 h-8 rounded-full transition-all ${c} ${
                            selectedColor === c
                              ? "ring-4 ring-white/20 ring-offset-4 ring-offset-brand-dark scale-110"
                              : "hover:scale-110 opacity-60 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Stat label="LEAPS" value={posts.length} />
          <Stat label="SPARKS" value={followingCount} />
          <Stat label="STARS" value={0} />
        </div>

        {/* FOLLOWING SECTION */}
        <div className="pt-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Your Connections</h2>
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 tracking-widest">
              {followedUsers.length} TOTAL
            </span>
          </div>

          {followedUsers.length === 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-[32px] p-20 text-center">
               <div className="text-4xl mb-4 opacity-20">🏜️</div>
               <p className="text-white/30 font-bold">No connections yet. Go explore the world!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {followedUsers.map(u => (
                <div
                  key={u.id}
                  className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-[32px] flex justify-between items-center group/item hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">👤</div>
                    <div>
                      <p className="font-black text-white">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[10px] font-bold text-white/30 tracking-wider">@{u.username || u.firstName.toLowerCase()}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleFollowing(u.id)}
                    className="px-5 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-full text-[10px] font-black transition-all uppercase tracking-widest"
                  >
                    Unfollow
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-[32px] p-8 border border-white/5 hover:bg-white/10 transition-all group">
    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 group-hover:text-cyan-400 transition-colors">{label}</p>
    <p className="text-4xl font-black text-white">{value}</p>
  </div>
);

export default Profile;