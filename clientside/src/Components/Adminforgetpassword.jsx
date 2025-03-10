import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ApiPath from "../ApiPath";



function ForgetPassword() {
const [email, setEmail] = useState('');``
 async function handleSubmit(e) {
        e.preventDefault();
        try {
          const res = await axios.post(`${ApiPath()}/adminforgetpassword`, { email });
          if (res.status === 200) {
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
           setEmail('');
          }
            
        } catch (error) {
          console.error(error);
          toast.error(error.response.data.msg, {
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
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-2xl shadow-lg transform transition-all duration-500">
                <h2 className="text-2xl font-semibold text-center mb-6">Forget Password</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="block text-sm font-medium">Email</label>
                        <div className="flex items-center bg-gray-700 rounded-lg mt-1">
                            <FaEnvelope className="text-gray-400 mx-3" />
                            <input className="w-full p-3 bg-transparent outline-none"
                            type="email" required  placeholder="Enter your email" 
                            value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300 cursor-pointer">
                        send mail
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ForgetPassword;