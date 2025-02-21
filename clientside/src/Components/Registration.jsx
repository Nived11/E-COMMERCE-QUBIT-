import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Store, UserCircle2 } from "lucide-react";
import ApiPath from "../ApiPath";
import w from "../assets/w.jpg";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";

function Registration() {
    const navigate = useNavigate();
    const [accountType, setAccountType] = useState("buyer");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        password: "",
        cpassword: "",
        accountType: "",
        companyName: "",
        companyProof: null
    });
    const [count, setCount] = useState(0);

    const addUser = async(e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (let key in data) {
                formData.append(key, data[key]);
            }
            
            const res = await axios.post(`${ApiPath()}/adduser`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(res.status === 201) {
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
                    navigate("/");
                }, 3000);
                setData({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    password: "",
                    cpassword: "",
                    accountType: "",
                    companyName: "",
                    companyProof: null
                });
                setCount(count + 1);
            }
        } catch(error) {
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
                alert("Something went wrong try again later.."); 
            }
        }
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center py-6">
            <div className="w-[90%] max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img src={w} alt="Site illustration" className="absolute bottom-0 w-100% h-100 object-cover"/>
                </div>
                
                <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
                    <h2 className="text-3xl font-bold text-center mb-6">Registration</h2>
                    <form className="space-y-4" onSubmit={addUser}>
                        {/* Keep all existing fields exactly the same */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium">First Name</label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaUser className="text-gray-500 mr-3" />
                                    <input type="text" required className="w-full bg-transparent focus:ring-0 outline-none" 
                                    value={data.fname} name="fname"
                                    onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium">Last Name</label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaUser className="text-gray-500 mr-3" />
                                    <input type="text" required className="w-full bg-transparent focus:ring-0 outline-none" 
                                    value={data.lname} name="lname"
                                    onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium">Email</label>
                            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                <FaEnvelope className="text-gray-500 mr-3" />
                                <input type="email" required className="w-full bg-transparent focus:ring-0 outline-none" 
                                value={data.email} name="email"
                                onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium">Phone</label>
                            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                <FaPhone className="text-gray-500 mr-3" />
                                <input type="tel" required className="w-full bg-transparent focus:ring-0 outline-none" 
                                value={data.phone} name="phone"
                                onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium">Password</label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaLock className="text-gray-500 mr-3" />
                                    <input type={showPassword ? "text" : "password"} required className="w-full bg-transparent focus:ring-0 outline-none"
                                    value={data.password} name="password"
                                    onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 ml-3">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium">Confirm Password</label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaLock className="text-gray-500 mr-3" />
                                    <input type={showConfirmPassword ? "text" : "password"} required className="w-full bg-transparent focus:ring-0 outline-none" 
                                    value={data.cpassword} name="cpassword"
                                    onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 ml-3">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modified Account Type buttons with icons */}
                        <div>
                            <label className="block text-sm font-medium">Account Type</label>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                                <button type="button" onClick={() => setData(prev => ({ ...prev, accountType: "buyer" }))} 
                                    className={`px-5 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2
                                    ${data.accountType === "buyer" ? "bg-sky-500 text-white" : "bg-gray-100 border border-gray-300 text-gray-900 hover:bg-blue-200"}`}>
                                    <UserCircle2 size={20} />
                                    <span>Buyer</span>
                                </button>
                                <button type="button" onClick={() => setData(prev => ({ ...prev, accountType: "seller" }))} 
                                    className={`px-5 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2
                                    ${data.accountType === "seller" ? "bg-sky-500 text-white" : "bg-gray-100 border border-gray-300 text-gray-900 hover:bg-blue-200"}`}>
                                    <Store size={20} />
                                    <span>Seller</span>
                                </button>
                            </div>
                        </div>

                        {/* Conditional Seller Fields */}
                        {data.accountType === "seller" && (
                            <>
                                <div className="relative">
                                    <label className="block text-sm font-medium">Company Name</label>
                                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                        <Store className="text-gray-500 mr-3" size={16} />
                                        <input 
                                            type="text" 
                                            required 
                                            className="w-full bg-transparent focus:ring-0 outline-none"
                                            value={data.companyName}
                                            name="companyName"
                                            onChange={(e) => setData((prev) => ({ ...prev, companyName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium">Company Proof Document</label>
                                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                        <input 
                                            type="file" 
                                            required 
                                            className="w-full bg-transparent focus:ring-0 outline-none"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setData((prev) => ({ ...prev, companyProof: e.target.files[0] }))}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} 
                                className="mr-2 transform scale-105 cursor-pointer" required/>
                            <label className="text-sm cursor-pointer">
                                I accept the <a href="#" className="text-blue-600 underline">terms and conditions</a>
                            </label>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition-all duration-300 cursor-pointer">
                            Register
                        </button>
                        
                        <div className="text-center mt-4">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Registration;