import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, X } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ApiPath from '../ApiPath';

const OrderSection = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [showOrderDetails, setShowOrderDetails] = useState(false);
  const userId = localStorage.getItem("userId");

  const getOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${ApiPath()}/getorders`, {userId});
      if (res.status === 200) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [userId]);

  // const handleOrderClick = (order) => {
  //   setSelectedOrder(order);
  //   setShowOrderDetails(true);
  // };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <p className="text-gray-600">Review your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">No orders found</h3>
          <p className="text-gray-600">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order._id.substring(10, 25)}
                  </h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {order.products.slice(0, 3).map((product) => (
                    <div key={product._id} className="flex items-center space-x-2">
                      <img
                        src={product.productimages[0]}
                        alt={product.productname}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm text-gray-600 line-clamp-1">{product.productname}</span>
                    </div>
                  ))}
                  {order.products.length > 3 && (
                    <span className="text-sm text-blue-600">+{order.products.length - 3} more</span>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-gray-600 text-sm">Ordered on: {formatDate(order.orderDate)}</p>
                    <p className="text-xl font-bold text-indigo-600">Total: ₹{order.totalAmount}</p>
                  </div>
                  {/* <button 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                    onClick={() => handleOrderClick(order)}
                  >
                    View Details
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderSection;