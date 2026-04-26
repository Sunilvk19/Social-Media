import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleRegister } from "../services/Auth";
import localforage from "localforage";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import background from "../assets/images/loginpage.jpg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const user = await handleLogin(formData.email, formData.password);
        await localforage.setItem("Current_user", user);
        navigate("/home");
      } else {
        await handleRegister(formData);
        setIsLogin(true);
        alert("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  const handleForgotPassword = () => {
    setIsLogin(true);
    setError("Under going process....");
    
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img 
          src={background} 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/80 via-purple-900/60 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg transform rotate-12" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">FriendLeap</h1>
          </div>

          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h2 className="text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter">
              Connect. <br />
              <span className="text-indigo-400">Share.</span> <br />
              Grow.
            </h2>
            <p className="text-xl text-white/80 font-medium leading-relaxed max-w-md">
              Build your professional network like never before with FriendLeap's next-gen social experience.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-semibold text-white/60">
            <span>&copy; 2026 FriendLeap</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-16 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 lg:hidden" />
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              {isLogin ? "Enter your details to access your account" : "Join the next generation of social networking"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="rounded-2xl border-gray-100 bg-gray-50/50 py-4 focus:bg-white shadow-none"
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-2xl border-gray-100 bg-gray-50/50 py-4 focus:bg-white shadow-none"
                  required
                />
              </div>
            )}
            
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-4 focus:bg-white shadow-none"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-4 focus:bg-white shadow-none"
              required
            />

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-300 flex items-center gap-3 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.99] border-none"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-gray-500 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-white bg-indigo-600 hover:text-indigo-800 transition-colors decoration-2 underline-offset-4 hover:underline"
              >
                {isLogin ? "Sign up for free" : "Sign in to account"}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;