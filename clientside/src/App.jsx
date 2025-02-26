import React from "react";
import "./App.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import AdminLogin from "./Components/Adminlogin";
import ForgetPassword from "./Components/Forgetpassword";
import Resetpassword from "./Components/Resetpassword";
import AdminHome from "./Components/Adminhome";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import ProfileSection from "./Components/profileSection";
import EditProduct from "./Components/EditProduct";
import Sell from "./Components/Sell";
import ProductDetails from "./Components/Productdetails";
import Cart from "./Components/Cart";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                //admin
                <Route path="/admin" element={<AdminLogin/>}/>
                <Route path="/forgetpassword" element={<ForgetPassword/>}/>
                <Route path="/resetpassword" element={<Resetpassword/>}/>
                <Route path="/adminhome" element={<AdminHome/>}/>

                //user
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/" element={<Login/> }/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/profile/:id" element={<Profile/>}/>

                //product
                <Route path="/profilesection/:id" element={<ProfileSection/>}/>
                <Route path="/sell/:id" element={<Sell/>}/>
                <Route path="/editproduct/:id" element={<EditProduct/>}/>
                <Route path="/productdetails/:id" element={<ProductDetails/>}/>

                //Cart
                <Route path="/cart" element={<Cart/>}/>
                

            </Routes>
        </BrowserRouter>
    )
}

export default App;