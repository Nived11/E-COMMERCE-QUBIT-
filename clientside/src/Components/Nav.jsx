import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart, FiChevronDown } from "react-icons/fi";
import { MdLogout, MdSell } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const dropdownRef = useRef(null);
  const [count, setCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const logOut = () => {
    localStorage.removeItem("token");
    toast.error("Logout successfully", {
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
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${ApiPath()}/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
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
        setTimeout(() => navigate("/"), 3000);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [count]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target) && !event.target.closest('.filter-toggle-btn')) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSellClick = () => {
    navigate(`/sell/${user._id}`);
  };

  // Get user's first letter for the profile icon
  const getUserInitial = () => {
    return user.fname ? user.fname.charAt(0).toUpperCase() : "U";
  };

  return (
    <div>
      <nav
        className="fixed top-0 w-full shadow-md z-50"
        style={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          boxShadow: "0 4px 15px rgba(104, 109, 224, 0.5)",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="mx-auto flex items-center justify-between px-4 py-4">
          <div
            className="text-white text-2xl font-bold cursor-pointer md:mr-4"
            onClick={() => navigate("/home")}
          >
            Qubit
          </div>
          <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none md:mr-4"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            {user.accountType === "seller" && location.pathname !== `/sell/${user._id}` && (
              <button
                onClick={handleSellClick}
                className="flex items-center space-x-1 bg-white text-gray-800 px-3 py-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <MdSell className="text-gray-800" />
                <span>Sell</span>
              </button>
            )}
            <FiHeart className="text-white md:text-2xl cursor-pointer z-20" title="Wishlist" />
            <div className="relative">
              <span className="absolute -top-2 -right-2 text-white text-xs rounded-full bg-red-500 w-5 h-5 flex items-center justify-center z-20">
                1
              </span>
              <FiShoppingCart className="text-white md:text-2xl cursor-pointer relative z-10" title="Cart" />
            </div>

            <div className="relative" ref={dropdownRef}>
              <div
                className="flex flex-col items-center space-y-1 cursor-pointer p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{getUserInitial()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white text-sm md:text-base">{user.fname}</span>
                  <FiChevronDown
                    className={`text-white text-xl transition-transform duration-500 ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                  <div
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center rounded-t-md"
                  >
                    Profile
                  </div>
                  <div
                    onClick={logOut}
                    className="dropitem block px-4 py-2 text-black hover:bg-gray-100 flex items-center cursor-pointer rounded-b-md"
                  >
                    <MdLogout className="mr-2 text-black" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-4 md:hidden px-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
}

export default Nav;