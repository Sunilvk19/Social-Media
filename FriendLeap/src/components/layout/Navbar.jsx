import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faXmark,
  faBars,
  faMagnifyingGlass,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../common/Input";
import Button from "../common/Button";
import image from "../../assets/images/friend2.png";
import { handleLogout } from "../../services/Auth";

const Navbar = ({ onCreatePost = () => {}}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleNotification = ()=>{
    setNotification(!notification);
  }

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }
  
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

          <ul className="hidden md:flex items-center justify-center gap-8 text-sm font-bold text-white/50 whitespace-nowrap">
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li
                  key={item.name}
                  className={`transition-colors ${isActive ? "text-cyan-400" : "hover:text-white"}`}
                >
                  <Link to={item.path} className="py-2 inline-block">
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          
          <div className="flex items-center justify-end gap-3 shrink-0">
            <Button 
            onClick={onCreatePost}
            className="hidden lg:flex items-center gap-5 py-2.5 w-[260px] bg-white/5 border border-white/10 rounded-full cursor-pointer hover:bg-white/10 transition-all"
            >
              <FontAwesomeIcon icon={faRocket} />
              <span className="text-white/60 text-sm">What's on your mind?</span>
            </Button>

            <div className="relative">
              <Button
                onClick={handleNotification}
                className={`p-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all ${notification ? "text-cyan-400 bg-cyan-400/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <FontAwesomeIcon icon={faBell} />
                {notification && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-brand-dark" />}
              </Button>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            <div className="relative">
              <Button
                className="flex items-center gap-2.5 px-4 py-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="hidden sm:inline">profile</span>
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 p-2 bg-brand-dark border border-white/10 rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <Link
                    to="/profile"
                    className="block px-5 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl font-bold transition-all"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/setting"
                    className="block px-5 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-2xl font-bold transition-all"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="h-px bg-white/5 my-2"></div>
                  <Button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-5 py-3 text-rose-400 hover:bg-rose-400/10 rounded-2xl font-bold transition-all"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            <Button
              className="md:hidden p-2 text-white/50 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} size="lg" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-dark border-t border-white/5 p-6 animate-in slide-in-from-top duration-300">
            <ul className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-5 py-4 rounded-2xl font-bold transition-all ${
                        isActive ? "text-cyan-400 bg-cyan-400/5" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
      <div className="h-[76px]"></div>
    </>
  );
};

export default Navbar;
