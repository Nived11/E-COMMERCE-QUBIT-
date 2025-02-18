import React from "react";
import "./App.css";
import { createContext } from "react";
import AdminLogin from "./Components/Adminlogin";
import ForgetPassword from "./Components/Forgetpassword";
import Resetpassword from "./Components/Resetpassword";
import AdminHome from "./Components/AdminHome";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import { BrowserRouter, Routes,Route } from "react-router-dom";

export const ThemeContext = createContext();

function App() {
    const [usermail, setEmail] = React.useState("");
    return(
        <ThemeContext.Provider value={{usermail,setEmail}}>
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
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
        </ThemeContext.Provider>
    )
}

export default App;