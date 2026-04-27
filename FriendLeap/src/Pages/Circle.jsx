import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { getMockUsers } from "../services/Mock";
import Input from "../components/common/Input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getRealUsers } from "../services/User";
import { useNavigate } from "react-router-dom";

const Circle = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await localforage.getItem("Current_user");
        if (userData) {
          setCurrentUser(userData);
          const followingData = await localforage.getItem(`Following_state_${userData.id}`);
          if (followingData) setIsFollowing(followingData);
        }

        const [mockUsers, realUsers] = await Promise.all([
          getMockUsers(),
          getRealUsers(),
        ]);

        const totalUsers = [...realUsers, ...mockUsers.users];
        setUsers(totalUsers);
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLeap = async (userId) => {
    setIsFollowing((prev) => {
      const updatedState = { ...prev, [userId]: true }; // Set to true to follow
      
      localforage.setItem(`Following_state_${currentUser.id}`, updatedState);
      return updatedState;
    });
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredUsers = users
    .filter((user) => user.id !== currentUser.id) 
    .filter((user) => !isFollowing[user.id]) 
    .filter((user) => {
      if (!query) return true;
      const fullName = user.username 
        ? user.username 
        : `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return fullName.toLowerCase().includes(query);
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64 text-xl font-bold text-gray-400 animate-pulse">
          Loading Content...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex justify-start">
            <button 
              onClick={() => navigate("/home")} 
              className="text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:text-indigo-600 transition-all font-bold uppercase tracking-widest text-xs shadow-sm"
            >
              ← Back to Home
            </button>
        </div>
          <div className="relative max-w-xl mx-auto mb-6">
            <Input
              icon={faMagnifyingGlass}
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white border border-gray-200 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Discover People
            </h2>
            
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover bg-gray-50"
                    />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-bold text-gray-800 truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.followers || 0} followers
                      </span>
                      <button 
                        onClick={() => handleLeap(user.id)} 
                        className="mt-2 w-fit text-xs font-semibold bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition-colors"
                      >
                        Leap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 font-medium">
                No new people to discover right now!
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Circle;