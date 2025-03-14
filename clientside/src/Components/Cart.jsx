import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import ApiPath from '../ApiPath';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaTruck } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const res = await axios.post(`${ApiPath()}/showcart`, { userId });
        
        if (res.data && Array.isArray(res.data)) {
          setCartItems(res.data);
          
          const initialQuantities = {};
          res.data.forEach(item => {
            initialQuantities[item._id] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error(error);
      } 
    };
    
    if (userId) {
      getCartItems();
    }
  }, [userId]);

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

  // Handle modal animation
  useEffect(() => {
    if (showAddressModal) {
      setTimeout(() => {
        setModalVisible(true);
      }, 50);
    }
  }, [showAddressModal]);

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

  const decreaseQuantity = (productId) => {
    if (quantities[productId] > 1) {
      setQuantities({
        ...quantities,
        [productId]: quantities[productId] - 1
      });
    }
  };
  
  const removeFromCart = async (productId) => {
    try {
      const id = productId;
      const res = await axios.delete(`${ApiPath()}/deletecart/${id}`);
      if (res.status === 200) {
        toast.info(res.data.msg);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };
    
  const increaseQuantity = (productId) => {
    setQuantities({...quantities, [productId]: quantities[productId] + 1});
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item._id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const calculateTotalItems = () => {
    return Object.values(quantities).reduce((total, qty) => total + qty, 0);
  };

  const handleShowAddressModal = () => {
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setShowAddressModal(false);
    }, 300);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const removeAllfromcart = async () => {
    try {
      const res = await axios.delete(`${ApiPath()}/removeallfromcart`, { data: { id: userId } });
    } catch (error) {
      console.error(error);
    }
  };
  
  const initializeRazorpay = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      // Get user profile for email
      const user = await axios.get(`${ApiPath()}/profile/${userId}`);
      const email = user.data.email;
      
      // Prepare order data
      const orderData = {
        userId,
        email,
        address: selectedAddress,
        products: cartItems.map(item => ({
          ...item,
          quantity: quantities[item._id] || 1
        })),
        totalAmount: calculateTotalPrice().toString()
      };
      
      // Create an order for Razorpay first (you need to implement this API endpoint)
      const response = await axios.post(`${ApiPath()}/createRazorpayOrder`, {
        amount: calculateTotalPrice() * 100, // Amount in paisa
        currency: "INR",
        receipt: `order_${Date.now()}`
      });
      
      if (!response.data || !response.data.id) {
        throw new Error('Failed to create Razorpay order');
      }
      
      const options = {
        key: "rzp_test_L1qbmYu5Ctpty3", // Replace with your Razorpay Key ID
        amount: calculateTotalPrice() , // Amount in paisa
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
        removeAllfromcart();
        handleCloseAddressModal();
        // toast.success(res.data.msg);
          window.location.reload();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  return (
    <>
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-35 md:mt-20">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-3">
            {cartItems.length === 0 ? (
              <div className="ml-80 bg-white rounded shadow p-10 text-center">
                <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                <p className="mb-4">Looks like you haven't added any products to your cart yet.</p>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="bg-white rounded shadow mb-4">
                <div className="p-4 flex justify-between items-center border-b">
                  <span className="text-gray-700">Your Cart </span>
                  <button onClick={()=>navigate("/")} className="text-blue-500 cursor-pointer">Add more items</button>
                </div>
                
                {cartItems.map(item => (
                  <div key={item._id} className="p-4 border-b">
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-28 flex-shrink-0 md:mr-4">
                        <img 
                          src={item.productimages[0]} 
                          alt={item.name} 
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-1">{item.productname}</h3>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-lg mr-2">₹{item.price}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex border border-gray-300 rounded mr-6">
                            <button 
                              onClick={() => decreaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                              −
                            </button>
                            <div className="w-8 h-8 flex items-center justify-center border-x border-gray-300">
                              {quantities[item._id] }
                            </div>
                            <button 
                              onClick={() => increaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100" >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="cursor-pointer text-gray-700 uppercase text-sm font-medium hover:text-gray-900" >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-base uppercase font-medium text-gray-700 mb-4">PRICE DETAILS</h2>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Price ({calculateTotalItems()} item{calculateTotalItems() !== 1 ? 's' : ''})</span>
                    <span className="text-gray-700">₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Delivery Charges</span>
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-1">₹40</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 pb-3">
                  <div className="flex justify-between font-medium text-base">
                    <span>Total Amount</span>
                    <span>₹{calculateTotalPrice()}</span>
                  </div>
                </div>
                
                <div className="p-4 flex justify-center border-t border-gray-100">
                  <button 
                    onClick={handleShowAddressModal}
                    className="flex rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 uppercase font-medium cursor-pointer">
                    <h2 className='mr-2'>Place Order</h2>
                    <FaTruck size={20} color='white'/>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
              <button  onClick={() => { handleCloseAddressModal();
                  navigate(`/profile/${userId}`, { state: { section: 'address' } }); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
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
                className={`px-6 py-2 rounded-md text-white  cursor-pointer ${!selectedAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
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

export default Cart;