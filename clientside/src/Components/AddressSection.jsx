  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useParams } from 'react-router-dom';
  import ApiPath from '../ApiPath';
  import { ToastContainer, toast } from 'react-toastify';
  import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';

  function AddressSection() {
    const [showForm, setShowForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [count, setCount] = useState(0);
    const {id} = useParams();
    
    const [formData, setFormData] = useState({
      userId:id,
      name: '',
      phone: '',
      housename: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });

  const addAddress = async (e) => {
  e.preventDefault();
  try {
    const res=await axios.post(`${ApiPath()}/addAddress`, formData);
    if(res.status === 201) {
      toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
      setTimeout(() => {
          setShowForm(false);
      }, 3000);
      setFormData({ userId:id,  name: '', phone: '', housename: '', area: '', landmark: '', city: '', state: '', pincode: ''});
      setCount(count + 1);
    }
      
    } catch(error) {
    console.log(error);
    if (error.response) {
        toast.error(error.response.data.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    } else {
        alert("Something went wrong try again later.."); 
    }
  }
  }

  useEffect(()=>{
    const getAddresses = async () => {
      try {
        const res = await axios.get(`${ApiPath()}/getAddress/${id}`);
        if (res.status === 200) {
          setAddresses(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAddresses();
  }, [count, id]);

  const handleDelete = async (_id) => {
    try {
      const res = await axios.delete(`${ApiPath()}/deleteAddress/${_id}`);
      if (res.status === 200) {
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });        
        setCount(count + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

    return (
      <div className="relative max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Addresses</h2>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 cursor-pointer"    
            onClick={() => setShowForm(true)}>
            <FiPlus className="mr-2" /> Add Address
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4 max-h-136 overflow-y-scroll scrollbar-hide"
          style={{scrollbarWidth: 'none',msOverflowStyle: 'none','::webkitScrollbar':{ display: 'none'} }}>
          {addresses.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
              No saved addresses yet. Click "Add Address" to get started.
            </div>
          ) : (
            addresses.map(address => (
              <div key={address._id} className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex justify-between">
                  <div className="flex-grow">
                    <p className="font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">{address.housename}, {address.area}</p>
                    {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                    <p className="text-gray-600">{address.city}, {address.state}</p>
                    <p className="text-gray-600">PIN: {address.pincode}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-xl text-red-500 hover:text-red-800 cursor-pointer"
                      onClick={() => handleDelete(address._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl h-screen md:h-auto md:max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Add New Address</h3>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="text-gray-500 hover:text-gray-700 cursor-pointer">
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={addAddress} className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        
                      />
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <label htmlFor="houseNo" className="block text-sm font-medium text-gray-700">
                      House No/Name
                    </label>
                    <input
                      type="text"
                      id="houseNo"
                      name="housename"
                      value={formData.housename}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roadArea" className="block text-sm font-medium text-gray-700">
                      Road Name/Area
                    </label>
                    <input
                      type="text"
                      id="roadArea"
                      name="area"
                      value={formData.area}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      
                    />
                  </div>

                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                  
                  {/* City and State in one line */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base 
                    font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        )}
      </div>
    );
  }

  export default AddressSection;