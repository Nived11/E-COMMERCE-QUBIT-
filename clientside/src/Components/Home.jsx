import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

 function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <>
                                      //navigation part

    <nav className="fixed top-0 w-full bg-gray-900 shadow-md p-4">
      <div className="mx-auto flex items-center justify-between px-4 flex-wrap">
        <div className="text-white text-2xl font-bold cursor-pointer md:mr-4">Logo</div>
        <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex">
          <input type="text" placeholder="Search..."
           className="w-full p-2 pl-10 border border-white rounded-md bg-gray-800 text-white focus:outline-none md:mr-4" />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
            <FiHeart className="text-white md:text-2xl cursor-pointer z-20" title="Wishlist" />
            <div className="relative">
            <span className="absolute -top-2 -right-2 text-white text-xs rounded-full bg-red-500 w-5 h-5 flex items-center justify-center z-20"> 1 </span>
            <FiShoppingCart className="text-white md:text-2xl cursor-pointer relative z-10" title="Cart" />
        </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-1 md:space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800"
              onClick={() => setDropdownOpen(!dropdownOpen)} >
              <FiUser className="text-white text-xl md:text-2xl" />
              <span className="text-white text-sm md:text-base">Nived</span>
              <FiChevronDown className={`text-white text-xl transition-transform duration-500 ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
                <a href="/profile" className="dropitem block px-4 py-2 text-black hover:bg-gray-100">
                  Profile
                </a>
                <a href="/logout" className="dropitem block px-4 py-2 text-black hover:bg-gray-100 flex items-center">
                  <MdLogout className="mr-2 text-black" />
                   Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mt-4 md:hidden px-4">
        <div className="relative w-full">
          <input type="text" placeholder="Search..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"/>
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
      </div>
    </nav>


                                              // Body Part 


     <div className="flex   bg-blue-900">Home - Body</div>

    </>
  );
}

export default Home;