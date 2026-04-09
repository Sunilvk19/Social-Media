import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = ["Home", "Explore", "Messages","Setting"];
  const [active, setActive] = useState("Home");
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-1/6xl mx-auto px-8 py-4 flex items-center justify-between relative">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2 cursor-pointer z-10 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
            F
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 tracking-tight">
            FriendLeap
          </span>
        </div>

        {/* Center: Navigation */}
        <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-sm font-medium text-gray-600 whitespace-nowrap">
          {navLinks.map((item) => (
            <li
              key={item}
              className={`font-bold cursor-pointer py-2 transition-colors ${
                active === item
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <a 
                href={`#${item}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item);
                }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side: Search & Profile */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Search Bar */}
          <div className="relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors hover:cursor-pointer" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Icon Button (Notifications) */}
          <button className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none">
            <FontAwesomeIcon icon={faBell} size="sm" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Profile Dropdown Trigger */}
          <button className="flex items-center gap-2 focus:outline-none group">
            <div className="relative">
              <FontAwesomeIcon icon={faUser} size="lg" className="w-10 h-10 rounded object-cover border-2 border-transparent group-hover:border-indigo-500 transition-colors shadow-sm" />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-4 space-y-4">
          {/* Mobile Search Bar */}
          <div className="relative group sm:hidden">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search FriendLeap..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <ul className="flex flex-col gap-3 text-sm font-medium text-gray-600">
            {navLinks.map((card) => (
              <li
                key={card}
                className={`transition-colors cursor-pointer block rounded-md px-3 py-2 font-medium ${
                  active === card
                    ? "text-indigo-600 bg-indigo-50 font-semibold"
                    : "hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <a
                  href={`#${card}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(card);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {card}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
