import React, { useState } from "react";
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

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = ["Home", "Explore", "Messages", "Setting"];
  const [active, setActive] = useState("Home");
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-3 items-center gap-4">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity justify-self-start">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
            F
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 tracking-tight hidden sm:block">
            FriendLeap
          </span>
        </div>

        {/* Center: Navigation */}
        <ul className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-gray-600 whitespace-nowrap justify-self-center">
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
        <div className="flex items-center justify-end gap-3 sm:gap-5 justify-self-end w-full">
          {/* Search Bar */}
          <Input
            containerClassName="hidden xl:block w-full max-w-[200px]"
            icon={faMagnifyingGlass}
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />

          {/* Icon Button (Notifications) */}
          <Button
            icon={faBell}
            variant={"ghost"}
            size="sm"
            aria-label="Notifications"
            className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none"
          />

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Profile Dropdown Trigger */}
          <Button
            icon={faUser}
            variant={"ghost"}
            size="sm"
            className="focus:outline-none group"
            label={"profile"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Mobile Menu Toggle */}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-4 space-y-4">
          {/* Mobile Search Bar */}
          <Input
            containerClassName="sm:hidden"
            icon={faMagnifyingGlass}
            type="text"
            placeholder="Search FriendLeap..."
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />

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
