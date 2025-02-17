import "../CSS/Forgetpassword.css";
import { FaEnvelope } from "react-icons/fa";


function ForgetPassword() {

 async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await axios.post(`${ApiPath()}/forgetpassword`, {email:e.target[0].value})
            console.log(res.data);
            
        } catch (error) {
            
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-2xl shadow-lg transform transition-all duration-500">
                <h2 className="text-2xl font-semibold text-center mb-6">Forget Password</h2>

                <form className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium">Email</label>
                        <div className="flex items-center bg-gray-700 rounded-lg mt-1">
                            <FaEnvelope className="text-gray-400 mx-3" />
                            <input type="email" required className="w-full p-3 bg-transparent outline-none" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300 cursor-pointer">
                        send mail
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;