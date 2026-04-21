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

    try {
      if (isLogin) {
        const user = await handleLogin(formData.email, formData.password);
        await localforage.setItem("Current_user", user);
        navigate("/home");
      } else {
        await handleRegister(formData);
        setIsLogin(true);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">

      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-linear-to-br from-purple-600 to-pink-500 p-10">
      <img src={background} alt="" className="w-full h-full object-cover" />
        <h1 className="text-5xl font-bold mb-4">FriendLeap</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          Connect. Share. Grow.  
          Build your network like never before.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md border-2 border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">

          <h2 className="text-3xl font-bold mb-6 text-black">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
               <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-200 border border-gray-700 text-black" />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-200 border border-gray-700 text-black" />
              </>

            )}

            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-200 border border-gray-700 focus:outline-none focus:border-purple-500 text-black"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-200 border border-gray-700 focus:outline-none focus:border-purple-500 text-black"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:scale-105 transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-black cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;