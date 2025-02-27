import React, { useState } from 'react';
import { Home, Users, Package, Store, LogOut, Phone, Mail, User } from 'lucide-react';

function AdminHome() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // Default section

  // Sample user data
  const userData = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567' },
    { id: 2, firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@example.com', phone: '+1 (555) 987-6543' },
    { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.j@example.com', phone: '+1 (555) 234-5678' },
    { id: 4, firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@example.com', phone: '+1 (555) 876-5432' },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@example.com', phone: '+1 (555) 345-6789' },
    { id: 6, firstName: 'Jessica', lastName: 'Taylor', email: 'jessica.t@example.com', phone: '+1 (555) 654-3210' },
  ];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  // Function to get initials from name
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };
  
  // Function to get random background color for profile avatars
  const getAvatarBgColor = (id) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    return colors[id % colors.length];
  };

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>
            <div className="flex flex-wrap  gap-8">
              {userData.map(user => (
                <div key={user.id} className="md:h-60 md:w-70 bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarBgColor(user.id)}`}>
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail size={16} className="mr-2" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex">
                    <button className=" cursor-pointer w-full bg-gray-500 text-white text-sm font-medium py-2 rounded-md hover:bg-gray-600 transition duration-300">
                        Block
                    </button>
                    </div>

                </div>
              ))}
            </div>
          </>
        );
      
      case 'products':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Management</h1>
           
          </>
        );
      
      case 'sellers':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Management</h1>
           
          </>
        );
      
      default:
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-700 mb-4">Welcome to your admin dashboard!</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded flex items-center">
                  <Users size={24} className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">254</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded flex items-center">
                  <Package size={24} className="text-green-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">128</p>
                    <p className="text-sm text-gray-500">Products</p>
                  </div>
                </div>
                <div className="bg-purple-100 p-4 rounded flex items-center">
                  <Store size={24} className="text-purple-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">46</p>
                    <p className="text-sm text-gray-500">Sellers</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="h-20 bg-gray-800 flex items-center justify-between px-6 shadow-md">
        {/* Admin Logo */}
        <div className="text-white font-bold text-3xl">
          Qubit
        </div>
        
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <div 
            className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-white font-medium">AD</span>
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
              <button 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  // Logout functionality here
                  setShowDropdown(false);
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <div className="bg-gray-900 w-2/12 p-4 shadow-lg">
          <ul className="space-y-4">
            <li 
              className={`text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center ${activeSection === 'dashboard' ? 'bg-gray-700' : ''}`}
              onClick={() => handleMenuClick('dashboard')}
            >
              <Home size={18} className="mr-2" />
              Dashboard
            </li>
            <li 
              className={`text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center ${activeSection === 'users' ? 'bg-gray-700' : ''}`}
              onClick={() => handleMenuClick('users')}
            >
              <Users size={18} className="mr-2" />
              Users
            </li>
            <li 
              className={`text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center ${activeSection === 'products' ? 'bg-gray-700' : ''}`}
              onClick={() => handleMenuClick('products')}
            >
              <Package size={18} className="mr-2" />
              Products
            </li>
            <li 
              className={`text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center ${activeSection === 'sellers' ? 'bg-gray-700' : ''}`}
              onClick={() => handleMenuClick('sellers')}
            >
              <Store size={18} className="mr-2" />
              Sellers
            </li>
            <li className="text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center">
              <LogOut size={18} className="mr-2" />
              Logout
            </li>
          </ul>
        </div>
        
        {/* Main Content */}
        <div className="bg-gray-100 flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;