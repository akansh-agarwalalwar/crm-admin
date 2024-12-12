import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chats from "./components/Core/Chats/Chats";
import Login from "./components/Core/Auth/Login";
import Dashboard from "./components/Core/Dashboard/Dashboard";
import Home from "./components/Core/Dashboard/Home";
import EmployeeDashboard from "./components/Core/Employee/EmployeeDashboard";

function Navigation() {
  return (
    <BrowserRouter>
      <div className="bg-[#F5F5F5] overflow-hidden h-dvh w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />}>
            {/* <Route index element={<Home />} /> */}
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/chats" element={<Chats />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Navigation;