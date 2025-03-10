import React, { useState, useEffect } from 'react';
import { Home, Users, Package, Store, LogOut, Phone, Mail, User, DollarSign, ShoppingCart, Tag, Search, Briefcase } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import ApiPath from '../ApiPath';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminHome() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0); 
  const navigate = useNavigate();

  const getProducts = async() => {
    try {
      const res = await axios.get(`${ApiPath()}/allproducts`);
      if(res.status === 200){
        const {data} = res;
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } 
  }
 
  const handleBlockProduct = async(_id) => {
    try {
      console.log(_id);
      const res = await axios.post(`${ApiPath()}/blockproduct`, {_id});
      if(res.status === 200){
        getProducts();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getUsers = async() => {
    try {
      const res = await axios.get(`${ApiPath()}/allusers`);
      if(res.status === 200){
        const {data} = res;
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } 
  }

  useEffect(() => {
    getProducts();
    getUsers();
  }, []);

  const handleBlockUser = async(_id) => {
    try {
      console.log(_id);
      const res = await axios.post(`${ApiPath()}/blockuser`, {_id});
      if(res.status === 200){
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }

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
    setTimeout(() => {
      navigate("/admin")
    }, 3000)
    setCount(count + 1);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };


  const getStockColor = (stock) => {
    if (stock > 50) return 'text-green-600';
    if (stock > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Management</h1>
            <div className="flex flex-wrap gap-8">
              {users.map(user => (
                user.accountType === "buyer" && (
                  <div key={user._id} className="md:h-60 md:w-70 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium bg-blue-500">
                          {`${user.fname.charAt(0).toUpperCase()}${user.lname.charAt(0).toUpperCase()}`}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{user.fname} {user.lname}</h3>
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
                      <button 
                        onClick={() => handleBlockUser(user._id)}
                        className={`cursor-pointer w-full ${user.block ? 'bg-red-500' : 'bg-gray-800'} text-white text-sm font-medium py-2 
                        rounded-md hover:bg-gray-600 transition duration-300`}>
                        {user.block ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        );
      
      case 'products':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Management</h1>
            <div className="mb-4 flex">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-4 py-2 border border-gray-300 rounded-md w-full pr-10"
                />
                <button className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                  <Search size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="p-4 flex-1">
                    <div className="w-full h-40 bg-gray-200 mb-4 rounded-md flex items-center justify-center">
                      <img src={product.productimages[0]} alt={product.productname} className="max-h-full max-w-full" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.productname}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Tag size={16} className="mr-2" />
                        <span>{product.category}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        <span>${product.price}</span>
                      </div>
                      <div className="flex items-center">
                        <ShoppingCart size={16} className="mr-2" />
                        <span className={getStockColor(product.stock)}>
                          Stock: {product.quantity} units
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-center">
                    <button 
                      onClick={() => handleBlockProduct(product._id)} 
                      className={`cursor-pointer w-full ${product.block ? 'bg-red-500' : 'bg-gray-500'} text-white text-sm font-medium py-2 
                      rounded-md hover:bg-gray-600 transition duration-300`}
                    >
                      {product.block ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'sellers':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Management</h1>
            <div className="flex flex-wrap gap-8">
              {users.map(seller => (
                seller.accountType === "seller" && (
                  <div key={seller._id} className="md:w-80 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium bg-blue-500">
                          {`${seller.fname.charAt(0).toUpperCase()}${seller.lname.charAt(0).toUpperCase()}`}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{seller.fname} {seller.lname}</h3>
                          <p className="text-sm text-gray-600">{seller.companyName}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail size={16} className="mr-2" />
                          <span>{seller.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone size={16} className="mr-2" />
                          <span>{seller.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Briefcase size={16} className="mr-2" />
                          <span>{seller.companyName}</span>
                        </div>
                        
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-600 mr-2">Company Proof:</span>
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              <img src={seller.companyProof} alt="Company Proof" className="max-h-full max-w-full" />
                            </div>
                          </div>
                       
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex">
                      <button 
                        onClick={() => handleBlockUser(seller._id)} 
                        className={`cursor-pointer w-full ${seller.block ? 'bg-red-500' : 'bg-gray-800'} text-white text-sm font-medium py-2 
                        rounded-md hover:bg-gray-600 transition duration-300`}>
                        {seller.block ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        );
      
      default:
        const totalUsers = users.filter(user => user.accountType === "buyer").length;
        const totalSellers = users.filter(user => user.accountType === "seller").length;
        const totalProducts = products.length;
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-700 mb-4">Welcome to your admin dashboard!</p>
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-blue-100 p-4 rounded flex items-center">
                  <Users size={24} className="text-blue-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">{totalUsers}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded flex items-center">
                  <Package size={24} className="text-green-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">{totalProducts}</p>
                    <p className="text-sm text-gray-500">Products</p>
                  </div>
                </div>
                <div className="bg-purple-100 p-4 rounded flex items-center">
                  <Store size={24} className="text-purple-500 mr-2" />
                  <div>
                    <p className="text-lg font-bold">{totalSellers}</p>
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
      <nav className="h-20 bg-gray-800 flex items-center justify-between px-6 shadow-md">
        <div className="text-white font-bold text-3xl">
          Qubit
        </div>
        
        <div className="relative">
          <div 
            className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-white font-medium">AD</span>
          </div>
        
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
              <button 
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  logOut();
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
              Buyer
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
            <li 
              className="text-gray-200 font-medium hover:bg-gray-700 p-2 rounded cursor-pointer flex items-center"
              onClick={logOut}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-100 flex-1 p-6">
          {renderContent()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminHome;