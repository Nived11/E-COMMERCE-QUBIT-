import React, { useState, useEffect } from "react";
import profile from "../assets/profile.jpg";
import { HiUser, HiHeart, HiShoppingBag, HiLocationMarker, HiHome, HiCollection } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfileSection from "./profileSection";
import AddressSection from "./AddressSection";
import ProductSection from "./ProductSection";
import Nav from "./Nav";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast, ToastContainer } from "react-toastify";
import OrderSection from "./OrderSection";  


function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = location.state?.section || 'default';
  const [section, setSection] = useState(location.state?.section || 'profile');
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({});
  
  
  useEffect(() => {
    if (location.state?.section) {
      setSection(location.state.section);
    }
  }, [location.state]);
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
    return;
  }
  try {
    const res = await axios.get(`${ApiPath()}/home`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200 && res.data) {
      setUser(res.data);
    }
  } catch (error) {
    if (error.response) {
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
      localStorage.removeItem("token");
      setTimeout(() => navigate("/login"), 3000);
    }
  }
};


  
  useEffect(() => {
    getUser();
  }, [count]);
  
  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      
      <div className="flex-1 flex flex-col md:flex-row mt-30 md:mt-20 overflow-hidden">
        {/* Updated class name for the sidebar */}
        <div className="w-full md:w-64 profile-sidebar p-6 mt-1 flex flex-col items-center overflow-y-auto md:h-[calc(99vh-80px)]">
          {/* Add pattern div with the new class */}
          <div className="profile-sidebar-pattern"></div>
          
          <img src={profile} alt="Profile" className="w-24 h-24 rounded-full border-2 border-indigo-500 mb-4" />
          <h2 className="text-xl font-semibold mb-6 text-indigo-200">{user.fname} {user.lname}</h2>
          
          <ul className="w-full space-y-2">
            <li 
              onClick={handleHomeClick}
              className="nav-menu-item home-link flex items-center p-3 cursor-pointer rounded hover:bg-gray-800 transition-colors duration-200"
            >
              <HiHome className="mr-2 nav-menu-icon text-white text-xl" /> 
              <span className="nav-menu-text text-white">Home</span>
            </li>
            {/* Other menu items */}
            <li className={`nav-menu-item flex items-center p-3 cursor-pointer rounded transition-colors duration-200 ${section === 'orders' ? 'bg-gray-800 text-indigo-300' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('orders')} >
              <HiShoppingBag className="mr-2 nav-menu-icon text-white text-xl" /> 
              <span className="nav-menu-text text-white">Orders</span>
            </li>
            
            <li className={`nav-menu-item flex items-center p-3 cursor-pointer rounded transition-colors duration-200 ${section === 'profile' ? 'bg-gray-800 text-indigo-300' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('profile')} >
              <HiUser className="mr-2 nav-menu-icon text-white text-xl" /> 
              <span className="nav-menu-text text-white">Profile Info</span>
            </li>
            <li className={`nav-menu-item flex items-center p-3 cursor-pointer rounded transition-colors duration-200 ${section === 'address' ? 'bg-gray-800 text-indigo-300' : 'hover:bg-gray-800'}`}
              onClick={() => setSection('address')} >
              <HiLocationMarker className="mr-2 nav-menu-icon text-indigo-400 text-xl" /> 
              <span className="nav-menu-text text-white">Address</span>
            </li>
            
            {user.accountType !== "buyer" && (
              <li className={`nav-menu-item flex items-center p-3 cursor-pointer rounded transition-colors duration-200 ${section === 'products' ? 'bg-gray-800 text-indigo-300' : 'hover:bg-gray-800'}`}
                onClick={() => setSection('products')} >
                <HiCollection className="mr-2 nav-menu-icon text-white text-xl" /> 
                <span className="nav-menu-text text-white">My Products</span>
              </li>
            )}
            
            <li onClick={logOut} className={`nav-menu-item logout-link flex items-center p-3 cursor-pointer rounded transition-colors duration-200`}>
              <HiArrowRightOnRectangle className="mr-2 nav-menu-icon text-xl " /> 
              <span className="nav-menu-text text-white">Logout</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 p-6 profile-content-area overflow-y-auto md:h-[calc(96vh-80px)]">
          {section === 'profile' && <ProfileSection />}
          {section === 'address' && <AddressSection />}
          {section === 'products' && <ProductSection />}
          {section === 'orders' && <OrderSection/>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Profile;