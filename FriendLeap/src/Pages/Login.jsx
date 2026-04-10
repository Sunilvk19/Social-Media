import React, { useState } from "react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { addUser, getUser } from "../services/indexedDB";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  
  const handleRegisterUser = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill all the fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setError("");
      setFormData({ name: "", email: "", password: "" });
      setIsLogin(true);
      alert("User registered successfully");
    } catch (err) {
      setError("A user with this email already exists!");
    }
  };
  
  const handleLoginUser = async () => {
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password");
      return;
    }
    
    try {
      const user = await getUser(formData.email);
      
      if (!user) {
        setError("No account found with this email. Please register.");
        return;
      }
      if (user.password !== formData.password) {
        setError("Invalid email or password");
        return;
      }
      
      setError("");
      setFormData({ name: "", email: "", password: "" });
      alert(`Welcome back, ${user.name}! You are logged in.`);
    } catch (err) {
      setError("An error occurred trying to connect to the database.");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold w-full text-center mb-8 text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                <Input
                  type="text"
                  placeholder={"Enter your name"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
              <Input
                type="email"
                placeholder={"Enter your email"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
              <Input
                type="password"
                placeholder={"Enter your password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <Button
              label={isLogin ? "Sign In" : "Register"}
              onClick={isLogin ? handleLoginUser : handleRegisterUser}
              className="w-full py-3 mt-4"
            />
            
            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-indigo-600 hover:text-indigo-500 font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
