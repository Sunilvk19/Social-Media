import axios from "axios";
import localforage from "localforage";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getRealUsers = async () => {
  try{
    const res = await axios.get(`${BASE_URL}/users`);
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

    const response = await axios.patch(`${BASE_URL}/users/${currentUser.id}`, {
      mood: moodData
    });

    const updatedUser = { ...currentUser, mood: response.data.mood };
    await localforage.setItem('Current_user', updatedUser);

    // Notify Navbar and Home to sync the new mood instantly
    window.dispatchEvent(new CustomEvent("moodUpdated", { detail: updatedUser }));
    
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user mood:", error);
    throw new Error("Failed to update mood");
  }
};