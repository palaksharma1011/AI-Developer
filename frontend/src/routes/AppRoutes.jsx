import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import UserLogin from "../pages/Auth/UserLogin";
import UserRegister from "../pages/Auth/UserRegister";
import CreateProject from "../pages/Manage/createProject";
import DashBoard from "../pages/Manage/DashBoard";
import Profile from "../pages/User/Profile";
import Actions from "../pages/Manage/Actions";
import WorkScreen from "../pages/Work/WorkScreen";

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
        <Route path="/project/:id/work" element={<WorkScreen />} />
        <Route path="/project/:id/manage" element={<Actions />} />
        {/* not made */}
        <Route path="/project/:id/schedule" element={<Actions />} />

        {/* User */}
        <Route path="/user/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
