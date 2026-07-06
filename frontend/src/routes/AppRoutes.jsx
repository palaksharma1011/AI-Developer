import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import UserLogin from "../pages/Auth/UserLogin";
import UserRegister from "../pages/Auth/UserRegister";
import CreateProject from "../pages/Project/createProject";
import DashBoard from "../pages/Project/DashBoard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />

        {/* Projects */}
        <Route path="/project/create" element={<CreateProject />} />
        <Route path="/project/Dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
