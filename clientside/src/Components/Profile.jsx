import React, { useState, useEffect, useRef } from "react";
import profile from "../assets/profile.jpg";
import { FiUser, FiHeart, FiShoppingBag, FiMapPin,FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./profileSection";
import AddressSection from "./AddressSection";
import Nav from "./Nav";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import ApiPath from "../ApiPath";

function Profile() {
  const [section, setSection] = useState('profile'); 
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({});
  const navigate = useNavigate();


const logOut = () => {
    localStorage.removeItem("token");
    toast.error("logout successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    setCount(count + 1);
}

  const getUser = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
        setTimeout(() => navigate("/"), 3000);
    }
    try {
        const res = await axios.get(`${ApiPath()}/home`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 200) {
            // console.log("User Data:", res.data); 
            setUser(res.data);
        }
    } catch (error) {
        console.error( error);
        if (error.response && error.response.data.msg === "Login time expired please login again") {
            localStorage.removeItem("token");
            setTimeout(() => navigate("/"), 3000);
        }
    }
  };
  
  useEffect(() => {
    getUser();
  }, [count]);
  
  


  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <div className="flex-1 flex flex-col md:flex-row mt-18">
        <div className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col items-center">
          <img src={profile} alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-500 mb-4" />
          <h2 className="text-xl font-semibold mb-6">{user.fname} {user.lname}</h2>
          
          <ul className="w-full space-y-2">
            <a href="/home" className={`flex items-center p-3 cursor-pointer rounded ${section === 'home' ? 'bg-gray-800' : 'hover:bg-gray-800'}`} >
              <FiHome className="mr-2" /> Home
            </a>
            <li className={`flex items-center p-3 cursor-pointer rounded ${section === 'orders' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('orders')} >
              <FiShoppingBag className="mr-2" /> Orders
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${section === 'wishlist' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('wishlist')}>
              <FiHeart className="mr-2" /> Wishlists
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${section === 'profile' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('profile')} >
              <FiUser className="mr-2" /> Profile Info
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${section === 'address' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('address')} >
              <FiMapPin className="mr-2" /> Address
            </li>
            <li onClick={logOut} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer rounded">
              <MdLogout className="mr-2" /> Logout
            </li>
          </ul>
        </div>

        <div className="flex-1 p-6 bg-gray-100">
          {section === 'profile' && <ProfileSection />}
          {section === 'address' && <AddressSection />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Profile;