import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Prod from "../assets/prod.jpg";
import axios from 'axios';
import ApiPath from '../ApiPath';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(0);
  const [product, setProduct] = useState({});
  const [cart, setCart] = useState({});
  const [isInCart, setIsInCart] = useState(false);
  const id = useParams().id;
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  
  // Define fallback images if product doesn't have images
  const fallbackImages = [Prod];
  
  // Get the correct images to display (either from product or fallback)
  const productImages = product.productimages && product.productimages.length > 0 
    ? product.productimages 
    : fallbackImages;

  // Auto carousel effect with 5-second delay
  useEffect(() => {
    const interval = setInterval(() => {
      // Move to next image
      setMainImage(prevImage => (prevImage + 1) % productImages.length);
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [productImages.length]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${ApiPath()}/getoneproduct/${id}`);
        console.log("API response:", res.data);
        
        if(res.status === 200){
          setProduct(res.data);
        }
      } catch (error) {
        toast.error('Failed to fetch product details');
        console.error('Error:', error);
      }
    };
    
    getProduct();
  }, [id]);

  const userId = localStorage.getItem("userId");
  
 
  const addToCart = async () => {
    try {
      const res = await axios.post(`${ApiPath()}/addcart`, { 
        userId, 
        productId: product._id 

      });
      
      
      if(res.status === 201){
        setCart(res.data);
        setIsInCart(true);
        toast.success('Product added to cart');
      }
    } catch (error) {
      if(!token){
       toast.error('Please login first');
        setTimeout(() => navigate('/login'), 3000);  
      }
      else{
        toast.error('Failed to add product to cart');
        console.error('Error:', error);
      }
     
    }
  }

  const handleCartAction = () => {
    if (isInCart) {
      navigate('/cart');
    } else {
      addToCart();
    }
  };
  
  return (
    <>
      <Nav />
      {/* Main container with padding-bottom to account for fixed buttons on mobile and tablet */}
      <div className="flex flex-col md:flex-row max-w-full mx-auto bg-white min-h-screen mt-35 md:mt-20 pb-16 md:pb-0">
        
        {/* Left section with product images - adjusted for tablet */}
        <div className="w-full md:w-1/2 bg-gray-100 md:sticky md:top-16 h-auto md:overflow-y-auto "> 
          {/* Main product image carouse reduced height for tablets */}
          <div className="relative mb-3 md:mb-10 lg:h-100 md:mt-5 ">
            <img 
              src={productImages[mainImage]} 
              alt="Main product view" 
              className="w-full h-full md:h-64 lg:h-full object-contain" 
            />
            <button className="text-3xl md:text-4xl absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              ♡
            </button>
            
            {/* Updated Previous and Next arrows - smaller on tablet */}
            <button 
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 md:p-2 lg:p-3 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center"
              onClick={() => setMainImage((mainImage - 1 + productImages.length) % productImages.length)}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 md:p-2 lg:p-3 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center"
              onClick={() => setMainImage((mainImage + 1) % productImages.length)}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          {/* Carousel indicators - smaller on tablet */}
          <div className="flex justify-center gap-1 mb-3 md:mb-4 ">
            {productImages.map((_, index) => (
              <div 
                key={`indicator-${index}`}
                className={`h-1 rounded-full cursor-pointer ${
                  index === mainImage ? 'bg-blue-500 w-4 md:w-6' : 'bg-gray-300 w-2 md:w-3'
                }`}
                onClick={() => setMainImage(index)}
              />
            ))}
          </div>
          
          {/* Action buttons - Only visible on desktop and tablet (md screens) */}
          <div className="hidden md:flex justify-center gap-5 w-full mt-3 lg:mt-4">
            <button
              onClick={handleCartAction}
              className="flex-1 cursor-pointer font-bold py-3 lg:py-4 px-3 lg:px-4 rounded text-sm lg:text-base flex items-center justify-center gap-1 lg:gap-2 bg-blue-500 text-white"
            >
              <span>🛒</span> {isInCart ? 'GO TO CART' : 'ADD TO CART'}
            </button>
            <button 
              className="cursor-pointer flex-1 font-bold py-3 lg:py-4 px-3 lg:px-4 rounded text-sm lg:text-base flex items-center justify-center gap-1 lg:gap-2 bg-yellow-500 text-white"
            >
              <span>⚡</span> BUY NOW
            </button>
          </div>
        </div>
        
        {/* Right section with product details - adjusted for tablet */}
        <div className="w-full md:w-1/2 p-3 md:p-4 overflow-y-auto">
          {/* Product Brand & Name */}
          <div className="mb-3 md:mb-4">
            <div className="text-blue-600 font-medium text-base md:text-lg">{product.Brand || 'Brand'}</div>
            <h1 className="text-lg md:text-xl font-medium leading-relaxed mb-1 md:mb-2">
              {product.productname || 'Product Name'}
            </h1>
            <div className="text-gray-600 text-sm md:text-base">{product.category || 'Category'}</div>
            <div className="text-gray-600 text-sm md:text-base">{product.model ? `(${product.model})` : ''}</div>
          </div>
          
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
            {product.rating && (
              <>
                <span className="bg-green-600 text-white px-1.5 md:px-2 py-0.5 rounded text-xs md:text-sm">
                  {product.rating} ★
                </span>
                <span className="text-gray-500 text-xs md:text-sm">
                  {product.reviews ? `${product.reviews} Reviews` : ''}
                </span>
              </>
            )}
            <span className="text-blue-500 font-medium ml-1 md:ml-2 text-xs md:text-sm">✓ Assured</span>
          </div>
          
          {/* Price & Stock Status */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-1 md:gap-2 mb-1">
              <span className="text-xl md:text-2xl lg:text-3xl font-medium">₹{product.price || 0}</span>
              <span className="text-gray-500 line-through text-sm md:text-base">
                ₹{product.originalPrice || Math.round(product.price * 1.1 || 0)}
              </span>
              <span className="text-green-600 font-medium text-sm md:text-base">
                {product.discount || '10'}% off
              </span>
            </div>
          </div>
          
          {/* Available offers */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-sm md:text-base font-medium mb-1.5 md:mb-2">Available offers</h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-1 text-xs md:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span>
                <a href="#" className="text-blue-500 ml-1">T&C</a>
              </li>
              <li className="flex items-start gap-1 text-xs md:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Bank Offer 10% off up to ₹1,250 on Kotak Bank Credit Card Transactions, on orders of ₹5,000 and above</span>
              </li>
              <li className="flex items-start gap-1 text-xs md:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No cost EMI ₹17,997/month. Standard EMI also available</span>
                <a href="#" className="text-blue-500 ml-1">View Plans</a>
              </li>
            </ul>
          </div>
          
          {/* Specifications */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-sm md:text-base font-medium mb-1.5 md:mb-2">Specifications</h3>
            <div className="border rounded overflow-hidden">
              {product.specifications ? (
                <div className="p-2 md:p-3 text-xs md:text-sm">{product.specifications}</div>
              ) : (
                <div className="p-2 md:p-3 text-xs md:text-sm">No specifications available</div>
              )}
            </div>
          </div>
          
          {/* Warranty Info */}
          <div className="flex items-center gap-1 md:gap-2 py-3 md:py-4 border-t border-b border-gray-200 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs md:text-sm">{product.warranty || '1 Year Warranty'} Year Onsite warranty</span>
            <a href="#" className="text-blue-500 ml-auto text-xs md:text-sm">Know More</a>
          </div>
          
          {/* Description */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-sm md:text-base font-medium mb-1.5 md:mb-2">Description</h3>
            <p className="text-gray-700 text-xs md:text-sm">{product.description || 'No description available'}</p>
          </div>
        </div>
      </div>
      
      {/* Fixed mobile action buttons at bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 flex w-full md:hidden shadow-lg z-10">
        <button 
          onClick={handleCartAction}
          className="flex-1 font-bold py-3 px-3 flex items-center justify-center gap-1 bg-blue-500 text-white text-xs border-r border-blue-600"
        >
          <span>🛒</span> {isInCart ? 'GO TO CART' : 'ADD TO CART'}
        </button>
        <button 
          className="cursor-pointer flex-1 font-bold py-3 px-3 flex items-center justify-center gap-1 bg-yellow-500 text-white text-xs " 
        >
          <span>⚡</span> BUY NOW
        </button>
      </div>
      
      <ToastContainer />
    </>
  );
};

export default ProductDetails;