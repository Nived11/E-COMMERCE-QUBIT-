import React, { useState, useEffect, useRef } from "react";
import profile from "../assets/profile.jpg";
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiChevronDown, FiSave, 
         FiShoppingBag, FiMapPin, FiEdit3, FiPlus } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

function Profile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState({
    firstName: "Nived",
    lastName: "S",
    phone: "956565655",
    email: "nived@123.com",
    addresses: []
  });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const AddressSection = () => (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <FiPlus className="mr-2" /> Add Address
        </button>
      </div>
    </div>
  );

  const ProfileSection = () => (
    <div className="relative max-w-2xl mx-auto">
      <FiEdit3 className="absolute top-0 right-0 text-gray-600 text-2xl cursor-pointer"  onClick={handleEdit} />
      <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} disabled={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} disabled={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input type="text" name="phone" value={userData.phone} onChange={handleChange} disabled={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100" />
        </div>
      </div>
      
      {isEditing && (
        <button onClick={handleSave} 
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded flex items-center hover:bg-blue-700">
          <FiSave className="mr-2" /> Save
        </button>
      )}
    </div>
  )

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
              <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-800 rounded-md" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiUser className="text-white text-2xl" />
                <span className="text-white hidden md:inline">Nived</span>
                <FiChevronDown className={`text-white transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                    <FiUser className="mr-2"/> Profile</a>
                  <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                    <MdLogout className="mr-2"/> Logout </a>
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
          <h2 className="text-xl font-semibold mb-6">{userData.firstName} {userData.lastName}</h2>
          
          <ul className="w-full space-y-2">
            <li className={`flex items-center p-3 cursor-pointer rounded ${activeSection === 'orders' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveSection('orders')} >
              <FiShoppingBag className="mr-2" /> Orders
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${activeSection === 'wishlist' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveSection('wishlist')}>
              <FiHeart className="mr-2" /> Wishlists
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${activeSection === 'profile' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveSection('profile')}>
              <FiUser className="mr-2" /> Profile Info
            </li>
            <li className={`flex items-center p-3 cursor-pointer rounded ${activeSection === 'address' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveSection('address')} >
              <FiMapPin className="mr-2" /> Address
            </li>
            <li className="flex items-center p-3 hover:bg-gray-800 cursor-pointer rounded">
              <MdLogout className="mr-2" /> Logout
            </li>
          </ul>
        </div>

        <div className="flex-1 p-6 bg-gray-100">
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'address' && <AddressSection />}
        </div>
      </div>
    </div>
  );
}

export default Profile;