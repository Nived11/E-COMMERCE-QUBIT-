import React, { useState, useRef, useEffect } from "react";
import Nav from "./Nav";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import ApiPath from "../ApiPath";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiDollarSign, FiTag, FiX } from "react-icons/fi";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaArrowAltCircleDown, FaArrowAltCircleRight } from "react-icons/fa";

function Home() {
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const filterRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  let token = localStorage.getItem("token");
  
  // Carousel data
  const carouselSlides = [
    { 
      image: "https://portal.lotuselectronics.com/banner_images/original/e7ee6f7101887e2812eb4c4854ff7a93.webp", 
    },
    { 
      image: "https://portal.lotuselectronics.com/banner_images/original/447496bb0d9be75629ce2bfe9e31ee08.webp", 
    },
    { 
      image: "https://portal.lotuselectronics.com/banner_images/original/e521b215ecf118b553b5424f356ffa2e.webp", 
    }
  ];

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


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);


  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
  };

  const getallProducts = async() => {
    try {
      const res = await axios.get(`${ApiPath()}/allproducts`);
      if(res.status === 200){
        const productsWithDiscount = res.data.map(product => ({
          ...product,
          originalPrice: Math.round(product.price * (1 + Math.random() * 0.4)), // Random original price 0-40% higher
          discountPercentage: Math.round(Math.random() * 40) // Random discount 0-40%
        }));
        setProducts(productsWithDiscount);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsWithDiscount.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Group products by category
        const groupedProducts = {};
        uniqueCategories.forEach(category => {
          groupedProducts[category] = productsWithDiscount.filter(product => product.category === category);
        });
        setProductsByCategory(groupedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('No Products ');
    } 
  }

  const getProducts = async() => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("userr id geting", userId);
      const res = await axios.post(`${ApiPath()}/allproducts`, {userId});
      if(res.status === 200){
        // Add a discount percentage and original price for display purposes
        const productsWithDiscount = res.data.map(product => ({
          ...product,
          originalPrice: Math.round(product.price * (1 + Math.random() * 0.4)), // Random original price 0-40% higher
          discountPercentage: Math.round(Math.random() * 40) // Random discount 0-40%
        }));
        setProducts(productsWithDiscount);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsWithDiscount.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Group products by category
        const groupedProducts = {};
        uniqueCategories.forEach(category => {
          groupedProducts[category] = productsWithDiscount.filter(product => product.category === category);
        });
        setProductsByCategory(groupedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error);
      toast.error('Failed to fetch products');
    } 
  }

  useEffect(() => {
    if(!token){
      getallProducts();
    }
    else{
      getProducts();
    }
  }, []);



  // Carousel controls - infinite scrolling, no reverse
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev - 1));
  };

  
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="h-34 md:h-20 bg-gray-900"></div>
      <div className="container mx-auto lg:block hidden">
        <div className="grid grid-cols-4 md:grid-cols-11 gap-2 overflow-x-auto hide-scrollbar py-4">
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://image01-in.oneplus.net/media/202406/19/dee6a15ca313f3a7b211f2a440e9f05e.png?x-amz-process=image/format,webp/quality,Q_80" alt="Smartphones" className="w-12 h-12 object-cover" />
            </div>
            <span className="text-xs text-center">Smartphones</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://www.paiinternational.in/_next/image?url=https%3A%2F%2Fpaibackend.bangalore2.com%2Fmedia%2Fimages%2FLaptop.png&w=640&q=75" alt="Laptops" className="w-12 h-12 object-cover" />
            </div>
            <span className="text-xs text-center">Laptops</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://e7.pngegg.com/pngimages/530/441/png-clipart-headphones-microphone-lucid-sound-gaming-headset-ls25-wireless-headphones-thumbnail.png" alt="Headphones" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Headphones</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://w7.pngwing.com/pngs/924/969/png-transparent-smartwatch-online-shopping-android-watch-electronics-watch-accessory-accessories-thumbnail.png" alt="Smartwatches" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Smartwatches</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://m.media-amazon.com/images/I/719PE0iB0EL._AC_UY327_FMwebp_QL65_.jpg" alt="Speakers" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Speakers</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://rukminim2.flixcart.com/image/312/312/l5fnhjk0/dslr-camera/g/t/7/eos-r10-24-2-r10-canon-original-imagg4y52cybasdr.jpeg?q=70" alt="Cameras" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Cameras</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/gamingconsole/t/c/f/n-a-cfi-y1016y-sony-n-a-original-imah3g4htvknyvqh.jpeg?q=70" alt="Gaming" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Gaming</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://rukminim2.flixcart.com/image/312/312/xif0q/tablet/r/4/m/-original-imagj72vqsfqgzpf.jpeg?q=70" alt="Tablets" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Tablets</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://www.paiinternational.in/_next/image?url=https%3A%2F%2Fpaibackend.bangalore2.com%2Fmedia%2Fimages%2FCategory-Icons-LED150x150.png&w=640&q=75" alt="Smart Home" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Smart Home</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/laptop-accessories-combo/m/a/o/wired-gaming-keyboard-and-optical-mouse-rgb-backlight-104-keys-original-imah5dtfjypfed77.jpeg?q=70" alt="Accessories" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Accessories</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="topicon rounded-full border-2 border-blue-700 p-2 mb-2 cursor-pointer">
              <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/p/0/p/-original-imagp6skfbnypq5g.jpeg?q=70" alt="Earbuds" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xs text-center">Earbuds</span>
          </div>
        </div>
      </div>
      
      {/* Carousel Section - Infinite Forward Scrolling */}
      <div className="relative overflow-hidden mb-8 mt-3">
  <div className="carousel-container relative h-64 md:h-88 ml-2 mr-2 overflow-hidden">
    <div 
      className="carousel-track flex transition-transform duration-500 ease-out h-full" 
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {carouselSlides.map((slide, index) => (
        <div key={index} className="carousel-slide w-full flex-shrink-0 h-full relative">
          <img 
            src={slide.image } 
            alt={slide.title || "Carousel slide"} 
            className="w-full h-90"
          />
        </div>
      ))}
    </div>

   
    <button 
      onClick={prevSlide} 
      className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition"
    >
      &#10094;
    </button>

    <button 
      onClick={nextSlide} 
      className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition"
    >
      &#10095;
    </button>
  </div>
</div>

      
      <div className="relative">
        <div  ref={filterRef}
          className={`filter-sidebar fixed left-0 top-32 md:top-20 h-full bg-white shadow-lg z-50 w-64 ${
            showFilter ? "open" : "closed" }`}>
          <div className="p-4 h-full">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Filter Products</h2>
              <button 
                onClick={() => setShowFilter(false)}
                className="text-gray-500 hover:text-gray-700" >
                <FiX className="text-xl" />
              </button>
            </div>
            
           
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Featured Products</h1>
              <button 
                className="filter-toggle-btn flex items-center gap-2 bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition cursor-pointer shadow-md"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FiFilter className="filter-icon text-lg" />
                <span>Filter</span>
              </button>
            </div>
            
        
           {/* allproducts */}
            
            <div className="h-auto w-full  p-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {products.map((product) => (
                  <div 
                    onClick={() => navigate(`/productdetails/${product._id}`)}
                    key={product._id} 
                    className="product-card w-56 bg-white rounded-lg  shadow-lg cursor-pointer"
                  >
                    <div className="h-50 overflow-hidden flex items-center  p-4">
                      <img 
                        src={product.productimages[0]} 
                        alt={product.productname} 
                        className=" object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.productname}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>
                      <div className="mb-1 flex items-center">
                        <span className="text-xs text-gray-600">{product.Brand}</span>
                      </div>
                      <div className="price-display">
                        <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-xs original-price">₹{product.originalPrice}</span>
                        <span className="text-xs discount-badge">{product.discountPercentage}% OFF</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                {/* leftsection */}
            <div className="h-auto  h1/12 flex flex-wrap  gap-10">
            <div className=" w-full  flex flex-col">
              <div className="h-full w-full p-4 ">
                <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="row-span-1 md:row-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className=" border-b border-gray-300 w-full flex items-center justify-between p-4">
                      <h2 className="text-lg font-semibold text-blue-600">Featured Products</h2>
                      <FaArrowAltCircleRight className="text-blue-500 text-lg hover:text-blue-700 transition-colors cursor-pointer" />
                    </div>
                    <div className="w-full p-4 flex flex-wrap gap-4 justify-center">

                      {products.filter(product => product.category.toLowerCase() === "laptops").slice(0, 4).map((product) => (
                        <div
                          onClick={() => navigate(`/productdetails/${product._id}`)}
                          key={product._id}
                          className="product-card w-full sm:w-64 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                            <img
                              src={product.productimages[0]}
                              alt={product.productname}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.productname}</h3>
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <div className="mb-2 flex items-center">
                              <span className="text-xs text-gray-600">{product.Brand}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                              <span className="text-xs font-medium text-green-600">{product.discountPercentage}% OFF</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                 {/* rightfirstsection */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="border-b-1 border-gray-300 w-full flex items-center justify-between p-4">
                      <h2 className="text-lg font-semibold text-blue-600">New Arrivals</h2>
                      <FaArrowAltCircleRight className="text-blue-500 text-lg hover:text-blue-700 transition-colors cursor-pointer" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 justify-evenly items-center">
                      {products.filter(product => product.category.toLowerCase() === "mobiles").slice(0, 3).map((product) => (
                        <div
                          onClick={() => navigate(`/productdetails/${product._id}`)}
                          key={product._id}
                          className="product-card w-full sm:w-1/3 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="h-36 overflow-hidden flex items-center justify-center bg-gray-50">
                            <img
                              src={product.productimages[0]}
                              alt={product.productname}
                              className="h-full object-contain"
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.productname}</h3>
                              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <div className="mb-1 flex items-center">
                              <span className="text-xs text-gray-600">{product.Brand}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                              <span className="text-xs font-medium text-green-600">{product.discountPercentage}% OFF</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* rightsecsection */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="border-b-1  border-gray-300 w-full flex items-center justify-between p-4">
                      <h2 className="text-lg font-semibold text-blue-600">Popular Items</h2>
                      <FaArrowAltCircleRight className="text-blue-500 text-lg hover:text-blue-700 transition-colors cursor-pointer" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 justify-evenly items-center">
                      {products.filter(product => product.category.toLowerCase() === "earphones").slice(0, 3).map((product) => (
                        <div
                          onClick={() => navigate(`/productdetails/${product._id}`)}
                          key={product._id}
                          className="product-card w-full sm:w-1/3 bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="h-36 overflow-hidden flex items-center justify-center bg-gray-50">
                            <img
                              src={product.productimages[0]}
                              alt={product.productname}
                              className="h-full object-contain"
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.productname}</h3>
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <div className="mb-1 flex items-center">
                              <span className="text-xs text-gray-600">{product.Brand}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-gray-900">₹{product.price}</span>
                              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                              <span className="text-xs font-medium text-green-600">{product.discountPercentage}% OFF</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          



          {/* Footer */}
          <footer className="footer mt-16 pt-10 pb-6 text-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="footer-section">
                  <h3 className="footer-title text-xl font-bold">Qubit</h3>
                  <p className="mt-2 text-gray-300">
                    Your one-stop shop for electronics and gadgets. Quality products, competitive prices, and excellent service.
                  </p>
                </div>
                
                <div className="footer-section">
                  <h3 className="footer-title text-lg font-semibold">About Us</h3>
                  <a href="#" className="footer-link">Our Story</a>
                  <a href="#" className="footer-link">Team</a>
                  <a href="#" className="footer-link">Careers</a>
                  <a href="#" className="footer-link">Press</a>
                </div>
                
                <div className="footer-section">
                  <h3 className="footer-title text-lg font-semibold">Help & Support</h3>
                  <a href="#" className="footer-link">FAQ</a>
                  <a href="#" className="footer-link">Shipping</a>
                  <a href="#" className="footer-link">Returns</a>
                  <a href="#" className="footer-link">Contact Us</a>
                </div>
                
                <div className="footer-section">
                  <h3 className="footer-title text-lg font-semibold">Follow Us</h3>
                  <div className="flex mt-4 space-x-3">
                    <a href="#" className="social-icon">
                      <FaTwitter />
                    </a>
                    <a href="#" className="social-icon">
                      <FaFacebook />
                    </a>
                    <a href="#" className="social-icon">
                      <FaInstagram />
                    </a>
                    <a href="#" className="social-icon">
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm text-gray-300">
                <p>© 2025 Qubit. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Home;