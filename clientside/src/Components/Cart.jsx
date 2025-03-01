import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import ApiPath from '../ApiPath';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Make sure you import toast if you're using it

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate=useNavigate();
  
  const userId = localStorage.getItem('userId'); // Replace with your actual user ID source

  useEffect(() => {
    const getCartItems = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${ApiPath()}/showcart`, { userId });
        console.log(res.data);
        
        if (res.data && Array.isArray(res.data)) {
          setCartItems(res.data);
          
          // Initialize quantities for each product
          const initialQuantities = {};
          res.data.forEach(item => {
            initialQuantities[item._id] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      getCartItems();
    }
  }, [userId]); // Only re-run if userId changes

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
          const id=productId
          const res=await axios.delete(`${ApiPath()}/deletecart/${id}`);
          if(res.status==200){
              toast.success(res.data.msg)
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
            
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        }
    };
    
    const increaseQuantity = (productId) => {
      setQuantities({
        ...quantities,
        [productId]: quantities[productId] + 1
      });
    };
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item._id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item._id] || 1;
      const discount = item.originalPrice ? (item.originalPrice - item.price) * quantity : 0;
      return total + discount;
    }, 0);
  };

  const calculateTotalItems = () => {
    return Object.values(quantities).reduce((total, qty) => total + qty, 0);
  };

  return (
    <>
    <div className="bg-gray-100 min-h-screen">
    <Nav />
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-20">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded shadow p-10 text-center">
                <p>Loading your cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded shadow p-10 text-center">
                <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                <p className="mb-4">Looks like you haven't added any products to your cart yet.</p>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                  onClick={() => navigate("/home")}
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
                          src={item.productimages[0] || "/api/placeholder/150/150"} 
                          alt={item.name} 
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-1">{item.productname}</h3>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          Seller: {item.seller || 'TrueComRetail'}
                          {item.assured && (
                            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded ml-1">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Assured
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center mb-1">
                          {item.originalPrice && (
                            <span className="text-gray-400 line-through text-sm mr-2">₹{item.originalPrice.toLocaleString()}</span>
                          )}
                          <span className="font-medium text-lg mr-2">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-green-600 text-sm mr-2">
                              {Math.round((1 - item.price / item.originalPrice) * 100)}% Off
                            </span>
                          )}
                          {item.offers && (
                            <span className="text-green-600 text-sm">
                              {item.offers} offers available
                              <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path stroke="currentColor" strokeWidth="2" d="M12 8v4M12 16h.01"/>
                              </svg>
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          + ₹99 Secured Packaging Fee
                        </div>
                        
                        <div className="text-sm mb-4">
                          Delivery by Sat Mar 1 | <span className="text-green-600">₹40 Free</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex border border-gray-300 rounded mr-6">
                            <button 
                              onClick={() => decreaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <div className="w-8 h-8 flex items-center justify-center border-x border-gray-300">
                              {quantities[item._id] || 1}
                            </div>
                            <button 
                              onClick={() => increaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="cursor-pointer text-gray-700 uppercase text-sm font-medium hover:text-gray-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 flex justify-end border-t border-gray-100">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 uppercase font-medium cursor-pointer">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Section - Price Details */}
          {!loading && cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-base uppercase font-medium text-gray-700 mb-4">PRICE DETAILS</h2>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Price ({calculateTotalItems()} item{calculateTotalItems() !== 1 ? 's' : ''})</span>
                    <span className="text-gray-700">₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Discount</span>
                    <span className="text-green-600">− ₹{calculateDiscount().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Delivery Charges</span>
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-1">₹40</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Secured Packaging Fee</span>
                    <span className="text-gray-700">₹99</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 pb-3">
                  <div className="flex justify-between font-medium text-base">
                    <span>Total Amount</span>
                    <span>₹{(calculateTotalPrice() - calculateDiscount() + 99).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-green-600 text-sm font-medium">
                  You will save ₹{(calculateDiscount() - 99).toLocaleString()} on this order
                </div>
                
                <div className="mt-6 flex">
                  <div className="flex-shrink-0 mt-0.5 mr-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Safe and Secure Payments. Easy returns. 100% Authentic products.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-50 text-xs text-gray-500 ">
          <div className="flex flex-wrap gap-x-1 mb-2">
            <span>Policies:</span>
            <a href="#" className="hover:text-blue-500">Returns Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-500">Terms of use</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-500">Security</a>
            <span>|</span>
            <a href="#" className="hover:text-blue-500">Privacy</a>
          </div>
          <div className="flex justify-between flex-wrap">
            <div>© 2020-2025 Qubit.com</div>
            <div>
              Need help? Visit the 
              <a href="#" className="text-blue-500 mx-1">Help Center</a>
              or
              <a href="#" className="text-blue-500 ml-1">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;