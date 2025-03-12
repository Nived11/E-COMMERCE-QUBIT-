import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiHeart, FiChevronDown, FiUser } from "react-icons/fi";
import { MdLogout, MdSell, MdLogin } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({});
  const dropdownRef = useRef(null);
  const searchResultsRef = useRef(null);
  const searchInputRef = useRef(null);
  const [count, setCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const filterRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  let token = localStorage.getItem("token");

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
      navigate("/login");
    }, 3000);
    setCount(count + 1);
  };

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
        setTimeout(() => navigate("/login"), 3000);
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
      
      // Modified this part to check if the click is on a search result
      const isClickOnSearchResult = event.target.closest('.search-result-item');
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target) && 
        !searchInputRef.current.contains(event.target) &&
        !isClickOnSearchResult
      ) {
        setShowSearchResults(false);
      }
      
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest(".filter-toggle-btn")
      ) {
        setFilterOpen && setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSellClick = () => {
    navigate(`/sell/${user._id}`);
  };

  const searchDetails = async () => {
    if (search.trim() === "") {
      setSearchFilter([]);
      return;
    }
    try {
      const res = await axios.post(`${ApiPath()}/search`, { search });
      if (res.status === 200) {
        const { products } = res.data;
        setSearchFilter(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchDetails();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search]);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    if (search.trim() !== "" && searchFilter.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleProductClick = (productId) => {
    console.log("Navigating to product:", productId);
    // We'll use a small delay to ensure the click is processed before navigating
    setTimeout(() => {
      navigate(`/productdetails/${productId}`);
      setShowSearchResults(false);
      setSearch("");
    }, 50);
  };

  return (
    <div>
      <nav className="nav fixed top-0 w-full shadow-md z-100">
        <div className="mx-auto flex items-center justify-between px-4 py-4">
          <div
            className="text-4xl ml-5 font-bold logo-text cursor-pointer"
            onClick={() => navigate("/")}
          >
            Qubit
          </div>
          <div
            className={`relative search-container flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg hidden md:flex ${
              searchFocused ? "focused" : ""
            }`}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="search-input w-full p-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none md:mr-4"
              onFocus={handleSearchFocus}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim() !== "") {
                  setShowSearchResults(true);
                } else {
                  setShowSearchResults(false);
                }
              }}
            />
            <FiSearch className="search-icon absolute text-xl left-3 top-1/2 transform -translate-y-1/2" />
            
            {/* Desktop Search Results Dropdown */}
            {showSearchResults && searchFilter.length > 0 && (
              <div 
                ref={searchResultsRef}
                className="absolute left-0 right-0 mt-2 z-10 top-full bg-white max-h-96 overflow-y-auto "
                style={{
                  scrollbarWidth: 'none',
                  borderRadius: "3px 3px 15px 15px ",
                  animation: 'dropdownFade 0.3s ease',
                  background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  borderLeft: '3px solid #3b82f6',
                  borderRight: '3px solid #3b82f6'
                  
                }}
              >
                {searchFilter.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="search-result-item flex items-center  p-2 hover:bg-blue-50 cursor-pointer transition-all duration-300"
                    style={{
                      borderBottom: '1px solid rgba(209, 213, 219, 0.5)',
                      position: 'relative'
                    }}
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <img
                        src={product.productimages && product.productimages[0]}
                        alt={product.productname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 ">
                      <h3 className="font-medium text-gray-800 line-clamp-1">{product.productname}</h3>
                      <p className="text-blue-600 font-bold">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            {user.accountType === "seller" &&
              location.pathname !== `/sell/${user._id}` && (
                <button
                  onClick={handleSellClick}
                  className="sell-button flex items-center space-x-1 text-gray-800 px-5 py-2 rounded-full transition cursor-pointer"
                >
                  <MdSell />
                  <span>Sell</span>
                </button>
              )}
            {token && (
              <div
                className="relative cart-icon"
                onClick={() => navigate("/cart")}
              >
                <FiShoppingCart
                  className="nav-icon md:text-2xl cursor-pointer relative z-10"
                  title="Cart"
                />
              </div>
            )}

            <div className="relative" ref={dropdownRef}>
              <div
                className="cursor-pointer rounded-md"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="profile-icon h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="profile-initial">
                    {user.fname ? (
                      user.fname.charAt(0).toUpperCase()
                    ) : (
                      <FiUser className="text-2xl text-white" />
                    )}
                  </span>
                </div>
              </div>

              {token ? (
                dropdownOpen && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-40 z-10">
                    <div
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="dropdown-item flex items-center cursor-pointer"
                    >
                      <FiUser className="dropdown-icon mr-2" />
                      <span>Profile</span>
                    </div>
                    <div
                      onClick={logOut}
                      className="logout-button dropdown-item flex items-center cursor-pointer"
                    >
                      <MdLogout className="logout-icon mr-2" />
                      <span>Logout</span>
                    </div>
                  </div>
                )
              ) : (
                dropdownOpen && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-40 z-10">
                    <div
                      onClick={() => navigate("/login")}
                      className="dropdown-item flex items-center justify-center cursor-pointer"
                    >
                      <span>Login</span>
                      <MdLogin className="login-icon ml-2 hover:text-white" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-4 md:hidden px-4">
          <div
            className={`relative search-container w-full ${
              searchFocused ? "focused" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Search..."
              className="search-input w-full p-2 pl-10 rounded-full bg-white text-gray-800"
              onFocus={handleSearchFocus}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim() !== "") {
                  setShowSearchResults(true);
                } else {
                  setShowSearchResults(false);
                }
              }}
            />
            <FiSearch className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2" />
            
            {/* Mobile Search Results Dropdown */}
            {showSearchResults && searchFilter.length > 0 && (
              <div 
                ref={searchResultsRef}
                className="dropdown-menu absolute left-0 right-0 mt-2 z-10 top-full bg-white max-h-96 overflow-y-auto"
                style={{
                  borderRadius: '15px 0px',
                  animation: 'dropdownFade 0.3s ease',
                  background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  borderLeft: '3px solid #3b82f6'
                }}
              >
                {searchFilter.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="search-result-item flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-all duration-300"
                    style={{
                      borderBottom: '1px solid rgba(209, 213, 219, 0.5)',
                      position: 'relative'
                    }}
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                      <img
                        src={product.productimages && product.productimages[0]}
                        alt={product.productname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-1">{product.productname}</h3>
                      <p className="text-blue-600 font-bold">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      <ToastContainer />
    </div>
  );
}

export default Nav;