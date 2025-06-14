import React from "react";
import "./App.css";
import { BrowserRouter, Routes,Route, Router } from "react-router-dom";
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
import Adminforgetpassword from "./Components/Adminforgetpassword";
import Adminresetpassword from "./Components/Adminresetpassword";
import AllProducts from "./Components/AllProducts";


function App() {
    return(
        <BrowserRouter>
            <Routes>
                //admin
                <Route path="/admin" element={<AdminLogin/>}/>
                <Route path="/adminforgetpassword" element={<Adminforgetpassword/>}/>
                <Route path="/adminresetpassword" element={<Adminresetpassword/>}/>
                <Route path="/adminhome" element={<AdminHome/>}/>

                //user
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/login" element={<Login/> }/>
                <Route path="/" element={<Home/>}/>
                <Route path="/profile/:id" element={<Profile/>}/>
                <Route path="/forgetpassword" element={<ForgetPassword/>}/>
                <Route path="/resetpassword" element={<Resetpassword/>}/>

                //product
                <Route path="/profilesection/:id" element={<ProfileSection/>}/>
                <Route path="/sell/:id" element={<Sell/>}/>
                <Route path="/editproduct/:id" element={<EditProduct/>}/>
                <Route path="/productdetails/:id" element={<ProductDetails/>}/>
                <Route path="/allproducts" element={<AllProducts/>}/>

                //Cart
                <Route path="/cart" element={<Cart/>}/>

                //error
                <Route path="*" element={<h1>404 Not Found</h1>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default App;