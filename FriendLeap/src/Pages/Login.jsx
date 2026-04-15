import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { handleLogin, handleRegister } from "../services/Auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
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
      await handleRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setError("");
      setFormData({ name: "", email: "", password: "" });
      setIsLogin(true);
      alert("User registered successfully");
    } catch (err) {
      setError("Failed to register. Please try again");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLoginUser = async () => {
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      const user = await handleLogin(formData.email, formData.password);
      setError("");
      setFormData({ name: "", email: "", password: "" });
      alert(`Welcome back, ${user.name}! You are logged in.`);
      navigate("/home");
    } catch (err) {
      setError(
        err.message || "An error occurred trying to connect to the database.",
      );
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold w-full text-center mb-8 text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              isLogin ? handleLoginUser() : handleRegisterUser();
            }}
          >
            {!isLogin && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={"Enter your name"}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder={"Enter your email"}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder={"Enter your password"}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <Button
              type="submit"
              label={isLogin ? "Sign In" : "Register"}
              className="w-full py-3 mt-4"
            />
            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-indigo-600 hover:text-indigo-500 font-semibold"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
