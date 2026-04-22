import { icon } from "@fortawesome/fontawesome-svg-core";
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";

const Profile = () => {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userData = await localforage.getItem("Current_user");
        if (!userData) return;
        const [postData, profileData, followingData] = await Promise.all([
          localforage.getItem(`posts_${userData.id}`),
          localforage.getItem(`User_Profile_${userData.id}`),
          localforage.getItem(`Following_state_${userData.id}`),
        ]);
        if (userData) setUser(userData);
        if (profileData?.image) setImage(profileData.image);
        if (postData) {
          const myPosts = postData.filter(
            (post) => post.userId === userData.id,
          );
          setPosts(myPosts);
        }
        if (followingData) {
          const count = Object.values(followingData).filter(
            (following) => following === true,
          ).length;
          setFollowingCount(count);
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
  return (
    <div className="min-h-screen bg-gray-100 flex items-start py-10 gap-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {user.firstName}'s Profile
        </h1>

        <label className="cursor-pointer inline-block relative mb-8">
          <img
            src={
              image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="user-image"
            className="w-40 h-40 rounded-full object-cover shadow-lg hover:opacity-90 transition"
          />
          <input
            type="file"
            className="hidden"
            onChange={handleSaveProfile}
            accept="image/*"
          />
        </label>

        <div className="space-y-4 text-left">
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">Username</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {user.firstName + " " + user.lastName}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {user.email}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 rounded-xl py-4 flex flex-col items-center">
              <span className="text-sm text-gray-500">Following</span>
              <h3 className="text-xl font-bold text-indigo-600">
                {followingCount}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col items-center bg-amber-500 rounded-xl py-4">
              <span className="text-sm text-gray-800">Posts</span>
              <h3 className="text-lg font-semibold text-gray-900">
                {posts.length}
              </h3>
            </div>
            <div className="flex flex-col items-center bg-cyan-500 rounded-xl py-4">
              <span className="text-sm text-gray-800">Likes</span>
              <h3 className="text-lg font-semibold text-gray-900">0</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 bg-white rounded-3xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            All Posts
          </h1>
          <span className="text-sm text-gray-500">{posts.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => {
            return (
              <div
                key={post.id}
                className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square"
              >
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-md"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
