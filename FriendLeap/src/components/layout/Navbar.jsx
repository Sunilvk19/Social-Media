import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faXmark,
  faBars,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../common/Input";
import Button from "../common/Button";
import image from "../../assets/images/friend2.png";
import { handleLogout } from "../../services/Auth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState(false);
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
      throw new Error(err);
    }
  };
  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Post", path: "/post" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
          >
            <img src={image} alt="logo" className="w-12 h-12 rounded-2xl" />
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-orange-500 tracking-tight hidden sm:block">
              FriendLeap
            </span>
          </Link>

          <ul className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-sm font-medium text-gray-600 whitespace-nowrap">
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li
                  key={item.name}
                  className={`font-bold transition-colors ${isActive ? "text-cyan-600" : "text-gray-600 hover:text-orange-600"}`}
                >
                  <Link to={item.path} className="py-2 inline-block">
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-3 sm:gap-5 shrink-0">
            <Input
              containerClassName="hidden lg:block w-[180px] xl:w-[220px]"
              icon={faMagnifyingGlass}
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
            <div className="relative">
              {notification && (<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full z-10" />)}
              <Button
                icon={faBell}
                variant={"ghost"}
                size="sm"
                onClick={handleNotification}
                aria-label="Notifications"
                className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none"
              />
            </div>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div className="relative">
              <Button
                icon={faUser}
                variant={"ghost"}
                size="sm"
                className="hover:bg-gray-100 cursor-pointer rounded-full"
                label={"profile"}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
              {isProfileOpen && (
                <div className="absolute right-0 z-10 mt-2 flex flex-col w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-100 cursor-pointer">
                  <Link
                    to={"/profile"}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Profile
                  </Link>
                  <Link
                    to={"/setting"}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Setting
                  </Link>
                  <Button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>

            <Button
              className="md:hidden p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FontAwesomeIcon icon={faXmark} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-4 space-y-4">
            <Input
              containerClassName="sm:hidden"
              icon={faMagnifyingGlass}
              type="text"
              placeholder="Search FriendLeap..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />

            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-600">
              {navLinks.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`transition-colors block rounded-md px-3 py-2 font-medium ${
                        isActive
                          ? "text-green-600 bg-indigo-50 font-semibold"
                          : "hover:text-red-600 hover:bg-gray-50"
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
      <div className="h-[73px]"></div>
    </>
  );
};

export default Navbar;
