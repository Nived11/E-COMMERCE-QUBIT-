import React, { useState } from 'react';
import {Package2, BookOpen, Tablet, Hash, DollarSign, HardDrive, FileText,Settings2, Shield, ImagePlus, X} from 'lucide-react';
import Nav from './Nav';

function Sell() {
  const inputClasses = "w-full h-12 text-base rounded-lg  border-gray-200 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-300 transition-colors px-4 bg-white";
  const textareaClasses = "w-full text-base rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-300 transition-colors p-4 bg-white";

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
              <form className="space-y-8">
                {/* Product Name and Category in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      className={inputClasses}
                      placeholder="Enter product name"
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
                      required
                    >
                      <option value="">Select Category</option>
                    </select>
                  </div>
                </div>

                {/* Brand and Model Number in one line */}
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
                      required
                    />
                  </div>
                </div>

                {/* Price and Stock in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="flex items-center gap-2 text-base font-medium text-gray-800 mb-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      MRP
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="mrp"
                        className={`${inputClasses} pl-10`}
                        placeholder="0.00"
                        required
                        min="0"
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
                      name="stock"
                      className={inputClasses}
                      placeholder="Enter quantity"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Warranty field (single line) */}
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
                  <div className="flex flex-wrap gap-4">
                    <label className="h-40 w-40 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <ImagePlus className="w-10 h-10 text-indigo-500 mb-2" />
                      <span className="text-base text-gray-600">Add Images</span>
                    </label>
                  </div>
                  <p className="mt-3 text-base text-gray-500">Upload at least 3 images (Maximum 6)</p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 text-lg rounded-lg hover:from-indigo-700 
                    hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-all flex items-center
                     justify-center gap-3 hover:shadow-lg cursor-pointer"
                  >
                    <Package2 className="w-6 h-6" />
                    List Product
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