import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ApiPath from '../ApiPath';
import { ToastContainer, toast } from 'react-toastify';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';

function AddressSection({ onMobileFormToggle }) {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [count, setCount] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const modalRef = useRef(null);
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
            setFormVisible(false);
            // Show sidebar again on mobile after form submission
            if (onMobileFormToggle) {
              onMobileFormToggle(false);
            }
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
          setTimeout(() => {
            setCardsVisible(true);
          }, 100);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAddresses();
  }, [count, id]);

  useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        setFormVisible(true);
      }, 50);
    }
  }, [showForm]);

  const handleShowForm = () => {
    setShowForm(true);
    // Hide sidebar on mobile when form opens
    if (onMobileFormToggle) {
      onMobileFormToggle(true);
    }
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      // Show sidebar again on mobile when form closes
      if (onMobileFormToggle) {
        onMobileFormToggle(false);
      }
    }, 300);
  };

  const handleDeleteConfirmation = (_id) => {
    setAddressToDelete(_id);
    setDeleteModalOpen(true);
    // Hide sidebar on mobile when delete modal opens
    if (onMobileFormToggle) {
      onMobileFormToggle(true);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
    // Show sidebar again on mobile when modal closes
    if (onMobileFormToggle) {
      onMobileFormToggle(false);
    }
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;
    
    try {
      const res = await axios.delete(`${ApiPath()}/deleteAddress/${addressToDelete}`);
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
        // First close the modal immediately
        setDeleteModalOpen(false);
        setAddressToDelete(null);
        // Show sidebar again on mobile after successful delete
        if (onMobileFormToggle) {
          onMobileFormToggle(false);
        }

       window.location.reload();
      }
    } catch (error) {
      console.error(error);
      // Close modal even on error
      setDeleteModalOpen(false);
      setAddressToDelete(null);
      // Show sidebar again on mobile even on error
      if (onMobileFormToggle) {
        onMobileFormToggle(false);
      }
      
      toast.error("Failed to delete address", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold address-section-title">My Addresses</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 cursor-pointer add-address-btn"    
          onClick={handleShowForm}>
          <FiPlus className="mr-2" /> Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4   max-h-136 overflow-y-scroll scrollbar-hide"
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none', '::webkitScrollbar':{ display: 'none'} }}>
        {addresses.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500 empty-addresses">
            No saved addresses yet. Click "Add Address" to get started.
          </div>
        ) : (
          addresses.map(address => (
            <div key={address._id} 
              className={`bg-white border border-gray-200 rounded-md  p-4 shadow-sm address-card ${cardsVisible ? 'show' : ''}`} >
              <div className="flex justify-between">
                <div className="flex-grow">
                  <p className="font-medium text-blue-700">{address.name}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-600">{address.housename}, {address.area}</p>
                  {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                  <p className="text-gray-600">{address.city}, {address.state}</p>
                  <p className="text-gray-600">PIN: {address.pincode}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-xl text-red-500 hover:text-red-800 cursor-pointer delete-btn"
                    onClick={() => handleDeleteConfirmation(address._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 delete-modal">
          <div 
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md delete-confirmation-container"
            style={{
              transform: deleteModalOpen ? 'scale(1)' : 'scale(0.9)',
              opacity: deleteModalOpen ? 1 : 0,
              transition: 'all 0.3s ease'
            }}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Address</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this address?
              </p>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base cursor-pointer 
                font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base cursor-pointer
                font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className={`addr
         fixed inset-0 mt-20  backdrop-filter ml-0 md:ml-20 backdrop-blur-sm bg-white/0 flex items-center justify-center z-50 address-form-modal ${formVisible ? 'show' : ''}`}>
          <div  ref={modalRef}
            className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl h-screen md:h-auto md:max-h-[90vh] mobile-full-height overflow-y-auto address-form-container ${formVisible ? 'show' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-blue-700">Add New Address</h3>
              <button 
                onClick={handleCloseForm} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={addAddress} className="mt-4 address-form">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium form-label">
                      Full Name
                    </label>
                    <input  type="text"  id="name"  name="name" value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"  />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                    />
                  </div>
                </div>

                {/* Address Details */}
                <div className="form-group">
                  <label htmlFor="houseNo" className="block text-sm font-medium form-label">
                    House No/Name
                  </label>
                  <input
                    type="text"
                    id="houseNo"
                    name="housename"
                    value={formData.housename}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="roadArea" className="block text-sm font-medium form-label">
                    Road Name/Area
                  </label>
                  <input
                    type="text"
                    id="roadArea"
                    name="area"
                    value={formData.area}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="landmark" className="block text-sm font-medium form-label">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                  />
                </div>
                
                {/* City and State in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="city" className="block text-sm font-medium form-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state" className="block text-sm font-medium form-label">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="pincode" className="block text-sm font-medium form-label">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border form-input"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base 
                  font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer save-address-btn">
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