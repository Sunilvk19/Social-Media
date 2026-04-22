import axios from "axios";

export const getRealUsers = async () => {
  try{
    const res = await axios.get("http://localhost:5000/users");
    return res.data;
  } catch (error) {
    console.log("Error fetching users", error);
    throw new Error("Failed to fetch users");
  } 
};