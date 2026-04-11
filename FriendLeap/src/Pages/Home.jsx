import React, { useEffect, useState } from "react";
import Post from "./Post";
import { getMockUsers } from "../services/Mock";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const fetchUsersData = async () => {
      const data = await getMockUsers();
      setUsers(data);
    };
    fetchUsersData();
  }, []);
  return(
    <div>
      <Post />
    </div>
  )
};

export default Home;