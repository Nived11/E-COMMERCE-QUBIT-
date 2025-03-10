import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApiPath from "../ApiPath";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Resetpassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({ password: "", cpassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${ApiPath()}/updatepassword`, data); 
      if (res.status === 201) {
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  
        setTimeout(() => {
          navigate("/admin");
        }, 3000);
  
        setData({ password: "", cpassword: "" });
      }
    } catch (error) {
      console.error(error); 
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium">New Password</label>
            <div className="flex items-center bg-gray-700 rounded-lg mt-1">
              <input type={showPassword ? "text" : "password"} required  className="w-full p-3 bg-transparent outline-none"
              value={data.password} name="password"
              onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}  className="text-gray-400 mx-3" >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">Confirm Password</label>
            <div className="flex items-center bg-gray-700 rounded-lg mt-1">
              <input type={showConfirmPassword ? "text" : "password"} required className="w-full p-3 bg-transparent outline-none"
                value={data.cpassword} name="cpassword"
                onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 mx-3" >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>
          <button type="submit"
            className="w-full p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            Reset Password
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Resetpassword;