import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Button = ({
  label,
  children,
  onClick,
  className = "",
  type = "button",
  disabled,
  variant = "primary",
  size = "md",
  icon,
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-cyan-500 text-black-600 cursor-pointer",
    secondary: "bg-violet-200 text-gray-900 cursor-pointer",
    danger: "bg-red-600 text-white-600 cursor-pointer",
    ghost: "bg-transparent text-gray-700 cursor-pointer",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
    >
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
      {children}
    </button>
  );
};

export default Button;
