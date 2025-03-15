import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Store, UserCircle2 } from "lucide-react";
import ApiPath from "../ApiPath";
import w from "../assets/w.jpg";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGlobe } from "react-icons/fa";
import {  validateForm,  validateEmail,  validatePhone,  validatePassword,  validateFirstName, validateLastName, validateCompanyName} from "./validation";

function Registration() {
    const navigate = useNavigate();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "+91 ",
        password: "",
        cpassword: "",
        accountType: "buyer",
        companyName: "",
        companyProof: null
    });
    const [errors, setErrors] = useState({});
    const [count, setCount] = useState(0);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setData((prev) => ({ ...prev, companyProof: base64 }));
                if (errors.companyProof) {
                    setErrors(prev => ({...prev, companyProof: ""}));
                }
            } catch (error) {
                console.error("Error converting file to base64:", error);
                toast.error("Error processing file");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ""}));
        }
        if (name === "fname" && value) {
            if (!validateFirstName(value)) {
                setErrors(prev => ({...prev, fname: "First name must be at least 3 characters and contain only letters"}));
            }
        }
        if (name === "lname" && value) {
            if (!validateLastName(value)) {
                setErrors(prev => ({...prev, lname: "Last name must contain only letters, no numbers or special characters"}));
            }
        }
        if (name === "email" && value) {
            if (!validateEmail(value)) {
                setErrors(prev => ({...prev, email: "Please enter a valid email address with @gmail.com"}));
            }
        }
        if (name === "phone" && value) {
            if (!validatePhone(value)) {
                setErrors(prev => ({...prev, phone: "Please enter a valid phone number with country code (e.g., +91 9999999999)"}));
            }
        }
        if (name === "password" && value) {
            if (!validatePassword(value)) {
                setErrors(prev => ({
                    ...prev, 
                    password: "Password must be at least 8 characters and include uppercase, lowercase, and numbers"
                }));
            }
            if (data.cpassword && data.cpassword !== value) {
                setErrors(prev => ({...prev, cpassword: "Passwords do not match"}));
            } else if (data.cpassword && data.cpassword === value) {
                setErrors(prev => ({...prev, cpassword: ""}));
            }
        }
        
        if (name === "cpassword" && value) {
            if (value !== data.password) {
                setErrors(prev => ({...prev, cpassword: "Passwords do not match"}));
            }
        }
        if (name === "companyName" && value) {
            if (!validateCompanyName(value)) {
                setErrors(prev => ({...prev, companyName: "Company name must be at least 3 characters and contain only letters"}));
            }
        }
    };

    const addUser = async (e) => {
        e.preventDefault();
        const validation = validateForm(data);
        
        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstError = Object.values(validation.errors)[0];
            toast.error(firstError, {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
            return;
        }
        
        try {
            const submissionData = {
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                phone: data.phone,
                password: data.password,
                cpassword: data.cpassword,
                accountType: data.accountType
            };

            if (data.accountType === "seller") {
                submissionData.companyName = data.companyName;
                if (data.companyProof) {
                    submissionData.companyProof = data.companyProof;
                }
            }

            const res = await axios.post(`${ApiPath()}/adduser`, submissionData);
            if (res.status === 201) {
                toast.success(res.data.msg, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    progress: undefined,
                    theme: "light",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
                setData({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "+91 ",
                    password: "",
                    cpassword: "",
                    accountType: "buyer",
                    companyName: "",
                    companyProof: null
                });
                setCount(count + 1);
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                toast.error(error.response.data.msg, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    progress: undefined,
                    theme: "light",
                });
            } 
        }
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center py-6">
            <div className="w-[90%] max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
            <div className="hidden lg:block logo-container"> <h1 className="logo-title">Qubit</h1> </div>
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img src={w} alt="Site illustration" className="absolute bottom-0 w-100% h-100% object-cover"/>
                </div>
                
                <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
                    <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">SignUp</h2>
                    <form className="space-y-4" onSubmit={addUser}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium">First Name </label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaUser className="text-gray-500 mr-3" />
                                    <input type="text"   required     className={`w-full bg-transparent focus:ring-0 outline-none ${errors.fname ? "border-red-500" : ""}`}
                                    value={data.fname} name="fname" onChange={handleInputChange}  />
                                </div>
                                {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium">Last Name</label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaUser className="text-gray-500 mr-3" />
                                    <input type="text" required className={`w-full bg-transparent focus:ring-0 outline-none ${errors.lname ? "border-red-500" : ""}`}
                                     value={data.lname} name="lname"onChange={handleInputChange} />
                                </div>
                                {errors.lname &&<p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium">Email</label>
                            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                <FaEnvelope className="text-gray-500 mr-3" />
                                <input type="email" required className={`w-full bg-transparent focus:ring-0 outline-none ${errors.email ? "border-red-500" : ""}`}
                                    value={data.email} name="email"onChange={handleInputChange} />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium">Phone</label>
                            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                <FaGlobe className="text-gray-500 mr-3" />
                                <input type="tel" required className={`w-full bg-transparent focus:ring-0 outline-none ${errors.phone ? "border-red-500" : ""}`}
                                    value={data.phone} name="phone"onChange={handleInputChange} />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium">Password </label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaLock className="text-gray-500 mr-3" />
                                    <input type={showPassword ? "text" : "password"} required className={`w-full bg-transparent focus:ring-0 outline-none ${errors.password ? "border-red-500" : ""}`}
                                        value={data.password} name="password"onChange={handleInputChange} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 ml-3 cursor-pointer">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium">Confirm Password </label>
                                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                    <FaLock className="text-gray-500 mr-3" />
                                    <input type={showConfirmPassword ? "text" : "password"} required 
                                        className={`w-full bg-transparent focus:ring-0 outline-none ${errors.cpassword ? "border-red-500" : ""}`}
                                        value={data.cpassword} name="cpassword"onChange={handleInputChange} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 ml-3 cursor-pointer">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.cpassword && <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Account Type</label>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                                <button type="button" onClick={() => setData(prev => ({ ...prev, accountType: "buyer" }))} 
                                    className={`px-5 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2
                                    ${data.accountType === "buyer" ? "bg-blue-800 text-white" : "bg-gray-100 border border-gray-300 text-gray-900 hover:bg-blue-200"}`}>
                                    <UserCircle2 size={20} />
                                    <span>Buyer</span>
                                </button>
                                <button type="button" onClick={() => setData(prev => ({ ...prev, accountType: "seller" }))} 
                                    className={`px-5 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2
                                    ${data.accountType === "seller" ? "bg-blue-800 text-white" : "bg-gray-100 border border-gray-300 text-gray-900 hover:bg-blue-200"}`}>
                                    <Store size={20} />
                                    <span>Seller</span>
                                </button>
                            </div>
                        </div>

                        {data.accountType === "seller" && (
                            <>
                                <div className="relative">
                                    <label className="block text-sm font-medium">Company Name</label>
                                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                        <Store className="text-gray-500 mr-3" size={16} />
                                        <input type="text" required
                                           className={`w-full bg-transparent focus:ring-0 outline-none ${errors.companyName ? "border-red-500" : ""}`}
                                            value={data.companyName}name="companyName"onChange={handleInputChange}/>
                                    </div>
                                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium">Company Proof Document</label>
                                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg p-2">
                                        <input type="file" required
                                            className={`w-full bg-transparent focus:ring-0 outline-none ${errors.companyProof ? "border-red-500" : ""}`}
                                            accept="image/*,.pdf"onChange={handleFileChange}/>
                                    </div>
                                    {errors.companyProof && <p className="text-red-500 text-xs mt-1">{errors.companyProof}</p>}
                                    {data.companyProof && (
                                        <p className="text-green-500 text-xs mt-1">Document uploaded successfully</p>
                                    )}
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
                        <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg transition-all duration-300 cursor-pointer">
                            Register
                        </button>
                        
                        <div className="text-center mt-4">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
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