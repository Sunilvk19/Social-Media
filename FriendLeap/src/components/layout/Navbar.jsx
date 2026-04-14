import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Post", path: "/post" },
    { name: "Explore", path: "/explore" },
    { name: "Messages", path: "/messages" },
  ];

  return (
   <>
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-3 items-center gap-4">
        <Link
          to="/home"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity justify-self-start"
        >
        <img src={image} alt="logo" className="w-12 h-12 rounded-2xl" />
        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-orange-500 tracking-tight hidden sm:block">
            FriendLeap
          </span>
        </Link>

        <ul className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-gray-600 whitespace-nowrap justify-self-center">
          {navLinks.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.name}
              className={`font-bold transition-colors ${isActive ? "text-cyan-600" : "text-gray-600 hover:text-orange-600"}`}
              >
                <Link to={item.path} className="py-2 inline-block">
                {item.name}</Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-end gap-3 sm:gap-5 justify-self-end w-full">
          <Input
            containerClassName="hidden xl:block w-full max-w-[200px]"
            icon={faMagnifyingGlass}
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />

          <Button
            icon={faBell}
            variant={"ghost"}
            size="sm"
            aria-label="Notifications"
            className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none"
          />

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <Button
            icon={faUser}
            variant={"ghost"}
            size="sm"
            className="focus:outline-none group"
            label={"profile"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

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
