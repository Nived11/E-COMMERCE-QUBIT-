import React, { useState } from "react";
import "../CSS/Login.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import w from "../assets/w.jpg";
import ApiPath from "../ApiPath";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${ApiPath()}/login`, data);
      if (res.status === 200) {
        const { token, msg } = res.data;
        if (token) {
          console.log("Token received:", token);
          localStorage.setItem("token", token);
          toast.success(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setData({ email: "", password: "" });
          setTimeout(() => navigate("/Home"), 3000);
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        alert("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-blue-200 px-4 sm:px-6 lg:px-8">
      {/* Larger Container with Increased Height */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[500px] md:h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section (Hidden on Small Screens) */}
        <div className="hidden md:flex w-1/2 items-end justify-center">
          <img
            src={w}
            alt="Login Illustration"
            className=" object-cover"
          />
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 space-y-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-blue-900">Login</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-blue-900">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900" />
                <input
                  type="email"
                  className="w-full p-3 pl-10 mt-1 text-blue-900 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-700 outline-none"
                  placeholder="Enter your email"
                  required
                  name="email"
                  value={data.email}
                  onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900">Password</label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 pl-10 pr-10 mt-1 text-blue-900 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-700 outline-none"
                  placeholder="Enter your password"
                  required
                  name="password"
                  value={data.password}
                  onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <a href="/forgetpassword" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center text-blue-900">
            Don't have an account? <a href="/registration" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
