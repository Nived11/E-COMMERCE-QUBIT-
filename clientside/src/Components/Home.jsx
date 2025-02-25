import React, { useState, useRef, useEffect } from "react";
import Nav from "./Nav";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiDollarSign, FiTag, FiX } from "react-icons/fi";

function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const filterRef = useRef(null);
  const [products, setProducts] = useState([]);
  const categories = ["All", "Electronics", "Fashion", "Accessories", "Home & Kitchen"];
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Handle click outside filter to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterRef.current && 
        !filterRef.current.contains(event.target) && 
        !event.target.closest('.filter-toggle-btn')
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset filters
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
  };

  const getProducts = async() => {
    try {
      const res = await axios.get(`${ApiPath()}/allproducts`);
      console.log("API response:", res.data);
      if(res.status == 200){
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error);
      toast.error('Failed to fetch products');
    } 
  }
  useEffect(() => {
    getProducts();
    console.log("Current products:", products);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />

      <div className="h-38 md:h-20"></div>
      
      <div className="relative ">
        <div 
          ref={filterRef}
          className={`fixed left-0 top-32 md:top-20   h-full bg-white shadow-lg  z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            showFilter ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 h-full ">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Filter Products</h2>
              <button 
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-700 "
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            {/* Category filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                <FiTag className="text-gray-600" />
                Category
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Min price filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                <FiDollarSign className="text-gray-600" />
                Min Price
              </label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            
            {/* Max price filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                <FiDollarSign className="text-gray-600" />
                Max Price
              </label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-8">
              <button 
                onClick={() => {
                  // Apply filters is just closing the sidebar
                  setShowFilter(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
              >
                Apply Filters
              </button>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition border border-gray-300 rounded-md hover:bg-gray-50 w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        
        {/* Main content area */}
        <div className={`transition-all duration-300 ${showFilter ? "md:ml-64" : "ml-0"}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-end items-center ">
             
              <button 
                className="filter-toggle-btn flex items-center gap-2 bg-gray-800 text-white px-4 py-2 mb-10 rounded-md hover:bg-gray-700 transition cursor-pointer"
                onClick={() => setShowFilter(!showFilter)} >
                <FiFilter className="text-lg" />
                <span>Filter</span>
              </button>
            </div>
            
            {/* Product cards grid with fixed size cards - using Tailwind for centering */}
            <div className="flex flex-wrap justify-between  gap-8 " >
              {products.map((product) => (
                <div 
                  onClick={() => navigate(`/productdetails/${product._id}`)}
                  key={product._id} 
                  className="md:h-96 w-80 bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-lg transition-shadow duration-300 mx-auto cursor-pointer"
                >
                  <div className="h-55 md:h-60 w-full overflow-hidden">
                    <img 
                      src={product.productimages[0]} 
                      alt={product.productname} 
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.productname}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="text-lg text-gray-500 ml-1">{product.Brand}</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      <button className="bg-gray-800 hover:bg-gray-700  text-white px-5 py-2 rounded-md text-sm transition duration-300 cursor-pointer">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;