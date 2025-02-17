import React from "react";
import "../CSS/Login.css";
import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-white to-blue-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-900">Login</h2>
        <form className="space-y-4">   
          <div>
            <label className="block text-sm font-medium text-blue-900">Email</label>
            <div className="relative mt-1 ">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900" />
              <input 
                type="email" 
                className="w-full p-3 pl-10 mt-1 text-blue-900 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-700 outline-none  " 
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900">Password</label>
            <div className="relative mt-1" >
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900" />
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-3 pl-10 pr-10 mt-1 text-blue-900 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-700 outline-none" 
                placeholder="Enter your password"
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
            <a href="/forgetpassword" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
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
  );
}
