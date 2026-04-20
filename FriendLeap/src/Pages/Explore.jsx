
import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { getMockUsers } from "../services/Mock";

const Explore = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const [data, mockData] = await Promise.all([
          localforage.getItem("currentUser"),
          getMockUsers()
        ]);
        if(data) setCurrentUser(data);
        if(mockData?.users) setUsers(mockData.users);
      }catch(error){
        console.log(error.message);
      }finally{
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <span className="text-2xl font-bold text-gray-800">Explore</span>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {loading && <div className="">Loading......</div>}
        {!loading &&
          users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-md">
              <div className="relative group">
                <img
                  src={
                    user.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="user-image"
                  className="w-14 h-14 rounded-full object-cover shadow-lg hover:opacity-90 transition"
                />
                <div className="flex items-center justify-between top-0 right-0 gap-2">
                  <span className="text-xs font-semibold text-gray-500">{user.firstName} {user.lastName}</span>
                  <span className="text-xs font-semibold text-gray-500">{user.username}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Explore;
