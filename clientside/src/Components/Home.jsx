import React, { useState, useRef } from "react";
import Nav from "./Nav";
import { toast } from "react-toastify";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown, FiFilter,FiPlus } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import prod from "../assets/prod.jpg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const filterRef = useRef(null);
  


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
    <Nav />

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