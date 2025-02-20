import React, { useState, useEffect } from "react";
import { FiEdit3, FiSave } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast } from "react-toastify";

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
        toast.success("Profile updated successfully");
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <FiEdit3
        className="absolute top-0 right-0 text-gray-600 text-2xl cursor-pointer hover:text-gray-800 transition-colors"
        onClick={() => setIsEditing(true)}
      />
      <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
      <form onSubmit={updateUser} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="fname"
            value={userData.fname}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lname"
            value={userData.lname}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled
            className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"
          />
        </div>

        {isEditing && (
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded flex items-center hover:bg-blue-700 cursor-pointer disabled:bg-blue-400 transition-colors"
          >
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </button>
        )}
      </form>
    </div>
  );
}

export default ProfileSection;
