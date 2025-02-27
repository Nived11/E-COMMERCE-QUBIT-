import React, { useState, useEffect } from 'react';
import { Package2, Edit2, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import ApiPath from '../ApiPath';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { id } = useParams();

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${ApiPath()}/getsellerproducts/${id}`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [id]); // Removed count from dependencies since we're not using it anymore



  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

 const handleDelete=async(product)=>{
    try {
        const id=product;
        const res=await axios.delete(`${ApiPath()}/deleteproduct/${id}`);
        if(res.status==200){
           toast.success(res.data.msg);
          setTimeout(() => {
            getProducts();
          }, 1000);
        }

    } catch (error) {
        toast.error(error.response?.data?.msg || 'Error deleting product');
    }
 }





  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
          <p className="text-gray-600">Manage your listed products</p>
        </div>
        
        <div className="flex gap-4">
          <select
            className="px-4 py-2 rounded-lg border border-gray-500 text-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Laptops">Laptops</option>
            <option value="watches">Watches</option>
            <option value="earphones">Earphones</option>
            <option value="camera">Camera</option>
            <option value="speakers">Speakers</option>
            <option value="gaming">Gaming</option>
            <option value="tablet">Tablets</option>
            <option value="smartTv">Smart Tv</option>
          </select>
          
          <a
            href={`/sell/${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Package2 className="w-5 h-5" />
            Add Product
          </a>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">No products found</h3>
          <p className="text-gray-600">Start selling by adding your first product</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative md:h-70 h-44 pl-10 mb-2">
                <img
                  src={product.productimages[0]}
                  alt={product.productname}
                  className=" h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2 " >
                  <button  onClick={() => handleDelete(product._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer" >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {product.productname}
                  </h3>
                 
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-600 ">{product.Brand} | 
                  <span className={`ml-2  ${product.quantity > 0 ? 'text-sm px-4  py-1  rounded  bg-green-600 text-white '
                     : 'text-sm px-4  py-1 rounded  bg-red-600 text-white'} `}>
                      {product.quantity > 0 ? ' In Stock ' : ' Out of Stock '}
                   {product.quantity}
                  </span>
                  </p>
                  <p className="text-xl font-bold text-indigo-600">₹{product.price}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <a
                    href={`/EditProduct/${product._id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                   Edit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ProductSection;