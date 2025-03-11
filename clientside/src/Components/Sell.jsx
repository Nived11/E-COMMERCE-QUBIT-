import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiPath from '../ApiPath';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import {Package2, BookOpen, Tablet, Hash, DollarSign, HardDrive, FileText, Settings2, Shield, ImagePlus, X} from 'lucide-react';
import Nav from './Nav';
import axios from 'axios';

function Sell() {
  const inputClasses = "w-full h-12 text-base rounded-lg border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-300 transition-colors px-4 bg-white";
  const textareaClasses = "w-full text-base rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-300 transition-colors p-4 bg-white";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {id} = useParams();
  
  const [product, setProduct] = useState({ "userId": id, "productname": '', "category": '', "Brand": '', "modelno": '',
    "price": '', "quantity": '', "warranty": '', "description": '', "specifications": '', "productimages": [] });
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,              // Max size in MB
      maxWidthOrHeight: 1024,    // Max width/height
      useWebWorker: true,
      fileType: 'image/jpeg'     // Output format
    };
    
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.log('Error compressing image:', error);
      return file;  // Return original file if compression fails
    }
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!file || !validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size too large. Please upload an image under 5MB');
      return;
    }
  
    if (product.productimages.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
  
    try {
      setIsLoading(true);
      const compressedFile = await compressImage(file);
      const base64 = await convertBase64(compressedFile);
      
      setProduct(prev => ({
        ...prev,
        productimages: [...prev.productimages, base64]
      }));
    } catch (error) {
      toast.error('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    setProduct(prevState => ({
      ...prevState,
      productimages: prevState.productimages.filter((_, i) => i !== index)
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`${ApiPath()}/addproduct`, product, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxContentLength: 10 * 1024 * 1024, // 10MB limit
      });
      
      if (res.status === 201) {
        toast.success(res.data.msg);
        setTimeout(() => {
          navigate("/");
        }, 3000);
        setProduct({ "userId": id, "productname": '', "category": '',  "Brand": '', "modelno": '',
          "price": '', "quantity": '', "warranty": '', "description": '', "specifications": '',"productimages": []});
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || 'Error adding product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Nav />
      <div className="pt-[120px] pb-12 px-4">
        <div className="w-full mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-t-2xl shadow-sm border border-indigo-100 p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Package2 className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">List Your Product</h1>
                  <p className="text-base text-gray-600 mt-1">Fill in the details to list your product for sale</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-50">
            <div className="p-6">
              <form onSubmit={addProduct} className="space-y-8">
                {/* Product Name and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productname"
                      className={inputClasses}
                      placeholder="Enter product name"
                      value={product.productname}
                      onChange={(e) => setProduct({...product, productname: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <Tablet className="w-5 h-5 text-indigo-600" />
                      Category
                    </label>
                    <select
                      name="category"
                      className={inputClasses}
                      value={product.category}
                      onChange={(e) => setProduct({...product, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
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
                  </div>
                </div>

                {/* Brand and Model Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <Package2 className="w-5 h-5 text-indigo-600" />
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className={inputClasses}
                      placeholder="Enter brand name"
                      value={product.Brand}
                      onChange={(e) => setProduct({...product, Brand: e.target.value})}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <Hash className="w-5 h-5 text-indigo-600" />
                      Model Number
                    </label>
                    <input
                      type="text"
                      name="model"
                      className={inputClasses}
                      placeholder="Enter model number"
                      value={product.modelno}
                      onChange={(e) => setProduct({...product, modelno: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      MRP
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        className={`${inputClasses} pl-10`}
                        placeholder="0.00"
                        min="0"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                        required
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 text-lg">₹</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <HardDrive className="w-5 h-5 text-indigo-600" />
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      className={inputClasses}
                      placeholder="Enter quantity"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => setProduct({...product, quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Warranty */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    className={inputClasses}
                    placeholder="e.g., 1 Year Manufacturer Warranty"
                    value={product.warranty}
                    onChange={(e) => setProduct({...product, warranty: e.target.value})}
                    required
                  />
                </div>

                {/* Details Section */}
                <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="5"
                      className={textareaClasses}
                      placeholder="Enter product description"
                      value={product.description}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <Settings2 className="w-5 h-5 text-indigo-600" />
                      Specifications
                    </label>
                    <textarea
                      name="specifications"
                      rows="5"
                      className={textareaClasses}
                      placeholder="Enter detailed specifications (processor, display, battery etc.)"
                      value={product.specifications}
                      onChange={(e) => setProduct({...product, specifications: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="w-full">
                  <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                    <ImagePlus className="w-5 h-5 text-indigo-600" />
                    Product Images
                  </label>
                  <div className="flex flex-wrap justify-around gap-6">
                    {/* Image Preview Cards */}
                    {product.productimages.map((image, index) => (
                      <div key={index} className="relative h-30 w-30 ">
                        <img
                          src={image}
                          className="h-30 w-30 object-cover rounded-lg border-2  border-indigo-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-700 focus:outline-none cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {/* Upload Button */}
                    {product.productimages.length < 5 && (
                      <label className={`h-40 w-40 flex flex-col items-center justify-center border-2 border-dashed 
                        border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-500 
                        hover:bg-indigo-50 transition-all ${isLoading ? 'opacity-50' : ''}`}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                      ) : (
                        <>
                          <ImagePlus className="w-10 h-10 text-indigo-500 mb-2" />
                          <span className="text-base text-gray-600">Add Image</span>
                        </>
                      )}
                    </label>
                  )}
                  </div>
                  <p className="mt-3 text-base text-gray-500">
                    {product.productimages.length} of 5 images added
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8">
                  <button type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 text-lg rounded-lg hover:from-indigo-700 
                    hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-all flex items-center
                    justify-center gap-3 hover:shadow-lg cursor-pointer" >
                    <Package2 className="w-6 h-6" />
                    Sell Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sell;