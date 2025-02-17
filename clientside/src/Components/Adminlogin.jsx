import { useState } from "react";
import "../CSS/Adminlogin.css";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ApiPath from "../ApiPath";
import {Link, useNavigate} from "react-router-dom"
import {ToastContainer,toast} from "react-toastify"


export default function AdminLogin() {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data,setData]=useState({email:"",password:""})

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      const res=await axios.post(`${ApiPath()}/loginadmin`,data)
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
              setTimeout(() => navigate("/AdminHome"), 3000);
            } 
          } else {
            alert("Login failed. Please try again.");
          }
  }catch(error){
    console.log(error);
    if (error.response) {
        toast.error(error.response.data.msg,{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }else{
        alert("something went wrong try again later.."); 
    }
    }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-2xl shadow-lg transform transition-all duration-500 ">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium">Email</label>
            <div className="flex items-center bg-gray-700 rounded-lg mt-1">
              <FaEnvelope className="text-gray-400 mx-3" />
              <input type="email"  required className="w-full p-3 bg-transparent  outline-none" 
              name="email"  value={data.email} onChange={(e)=>setData((pre)=>({...pre,[e.target.name]:e.target.value}))}/>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium">Password</label>
            <div className="flex items-center bg-gray-700 rounded-lg mt-1">
              <FaLock className="text-gray-400 mx-3" />
              <input type={showPassword ? "text" : "password"}  required className="w-full p-3 bg-transparent outline-none"
               name="password" value={data.password} onChange={(e)=>setData((pre)=>({...pre,[e.target.name]:e.target.value}))} />
              <button type="button"  onClick={() => setShowPassword(!showPassword)} className="text-gray-400 mx-3 hover:cursor-pointer" >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <a href="/forgetpassword" className="text-sm text-blue-400 hover:underline">Forgot Password?</a>
          </div>
          <button type="submit"
            className="w-full p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 cursor-pointer" >
             Login
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}