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
    <div className="min-h-screen flex font-sans selection:bg-cyan-500/30">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img 
          src={background} 
          alt="Login background" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-br from-brand-dark/90 via-brand-dark/70 to-transparent mix-blend-multiply" />
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
               <div className="w-7 h-7 bg-cyan-400 rounded-lg transform rotate-12" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Friend<span className="text-cyan-400">Leap</span></h1>
          </div>

          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <h2 className="text-7xl font-black leading-none mb-8 tracking-tighter">
              Connect. <br />
              <span className="text-cyan-400">Share.</span> <br />
              Grow.
            </h2>
            <p className="text-xl text-white/60 font-bold leading-relaxed max-w-md">
              Build your professional network like never before with FriendLeap's next-gen social experience.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-bold text-white/20">
            <span>&copy; 2026 FriendLeap</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-16 bg-brand-dark relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 lg:hidden" />
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/40 font-bold text-lg leading-relaxed">
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
                  className="rounded-2xl border-white/10 bg-white/5 py-5 focus:bg-white/10 text-white placeholder:text-white/20 shadow-none transition-all"
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-2xl border-white/10 bg-white/5 py-5 focus:bg-white/10 text-white placeholder:text-white/20 shadow-none transition-all"
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
              className="rounded-2xl border-white/10 bg-white/5 py-5 focus:bg-white/10 text-white placeholder:text-white/20 shadow-none transition-all"
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-2xl border-white/10 bg-white/5 py-5 focus:bg-white/10 text-white placeholder:text-white/20 shadow-none transition-all"
              required
            />

            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-sm font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 text-rose-500 text-sm p-5 rounded-2xl border border-rose-500/20 animate-in fade-in zoom-in duration-300 flex items-center gap-3 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-linear-to-r from-cyan-400 to-indigo-500 text-black rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-white/5">
            <p className="text-white/30 font-bold">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-3 font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest text-sm"
              >
                {isLogin ? "Sign up for free" : "Sign in to account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;