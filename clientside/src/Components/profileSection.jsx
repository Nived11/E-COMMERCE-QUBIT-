import React, { useState, useEffect } from 'react'
import { FiEdit3, FiSave } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApiPath from "../ApiPath";
import { toast, ToastContainer } from "react-toastify";


function ProfileSection() {
    const [isEditing, setIsEditing] = useState(false);
    const [count, setCount] = useState(0);
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
                  console.error("No token found");
                  return;
              }
              const res = await axios.get(`${ApiPath()}/profile/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              if (res.status === 200) {
                  setUserData(res.data);
              }
          } catch (error) {
              console.error("Error fetching user details:", error);
          }
      };
  
      userDetails();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        const res = await axios.put(`${ApiPath()}/updateuser/${id}`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
            toast.success("updated successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            setIsEditing(false);
            setCount(count + 1);
        }
    } catch (error) {
        console.error(error);
    }
};
  
    return (
        <div className="relative max-w-2xl mx-auto">
              <FiEdit3 className="absolute top-0 right-0 text-gray-600 text-2xl cursor-pointer"  
              onClick={()=> setIsEditing(true)} />
              <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input type="text" name="firstName" value={userData.fname} 
                  onChange={(e) => setUserData({ ...userData, fname: e.target.value })}
                  disabled={!isEditing} required
                    className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={userData.lname} 
                  onChange={(e) => setUserData({ ...userData, lname: e.target.value })}
                  readOnly={!isEditing} required
                    className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input type="text" name="phone" value={userData.phone}  
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  readOnly={!isEditing} required
                    className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100"/>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={userData.email}  
                  disabled
                    className="w-full p-2 border rounded bg-white text-gray-700 disabled:bg-gray-100" />
                </div>
              </div>
              
              {isEditing && (
                <button onClick={updateUser} 
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded flex items-center hover:bg-blue-700 cursor-pointer">
                  <FiSave className="mr-2" /> Save
                </button>
              )}
              <ToastContainer />
        </div>
    )
}

export default ProfileSection   