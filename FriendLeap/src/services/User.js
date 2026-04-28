import axios from "axios";
import localforage from "localforage";

export const getRealUsers = async () => {
  try{
    const res = await axios.get("http://localhost:5000/users");
    return res.data;
  } catch (error) {
    console.log("Error fetching users", error);
    throw new Error("Failed to fetch users");
  } 
};

// Update user mood on server and local storage
export const updateUserMood = async (moodData) => {
  try {
    const currentUser = await localforage.getItem('Current_user');
    if (!currentUser) throw new Error("No user logged in");

    // Update server (json-server)
    const response = await axios.patch(`http://localhost:5000/users/${currentUser.id}`, {
      mood: moodData
    });

    // Update local storage
    const updatedUser = { ...currentUser, mood: response.data.mood };
    await localforage.setItem('Current_user', updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user mood:", error);
    throw new Error("Failed to update mood");
  }
};