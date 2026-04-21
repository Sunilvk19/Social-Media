import localforage from "localforage";
import React, { useEffect, useState } from "react";
import { getMockUsers } from "../services/Mock";
import { getRealUsers } from "../services/User";

const Explore = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, mockData, realData] = await Promise.all([
          localforage.getItem("currentUser"),
          getMockUsers(),
          getRealUsers(),
        ]);

        if (data) setCurrentUser(data);

        const mockUsers = (mockData?.users || []).map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        }));

        const realUsers = (realData || []).map((user) => ({
          name: user.name,
        }));

        const combinedUsers = [...realUsers, ...mockUsers];
        setUsers(combinedUsers);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <span className="text-2xl font-bold text-gray-800">Explore</span>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {loading && <div>Loading......</div>}

        {!loading &&
          users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-md">
              <div className="flex flex-col items-center gap-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="user"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="text-sm font-semibold text-gray-700">
                  {user.name}
                </span>

              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Explore;