    import React, { useState, useEffect } from "react";
    import Nav from "./Nav";
    import axios from "axios";
    import ApiPath from "../ApiPath";
    import { useNavigate } from "react-router-dom";
    import { toast } from "react-toastify";
    import { FiFilter, FiDollarSign, FiTag, FiX } from "react-icons/fi";
    import { FaArrowAltCircleRight } from "react-icons/fa";

    const AllProducts = () => {
        const [Allproducts, setAllProducts] = useState([]);
        const navigate = useNavigate();
        const token = localStorage.getItem("token");

        useEffect(() => {
            const getallProducts = async() => {
                try {
                const res = await axios.get(`${ApiPath()}/allproducts`);
                if(res.status === 200){
                    const Allproducts = res.data.map(product => ({
                    ...product,
                    originalPrice: Math.round(product.price * (1 + Math.random() * 0.4)),
                    discountPercentage: Math.round(Math.random() * 40)
                    }));
                    const searchParams = new URLSearchParams(window.location.search);
                    const categoryFilter = searchParams.get('category');
                    
                    if (categoryFilter) {
                    // Filter products by the category parameter
                    const filteredProducts = Allproducts.filter(
                        product => product.category === categoryFilter
                    );
                    setAllProducts(filteredProducts);
                    } else {
                    // If no category filter, show all products
                    setAllProducts(Allproducts);
                    }
                }
                } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('No Products ');
                }
            }
            const getProducts = async() => {
                try {
                const userId = localStorage.getItem("userId");
                const res = await axios.post(`${ApiPath()}/allproducts`, {userId});
                if(res.status === 200){
                    const Allproducts = res.data.map(product => ({
                    ...product,
                    originalPrice: Math.round(product.price * (1 + Math.random() * 0.4)),
                    discountPercentage: Math.round(Math.random() * 40)
                    }));
                    const searchParams = new URLSearchParams(window.location.search);
                    const categoryFilter = searchParams.get('category');
                    
                    if (categoryFilter) {
                    // Filter products by the category parameter
                    const filteredProducts = Allproducts.filter(
                        product => product.category === categoryFilter
                    );
                    setAllProducts(filteredProducts);
                    } else {
                    // If no category filter, show all products
                    setAllProducts(Allproducts);
                    }
                }
                } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('No Products ');
                }
            }
            if(!token){
                getallProducts();
              }
              else{
                getProducts();
              }
        }, []);
    

    return (
        <div className="min-h-screen bg-gray-100">
        <Nav />
        <div className="h-34 md:h-20 bg-gray-900"></div>
        
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                
                <div className="w-full p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Allproducts].reverse().map((product) => (
                        <div
                            onClick={() => navigate(`/productdetails/${product._id}`)}
                            key={product._id}
                            className="product-card bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                </div>
            </div>
            </div>
        
    );
    };

    export default AllProducts;