import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart, FiChevronDown, FiUser } from "react-icons/fi";
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
  const [searchFocused, setSearchFocused] = useState(false);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId")
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
    setTimeout(() => {
      navigate("/")
    }, 3000)
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
        setFilterOpen && setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSellClick = () => {
    navigate(`/sell/${user._id}`);
  };

  const getUserInitial = () => {
    return user.fname ? user.fname.charAt(0).toUpperCase() : "U";
  };

  return (
    <div>
      <nav className="nav fixed top-0 w-full shadow-md z-100">
        <div className="mx-auto flex items-center justify-between px-4 py-4">
          <div className="text-4xl ml-5 font-bold logo-text cursor-pointer" 
            onClick={() => navigate("/home")}>
            Qubit
          </div>
          <div className={`relative search-container flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex ${searchFocused ? 'focused' : ''}`}>
            <input type="text" placeholder="Search..."
              className="search-input w-full p-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none md:mr-4"
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
            <FiSearch className="search-icon absolute text-xl left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            {user.accountType === "seller" && location.pathname !== `/sell/${user._id}` && (
              <button onClick={handleSellClick}
                className="sell-button flex items-center space-x-1 text-gray-800 px-5 py-2 rounded-full transition cursor-pointer" >
                <MdSell className="text-gray-800" />
                <span>Sell</span>
              </button>
            )}
            <FiHeart className="nav-icon md:text-2xl cursor-pointer z-20" title="Wishlist" />
            <div className="relative cart-icon" onClick={() => navigate("/cart")}>
              <span className="cart-badge absolute -top-2 -right-2 text-xs rounded-full bg-red-500 w-5 h-5 flex items-center justify-center z-20">
                1
              </span>
              <FiShoppingCart className="nav-icon md:text-2xl cursor-pointer relative z-10" title="Cart" />
            </div>

        
            <div className="relative" ref={dropdownRef}>
              <div className="cursor-pointer rounded-md"
                onClick={() => setDropdownOpen(!dropdownOpen)} >
                <div className="profile-icon h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="profile-initial">{getUserInitial()}</span>
                </div>
              </div>

              
              {dropdownOpen && (
                <div className="dropdown-menu absolute right-0 mt-2 w-40 z-10">
                  <div onClick={() => navigate(`/profile/${user._id}`)}
                    className="dropdown-item flex items-center cursor-pointer" >
                    <FiUser className="dropdown-icon mr-2" />
                    <span>Profile</span>
                  </div>
                  <div onClick={logOut}className="dropdown-item flex items-center cursor-pointer">
                    <MdLogout className="dropdown-icon mr-2" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

       {/* //mobile search bar */}
        <div className="w-full pb-4 md:hidden px-4">
          <div className={`relative search-container w-full ${searchFocused ? 'focused' : ''}`}>
            <input type="text"  placeholder="Search..."
              className="search-input w-full p-2 pl-10 rounded-full bg-white text-gray-800"
              onFocus={() => setSearchFocused(true)}onBlur={() => setSearchFocused(false)}/>
            <FiSearch className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
}

export default Nav;