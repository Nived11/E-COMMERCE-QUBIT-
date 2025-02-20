import React, { useState, useEffect, useRef } from "react";
import profile from "../assets/profile.jpg";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown,
         FiShoppingBag, FiMapPin,FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./profileSection";
import AddressSection from "./AddressSection";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import ApiPath from "../ApiPath";

function Profile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [section, setSection] = useState('profile'); 
  const dropdownRef = useRef(null);
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
  
  // Profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 shadow-md">
        <div className="mx-auto flex items-center justify-between p-4">
          <div className="text-white text-2xl font-bold cursor-pointer">
            <a href="/home">Logo</a>
          </div>

          <div className="relative flex-grow max-w-lg hidden md:flex mx-4">
            <input type="text" placeholder="Search..."
              className="w-full p-2 pl-10 border border-white rounded-md bg-gray-800 text-white focus:outline-none"/>
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>

          <div className="flex items-center space-x-4">
            <FiHeart className="text-white text-2xl cursor-pointer" />
            <div className="relative">
              <span className="absolute -top-2 -right-2 text-white text-xs bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
              <FiShoppingCart className="text-white text-2xl cursor-pointer" />
            </div>

            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-800 rounded-md" 
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiUser className="text-white text-2xl" />
                <span className="text-white hidden md:inline">{user.fname}</span>
                <FiChevronDown className={`text-white transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center cursor-pointer">
                    <FiUser className="mr-2"/> Profile
                  </div>
                  <div onClick={logOut} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center cursor-pointer">
                    <MdLogout className="mr-2"/> Logout 
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:hidden">
          <div className="relative">
            <input type="text" placeholder="Search..."
              className="w-full p-2 pl-10 border border-white rounded-md bg-gray-800 text-white focus:outline-none"/>
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row">
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