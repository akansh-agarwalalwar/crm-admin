import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { RiInboxArchiveFill } from "react-icons/ri";
import { LuRadioTower } from "react-icons/lu";
import { RiContactsBookFill } from "react-icons/ri";
import { TbSettingsUp } from "react-icons/tb";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdNotificationsNone } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import user from "../../assets/user.png";
const data = [
  {
    title: "team inbox",
    icon: RiInboxArchiveFill,
    link: "/",
  },
  {
    title: "contacts",
    icon: LuRadioTower,
    link: "/contacts",
  },
  {
    title: "invoice",
    icon: RiContactsBookFill,
    link: "/calendar",
  },
  {
    title: "itinerary",
    icon: TbSettingsUp,
    link: "/itinerary",
  },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="h-[90px] w-full flex justify-between items-center text-gray-400 bg-white p-5">
      <Link to="/">
        <img src={logo} alt="logo" className="w-[80px]  h-[80px]" />
      </Link>
      <ul className="flex justify-between items-center h-full border-r-[3px] px-4">
        {data.map((item, index) => {
          const isActive = location.pathname === item.link; // Check if the current path matches the item's link
          return (
            <li key={index} className="flex items-center mx-4 justify-center ">
              <Link
                to={item.link}
                className={`flex items-center mx-4 gap-4 font-semibold justify-center capitalize ${
                  isActive ? "text-[#00BBFF]" : "text-[#888888]"
                }`}
              >
                <item.icon className="text-[24px]" />
                {item.title}
              </Link>
            </li>
          );
        })}
        <HiMenuAlt3 className="text-[24px] text-gray-500 cursor-pointer" />
      </ul>
      <div className="flex items-center justify-center gap-5">
        <MdNotificationsNone className="text-[32px] text-gray-500 cursor-pointer" />

        <div className="text-start font-semibold">
          <h3>Connected</h3>
          <h2 className="text-[#00BBFF]">+91-9817761746</h2>
          <h2 className="text-[#FFC20E] flex gap-2 items-center">
            <GoDotFill />
            Take a Break
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className=" relative">
          <img src={user} alt="profilePic" className="w-[40px] h-[40px]" />
          <GoDotFill className=" absolute bottom-0 -right-1 text-[#60D669]" />
        </div>
        <h1 className="flex text-[#00BBFF] flex-col">
          Vaibhav Agarwal
          <span className="text-xs text-gray-400">ID:123123213</span>
        </h1>
      </div>
    </nav>
  );
}

export default Navbar;
