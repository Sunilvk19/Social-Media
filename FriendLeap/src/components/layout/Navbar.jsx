import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faXmark,
  faBars,
  faRocket,
  faMasksTheater,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";
import image from "../../assets/images/friend2.png";
import { handleLogout } from "../../services/Auth";
import localforage from "localforage";
import axios from "axios";
import MoodPickerSheet from "../mood/MoodPickerSheet";

const Navbar = ({ onCreatePost = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await localforage.getItem("Current_user");
      setCurrentUser(userData);
    };
    fetchUser();
  }, []);

  // Sync mood changes from any page (e.g. Profile)
  useEffect(() => {
    const onMoodUpdated = (e) => setCurrentUser(e.detail);
    window.addEventListener("moodUpdated", onMoodUpdated);
    return () => window.removeEventListener("moodUpdated", onMoodUpdated);
  }, []);


  const handleNotification = () => {
    navigate("/notification");
    

  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoodChange = async (moodData) => {
    if (!currentUser) return;
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${currentUser.id}`, {
        mood: moodData,
      });

      const updatedUser = { ...currentUser, mood: moodData };
      await localforage.setItem("Current_user", updatedUser);

      const profile = await localforage.getItem(
        `User_Profile_${currentUser.id}`,
      );
      if (profile) {
        await localforage.setItem(`User_Profile_${currentUser.id}`, {
          ...profile,
          mood: moodData,
        });
      }

      setCurrentUser(updatedUser);
      setIsMoodPickerOpen(false);
      // Notify other components that mood changed
      window.dispatchEvent(new CustomEvent("moodUpdated", { detail: updatedUser }));
    } catch (error) {
      console.error("Mood change error: ", error);
      alert("Failed to change mood. Please try again.");
    }
  };
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-dark/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <img src={image} alt="logo" className="w-10 h-10 rounded-xl" />
            <span className="text-2xl font-black text-white tracking-tighter hidden sm:block">
              Friend<span className="text-cyan-400">Leap</span>
            </span>
          </Link>
          
          <div className="flex items-center justify-end gap-3 shrink-0">
            <Button
              onClick={onCreatePost}
              className="hidden lg:flex items-center gap-5 py-2.5 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition-all"
            >
              <FontAwesomeIcon icon={faRocket} />
              <span className="text-white/60 text-sm">
                What's on your mind?
              </span>
            </Button>
            <div className="relative">
              <Button
                onClick={() => setIsMoodPickerOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-bold text-sm ${
                  currentUser?.mood
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">
                  {currentUser?.mood?.emoji || (
                    <FontAwesomeIcon icon={faMasksTheater} />
                  )}
                </span>
                <span className="hidden lg:inline">
                  {currentUser?.mood?.label || "Mood"}
                </span>
              </Button>
            </div>
            <div className="relative">
              <Button
                onClick={handleNotification}
                className={`p-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all ${notification ? "text-cyan-400 bg-cyan-400/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <FontAwesomeIcon icon={faBell} />
                {notification && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-brand-dark" />
                )}
              </Button>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            <div className="relative">
              <Button
                onClick={handleLogoutClick}
                className="w-full text-left px-5 bg-white/10 border border-white/10 backdrop-blur-md text-rose-400 hover:bg-rose-400/10 rounded-2xl font-bold transition-all"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[76px]"></div>
      <MoodPickerSheet
        open={isMoodPickerOpen}
        onClose={() => setIsMoodPickerOpen(false)}
        onSelect={handleMoodChange}
      />
    </>
  );
};

export default Navbar;
