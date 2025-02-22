import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown, FiPlus,  } from "react-icons/fi";  
import { MdLogout } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";




function Nav(){
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [user, setUser] = useState({});
      const dropdownRef = useRef(null);
      const [count, setCount] = useState(0);
      const location = useLocation();
      const navigate = useNavigate();
      const filterRef = useRef(null);
      


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

        const handleSellClick=()=>{
          navigate(`/sell/${user._id}`);
          }
      
    return(
        <div>
             <nav className="fixed top-0 w-full bg-gray-900 shadow-md z-50">
                   <div className="mx-auto flex items-center justify-between px-4 py-4">
                     <div className="text-white text-2xl font-bold cursor-pointer md:mr-4 "
                       onClick={() => navigate("/home")}>Logo</div>
                     <div className="relative flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex">
                       <input
                         type="text"
                         placeholder="Search..."
                         className="w-full p-2 pl-10 border border-white rounded-md bg-gray-800 text-white focus:outline-none md:mr-4"
                       />
                       <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                     </div>
                     <div className="flex items-center space-x-4 md:space-x-6">
                     {user.accountType === "seller" && location.pathname !== `/sell/${user._id}` && (
                          <button
                            onClick={handleSellClick}
                            className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition cursor-pointer">
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
                             <div onClick={() => navigate(`/profile/${user._id}`)} className="dropitem block px-4 py-2 text-black hover:bg-gray-100">
                               Profile
                             </div>
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
                 <ToastContainer/>
        </div>
    )
}

export default Nav;