import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import ApiPath from '../ApiPath';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {FaTruck} from "react-icons/fa";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate=useNavigate();
  
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const res = await axios.post(`${ApiPath()}/showcart`, { userId });
        console.log(res.data);
        
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
              toast.info(res.data.msg)
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
      setQuantities({...quantities,[productId]: quantities[productId] + 1});
    };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const quantity = quantities[item._id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  // const calculateDiscount = () => {
  //   return cartItems.reduce((total, item) => {
  //     const quantity = quantities[item._id] || 1;
  //     const discount = item.originalPrice ? (item.originalPrice - item.price) * quantity : 0;
  //     return total + discount;
  //   }, 0);
  // };

  const calculateTotalItems = () => {
    return Object.values(quantities).reduce((total, qty) => total + qty, 0);
  };
  const placeOrder=async ()=>{
   try {
    const res=await axios.post(`${ApiPath()}/sendorder`,{userId,cartItems,});
    if(res.status==201){
      toast.info(res.data.msg)
    }
   } catch (error) {
    
   }
  }
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
                        
                        {/* <div className="text-sm text-gray-600 mb-2">
                          Secured Packaging Fee ₹40
                        </div>
                        
                        <div className="text-sm mb-4">
                          Delivery by Sat Mar 1 | <span className="text-green-600">₹40 Free</span>
                        </div> */}
                        
                        <div className="flex items-center">
                          <div className="flex border border-gray-300 rounded mr-6">
                            <button 
                              onClick={() => decreaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                              −
                            </button>
                            <div className="w-8 h-8 flex items-center justify-center border-x border-gray-300">
                              {quantities[item._id] || 1}
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
{/*                   
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Discount</span>
                    <span className="text-green-600">− ₹5%</span>
                  </div> */}
                  
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Delivery Charges</span>
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through mr-1">₹40</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                  
                  {/* <div className="flex justify-between mb-3">
                    <span className="text-gray-700">Secured Packaging Fee</span>
                    <span className="text-gray-700">₹99</span>
                  </div> */}
                </div>
                
                <div className="border-t border-gray-200 pt-3 pb-3">
                  <div className="flex justify-between font-medium text-base">
                    <span>Total Amount</span>
                    <span>₹{calculateTotalPrice()}</span>
                  </div>
                </div>
                
                <div className="p-4 flex justify-center border-t border-gray-100">
                  <button onClick={placeOrder}
                   className="flex rounded-sm bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 uppercase font-medium cursor-pointer ">
                    <h2 className='mr-2'> Place Order</h2>
                    <FaTruck size={20} color='white'/>
                  </button>
                </div>
              </div>
              
            </div>
            
          )}
        </div>
        
      </div>
    </div>
    </>
  );
};

export default Cart;