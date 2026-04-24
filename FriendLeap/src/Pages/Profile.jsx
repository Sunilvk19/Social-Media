import { icon } from "@fortawesome/fontawesome-svg-core";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { getMockUsers } from "../services/Mock";
import { getRealUsers } from "../services/User";

const Profile = () => {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [followedUsers, setFollowedUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState({});
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
          getRealUsers().catch(() => []) // Handle case where json-server is not running
        ]);
        if (userData) setUser(userData);
        setEditData(userData);
        if (profileData?.image) setImage(profileData.image);
        if (postData) {
          const myPosts = postData.filter(
            (post) => post.userId === userData.id,
          );
          setPosts(myPosts);
        }
        
        const followingMap = followingData || {};
        setIsFollowing(followingMap);
        
        const count = Object.values(followingMap).filter(
          (following) => following === true,
        ).length;
        setFollowingCount(count);

        const allUsers = [...(realUsersRes || []), ...(mockUsersRes?.users || [])];
        if (allUsers.length > 0) {
          const followed = allUsers.filter(u => followingMap[u.id] === true);
          setFollowedUsers(followed);
        }

      } catch (error) {
        console.log("Failed to load the data", error);
      }
    };
    fetchProfileData();
  }, []);
  const handleSaveProfile = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      setImage(URL.createObjectURL(file));

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      setImage(base64Image);
      await localforage.setItem(`User_Profile_${user.id}`, {
        image: base64Image,
        user,
      });
      console.log("Profile Picture saved Successfully !");
    } catch (err) {
      console.log("Failed to save the profile", err);
      throw new Error("Failed to save the profile");
    }
  };
  const handleDelete = async (id) => {
    try {
      const existingPosts = (await localforage.getItem("posts")) || [];
      const updatedPosts = existingPosts.filter((post) => post.id !== id);
      await localforage.setItem("posts", updatedPosts);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };
  const handleEditUserDetails = async () => {
    try {
      const updatedUser = {
        ...user,
        ...editData
      };
      await localforage.setItem("Current_user", updatedUser);
      setUser(updatedUser);
      setIsEditing(false)
    } catch (error) {
      console.log("Failed to update the user details", error);
      throw new Error("Failed to update the user details", error);
    }
  };
  const handleFollowing = async (id) => {
    try {
      setIsFollowing((prev) => {
        const updated = { ...prev, [id]: !prev[id] };
        localforage.setItem(`Following_state_${user.id}`, updated);
        
        const count = Object.values(updated).filter(v => v === true).length;
        setFollowingCount(count);
        return updated;
      });
    } catch (err) {
      console.error("Failed to follow/unfollow", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-full md:w-80 bg-white border-r p-6 flex flex-col items-center">
        <label className="relative cursor-pointer group">
          <img
            src={
              image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-28 h-28 rounded-full object-cover shadow-md"
          />
          <input type="file" className="hidden" onChange={handleSaveProfile} />

          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
            Upload
          </div>
        </label>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <div className="mt-6 w-full space-y-3">
          <div className="flex justify-between bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-gray-500 text-sm">Posts</span>
            <span className="font-semibold">{posts.length}</span>
          </div>

          <div className="flex justify-between bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-gray-500 text-sm">Following</span>
            <span className="font-semibold">{followingCount}</span>
          </div>
        </div>

        <Button
          className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          onClick={() => {
            setEditData(user);
            setIsEditing(true);
          }}
        >
          Edit Profile
        </Button>
        {isEditing && (
          <Modal
            title="Edit Profile"
            isOpen={isEditing}
            onClose={() => {setIsEditing(false); setEditData(user)} }
          >
            <div className="p-6 space-y-4">
              <Input
                placeholder="First Name"
                value={editData.firstName || ''}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
              />
              <Input
                placeholder="Last Name"
                value={editData.lastName || ''}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
              />
              <Button
                className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                onClick={handleEditUserDetails}
              >
                Save Changes
              </Button>
            </div>
          </Modal>
        )}
      </div>
      <div className="flex-1 p-6 md:p-10 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Posts</h1>
          <span className="text-sm text-gray-500">{posts.length} total</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square rounded-xl overflow-hidden group bg-gray-200"
            >
              <img
                src={post.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No posts yet</p>
            </div>
          )}
        </div>

        {/* Following List */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Following</h1>
            <span className="text-sm text-gray-500">{followedUsers.length} people</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedUsers.map((followedUser) => (
              <div
                key={followedUser.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={followedUser.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={followedUser.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-50"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {followedUser.firstName} {followedUser.lastName}
                    </p>
                    <p className="text-xs text-gray-500">@{followedUser.username || followedUser.firstName}</p>
                  </div>
                </div>
                <Button
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isFollowing[followedUser.id]
                      ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      : "bg-gray-900 text-white"
                  }`}
                  onClick={() => handleFollowing(followedUser.id)}
                >
                  {isFollowing[followedUser.id] ? "Unfollow" : "Follow"}
                </Button>
              </div>
            ))}
            {followedUsers.length === 0 && (
              <div className="col-span-full py-10 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500">You are not following anyone yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
