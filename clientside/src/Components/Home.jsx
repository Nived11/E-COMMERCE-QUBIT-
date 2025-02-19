import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown, FiFilter,FiPlus } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import prod from "../assets/prod.jpg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);
  const [user, setUser] = useState({});
  const [count, setCount] = useState(0);
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
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => navigate("/"), 3000);
      return;
    }
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
      if (error.response?.data.msg === "Login time expired please login again") {
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

  const handleApplyFilter = () => {
    toast.success("Filters applied successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setFilterOpen(false);
  };

  const handleSellClick=()=>{
    alert("product sell is comming soon..")
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900 shadow-md z-50">
        <div className="mx-auto flex items-center justify-between px-4 py-4">
          <div className="text-white text-2xl font-bold cursor-pointer md:mr-4">Logo</div>
          <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 border border-white rounded-md bg-gray-800 text-white focus:outline-none md:mr-4"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
          {user.accountType === 'seller' && (
              <button
                onClick={handleSellClick}
                className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition cursor-pointer" >
                <FiPlus className="text-lg" />
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
                className="flex items-center space-x-1 md:space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800"
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiUser className="text-white text-xl md:text-2xl" />
                <span className="text-white text-sm md:text-base">{user.fname}</span>
                <FiChevronDown
                  className={`text-white text-xl transition-transform duration-500 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                  <a href={`/Profile/${user._id}`} className="dropitem block px-4 py-2 text-black hover:bg-gray-100">
                    Profile
                  </a>
                  <div
                    onClick={logOut}
                    className="dropitem block px-4 py-2 text-black hover:bg-gray-100 flex items-center cursor-pointer"
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
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative">
        {/* Spacer for fixed nav */}
        <div className="h-[72px] md:h-[68px]"></div>

        {/* Filter button section */}
        <div className="sticky top-[120px] md:top-[64px] bg-white shadow-sm z-40 "> 
          <div className="px-5 py-5 flex justify-end md:justify-between items-center">
            <button 
              className="filter-toggle-btn flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex relative">
          {/* Filter Sidebar */}
          <div 
            ref={filterRef}
            className={`${filterOpen ? 'translate-x-0' : '-translate-x-full'} 
            transform transition-transform duration-300 fixed  left-0 w-64 bg-white shadow-lg z-30 overflow-y-auto p-4`}
            style={{ height: 'calc(100vh - 120px)' }}
          >
            <h2 className="text-lg  font-semibold mb-4 border-b pb-2">Filter Options</h2>
            
            {/* Category filter */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => setCategoryDropdown(!categoryDropdown)}
              >
                <h3 className="font-medium">Product Categories</h3>
                <FiChevronDown 
                  className={`transition-transform duration-300 ${categoryDropdown ? 'rotate-180' : 'rotate-0'}`} 
                />
              </div>
              
              {categoryDropdown && (
                <div className="pl-2 space-y-2 mt-2 border-l-2 border-gray-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span>Mobiles</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span>Watches</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span>Dresses</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600" />
                    <span>Electronics</span>
                  </label>
                </div>
              )}
            </div>
            
            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="mb-2 flex justify-between text-sm">
                <span>₹0</span>
                <span>₹{priceRange}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Apply button */}
            <button 
              onClick={handleApplyFilter}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-5 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4  ">
              {[1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">
                      <img className="h-48 w-full " src={prod} alt="" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">Product Name {item}</h3>
                    <p className="text-gray-600 text-sm mb-2">Category</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">₹{Math.floor(Math.random() * 10000) + 1000}</span>
                      <button className="text-blue-600 hover:text-blue-800">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;