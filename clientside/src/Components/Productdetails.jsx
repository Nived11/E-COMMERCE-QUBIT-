import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import noimage from "../assets/no img.png";
import axios from 'axios';
import ApiPath from '../ApiPath';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiX } from "react-icons/fi";

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState(0);
  const [product, setProduct] = useState({});
  const [cart, setCart] = useState({});
  const [isInCart, setIsInCart] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const id = useParams().id;
  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const fallbackImages = [noimage];

  const productImages = product.productimages && product.productimages.length > 0 
    ? product.productimages  : fallbackImages;
    
  useEffect(() => {
    const interval = setInterval(() => {
      setMainImage(prevImage => (prevImage + 1) % productImages.length);
    }, 5000);
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

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };
    
    loadRazorpayScript();
  }, []);

  // Handle modal animation
  useEffect(() => {
    if (showAddressModal) {
      setTimeout(() => {
        setModalVisible(true);
      }, 50);
    }
  }, [showAddressModal]);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${ApiPath()}/getAddress/${userId}`);
        if (res.status === 200) {
          setAddresses(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (userId && showAddressModal) {
      fetchAddresses();
    }
  }, [userId, showAddressModal]);
  
  const addToCart = async () => {
    try {
      const res = await axios.post(`${ApiPath()}/addcart`, { 
        userId, 
        productId: product._id 
      });
      
      if(res.status === 201){
        setCart(res.data);
        setIsInCart(true);
        console.log("product added successfully");
      }
    } catch (error) {
      if(!token){
        toast.info('Please login first');
        setTimeout(() => navigate('/login'), 3000);  
      }
      else{
        toast.error('Failed to add product to cart');
        console.error(error);
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

  const handleBuyNow = () => {
    if(!token){
      toast.info('Please login first');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }
    setShowAddressModal(true);
  }

  const handleCloseAddressModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setShowAddressModal(false);
    }, 300);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const calculateTotalPrice = () => {
    return product.price * quantity;
  };

  const initializeRazorpay = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      const user = await axios.get(`${ApiPath()}/profile/${userId}`);
      const email = user.data.email;
      
      // Prepare order data for single product
      const orderData = {
        userId,
        email,
        address: selectedAddress,
        products: [{  ...product, quantity: quantity}],
        totalAmount: calculateTotalPrice().toString()
      };

      // Create an order for Razorpay first
      const response = await axios.post(`${ApiPath()}/createRazorpayOrder`, {
        amount: calculateTotalPrice() * 100, // Amount in paisa
        currency: "INR",
        receipt: `order_${Date.now()}`
      });
      
      if (!response.data || !response.data.id) {
        throw new Error('Failed to create Razorpay order');
      }
      
      const options = {
        key: "rzp_test_L1qbmYu5Ctpty3", 
        amount: calculateTotalPrice(), 
        currency: "INR",
        name: "Qubit",
        description: "Purchase Payment",
        order_id: response.data.id,
        handler: function (response) {
          // This function runs when payment is successful
          handlePaymentSuccess(response, orderData);
        },
        prefill: {
          name: selectedAddress.name,
          email: email,
          contact: selectedAddress.phone
        },
        notes: {
          address: `${selectedAddress.address}`
        },
        theme: {
          color: "#3B82F6" 
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };
  
  const handlePaymentSuccess = async (paymentResponse, orderData) => {
    try {
      // Verify payment with your backend
      const verifyResponse = await axios.post(`${ApiPath()}/verifyPayment`, {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });
      
      if (verifyResponse.status === 200) {
        // After successful payment verification, place the order
        await placeOrder(orderData);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const res = await axios.post(`${ApiPath()}/sendorder`, { orderData });
      if (res.status === 201) {
        handleCloseAddressModal();
        toast.success("Order placed successfully!");
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };
  useEffect(() => {
  window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Nav />
   
      <div className="flex flex-col md:flex-row max-w-full mx-auto bg-white min-h-screen mt-35 md:mt-20 pb-16 md:pb-0">
        
        <div className="w-full md:w-1/2 bg-gray-100 md:sticky md:top-16 h-auto md:overflow-y-auto "> 
          <div className="relative mb-3 md:mb-10 lg:h-100 md:mt-5 ">
            <img  src={productImages[mainImage]}  alt="Main product view" 
              className="w-full h-full md:h-64 lg:h-full object-contain" />
            
            <button 
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 md:p-2 lg:p-3 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center"
              onClick={() => setMainImage((mainImage - 1 + productImages.length) % productImages.length)} aria-label="Previous image" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 md:p-2 lg:p-3 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center"
              onClick={() => setMainImage((mainImage + 1) % productImages.length)} aria-label="Next image" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-center gap-1 mb-3 md:mb-4 ">
            {productImages.map((_, index) => (
              <div   key={`indicator-${index}`}
                className={`h-1.5 rounded-full cursor-pointer ${ index === mainImage ? 'bg-blue-500 w-4 md:w-6' : 'bg-gray-300 w-2 md:w-3'}`}
                onClick={() => setMainImage(index)} />
            ))}
          </div>
          
          {/*laptop mobile size  */}
          
          <div className="hidden md:flex justify-center gap-5 w-full mt-3 lg:mt-4">
          <button  onClick={handleCartAction}  disabled={product.quantity <= 0}
            className={`flex-1 cursor-pointer font-bold py-3 lg:py-4 px-3 lg:px-4 rounded text-sm lg:text-base flex items-center justify-center
              gap-1 lg:gap-2 text-white ${isInCart ? 'bg-green-700' : 'bg-blue-800'}
              ${  product.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : '' }`} >
              <span>🛒</span> {isInCart ? 'GO TO CART' : 'ADD TO CART'}
          </button>
          <button  onClick={handleBuyNow}  disabled={product.quantity <= 0}
            className={`cursor-pointer flex-1 font-bold py-3 lg:py-4 px-3 lg:px-4 rounded text-sm lg:text-base flex items-center justify-center gap-1 lg:gap-2 bg-blue-800 text-white 
              ${ product.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`} >
            <span>⚡</span> BUY NOW
          </button>
        </div>
          
        </div>
        
        
        {/* right details */}
        <div className="w-full md:w-1/2 p-3 md:p-4 overflow-y-auto">
          <div className="mb-3 md:mb-4">
            <div className="text-blue-600 font-medium text-base md:text-lg">{product.Brand || 'Brand'}</div>
            <h1 className="text-lg md:text-xl font-medium leading-relaxed mb-1 md:mb-2">
              {product.productname || 'Product Name'}
            </h1>
            <div className="text-gray-600 text-sm md:text-base">{product.category || 'Category'}</div>
            <div className="text-gray-600 text-sm md:text-base">{product.model ? `(${product.model})` : ''}</div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 mb-3 md:mb-4">
          <span className={`ml-2  ${product.quantity > 0 ? 'text-sm px-4  py-1  rounded  bg-green-600 text-white '
                     : 'text-sm px-4  py-1 rounded  bg-red-600 text-white'} `}>
                      {product.quantity > 0 ? ' In Stock ' : ' Out of Stock '}
                  </span>
            {/* <span className="text-blue-500 font-medium ml-1 md:ml-2 text-xs md:text-sm">✓ Assured</span> */}
          </div>
          
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
          
          <div className="flex items-center gap-1 md:gap-2 py-3 md:py-4 border-t border-b border-gray-200 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs md:text-sm">{product.warranty || '1 Year Warranty'} Year Onsite warranty</span>
            {/* <a href="#" className="text-blue-500 ml-auto text-xs md:text-sm">Know More</a> */}
          </div>
          
          <div className="mb-4 md:mb-6">
            <h3 className="text-sm md:text-base font-medium mb-1.5 md:mb-2">Description</h3>
            <p className="text-gray-700 text-xs md:text-sm">{product.description || 'No description available'}</p>
          </div>
        </div>
      </div>
      
      {/* mobile cart*/}
      <div className="fixed bottom-0 left-0 right-0 flex w-full md:hidden shadow-lg z-10">
        <button  onClick={handleCartAction}
          className={`flex-1 font-bold py-3 px-3 flex items-center justify-center gap-1 bg-blue-500 text-white text-xs
          border-r border-blue-600 ${isInCart ? 'bg-green-700' : 'bg-blue-800'}
           ${  product.quantity <= 0 ? 'bg-gray-500 cursor-not-allowed' : '' }`}>
          <span>🛒</span> {isInCart ? 'GO TO CART' : 'ADD TO CART'}
        </button>
        <button  onClick={handleBuyNow} className={`cursor-pointer flex-1 font-bold py-3 px-3 flex items-center justify-center gap-1 bg-blue-800 text-white text-xs  
         ${ product.quantity <= 0 ? 'bg-gray-500 cursor-not-allowed' : ''}`}>
          <span>⚡</span> BUY NOW
        </button>
      </div>
       {showAddressModal && (
            <div className={`fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 ${modalVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
              <div className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transition-transform duration-300 ${modalVisible ? 'scale-100' : 'scale-95'} overflow-y-auto max-h-[90vh]`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-blue-700">Select Delivery Address</h3>
                  <button 
                    onClick={handleCloseAddressModal} 
                    className="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <FiX size={24} />
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-md text-center">
                    <p className="text-gray-500 mb-4">No addresses found. Please add an address to continue.</p>
                    <button 
                      onClick={() => {
                        handleCloseAddressModal();
                        navigate(`/profile`, { state: { section: 'address' } });
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {addresses.map(address => (
                      <div 
                        key={address._id} 
                        className={`p-4 border rounded-md cursor-pointer ${selectedAddress && selectedAddress._id === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start">
                          <div className="h-5 w-5 mr-3 mt-1">
                            <input 
                              type="radio" 
                              checked={selectedAddress && selectedAddress._id === address._id}
                              onChange={() => handleAddressSelect(address)}
                              className="h-5 w-5 text-blue-600"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-blue-700">{address.name}</p>
                            <p className="text-gray-600">{address.phone}</p>
                            <p className="text-gray-600">{address.housename}, {address.area}</p>
                            {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                            <p className="text-gray-600">{address.city}, {address.state}</p>
                            <p className="text-gray-600">PIN: {address.pincode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {addresses.length > 0 && (
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={handleCloseAddressModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={initializeRazorpay}
                      disabled={!selectedAddress}
                      className={`px-6 py-2 rounded-md text-white  cursor-pointer ${!selectedAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
      <ToastContainer />
    </>
  );
};

export default ProductDetails;