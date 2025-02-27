import React, { useState, useEffect } from "react";
import { FiEdit3, FiSave, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login again");
          return;
        }
        setIsLoading(true);
        const res = await axios.get(`${ApiPath()}/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setUserData(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Error fetching profile");
      } finally {
        setIsLoading(false);
      }
    };

    userDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }
      setIsLoading(true);
      const res = await axios.put(`${ApiPath()}/updateuser/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success("Profile updated..");
        
        setIsEditing(false);
        
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="absolute top-4 right-4 z-10">
        <button
          className="cursor-pointer bg-indigo-100 p-3 rounded-full text-indigo-600 hover:bg-indigo-200 transition-all duration-300 hover:shadow-md transform hover:scale-105"
          onClick={() => setIsEditing(!isEditing)}
        >
          <FiEdit3 className="text-xl" />
        </button>
      </div>
      
      <div className="p-8">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 rounded-full mr-6">
            <FiUser className="text-white text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Profile Information
            </h2>
            <p className="text-gray-500">
              {isEditing ? "Edit your personal details below" : "View your personal information"}
            </p>
          </div>
        </div>

        <form onSubmit={updateUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group relative transition-all duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="fname"
                  value={userData.fname}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 pl-4 border-2 rounded-lg bg-white text-gray-700 
                  focus:outline-none transition-all duration-300 ${
                    isEditing 
                      ? "border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transform focus:-translate-y-1" 
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-b transition-all duration-700 ${
                  isEditing ? "ml-3 w-11/12" : "w-0"
                }`}></div>
              </div>
            </div>
            
            <div className="input-group relative transition-all duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="lname"
                  value={userData.lname}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full p-3 pl-4 border-2 rounded-lg bg-white text-gray-700 
                  focus:outline-none transition-all duration-300 ${
                    isEditing 
                      ? "border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transform focus:-translate-y-1" 
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-b transition-all duration-700 ${
                  isEditing ? "ml-3 w-11/12" : "w-0"
                }`}></div>
              </div>
            </div>
          </div>

          <div className="input-group relative transition-all duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              <div className="flex items-center">
                <FiPhone className="mr-2 text-indigo-500" />
                Phone Number
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full p-3 pl-4 border-2 rounded-lg bg-white text-gray-700 
                focus:outline-none transition-all duration-300 ${
                  isEditing 
                    ? "border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transform focus:-translate-y-1" 
                    : "border-gray-200 bg-gray-50"
                }`}
              />
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-b transition-all duration-700 ${
                isEditing ? "ml-3 w-145" : "w-0"
              }`}></div>
            </div>
          </div>

          <div className="input-group relative transition-all duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              <div className="flex items-center">
                <FiMail className="mr-2 text-indigo-500" />
                Email Address
              </div>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={userData.email}
                disabled
                className="w-full p-3 pl-4 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 transition-all duration-300"
              />
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-200 text-xs px-2 py-1 rounded-full text-gray-600">
                Locked
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-lg flex justify-center items-center hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FiSave className="mr-2 text-xl" />
                    <span>Save Changes</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </form>

        {!isEditing && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Click the edit button to update your information</p>
          </div>
        )}
      </div>
      
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"></div>
    </div>
  );
}

export default ProfileSection;