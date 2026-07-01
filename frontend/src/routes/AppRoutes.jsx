import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import UserLogin from "../pages/Auth/UserLogin";
import UserRegister from "../pages/Auth/UserRegister";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/register" element={<UserRegister/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;