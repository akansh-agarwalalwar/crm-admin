import React from "react";
import Navbar from "../../common/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Dashboard() {
  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default Dashboard;