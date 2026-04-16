import localforage from "localforage";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await localforage.getItem("Current_user");
      setUser(data);
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {user.name}'s Profile
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
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
        </label>

        <div className="space-y-4 text-left">
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">Username</p>
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {user.email}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 rounded-xl py-4 flex flex-col items-center">
              <span className="text-sm text-gray-500">Followers</span>
              <h3 className="text-xl font-bold text-gray-600">0</h3>
            </div>
            <div className="bg-indigo-50 rounded-xl py-4 flex flex-col items-center">
              <span className="text-sm text-gray-500">Following</span>
              <h3 className="text-xl font-bold text-indigo-600">0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
