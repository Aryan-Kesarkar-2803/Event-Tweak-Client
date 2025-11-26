import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userAtom } from "../store/user";
import { FaCircle, FaUserCircle } from "react-icons/fa";
import { authUserAtom } from "../store/other";
import { ClickAwayListener } from "@mui/material";



const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false)
  const [openDialogForLogout, setOpenDialogForLogout] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const navigate = useNavigate();

  const logout = () =>{
     setUser({});
    setAuthUser({})
    navigate('/')
    setOpenDialogForLogout(false) 
  }

  const toggleProfileMenu = () =>{
    setOpenProfileMenu(prev => !prev)
  }
  const navigateTo = (path) => {
    toggleProfileMenu();
    navigate(path)
  }

  return (
    <header className="w-full h-16 md:h-20 bg-gradient-to-r from-indigo-700 to-purple-500 text-white shadow-md z-10">
      <div className=" mx-auto flex items-center justify-between px-4 py-3 md:py-4 pl-7">
        <div className="flex items-center gap-5">
          <button
            id="hamburger"
            onClick={() => setOpenMenu(!openMenu)}
            className=" text-2xl flex align-middle"
          >
            <RxHamburgerMenu className="size-6 md:size-7" />
          </button>
          {/* Logo */}
          <p className="text-3xl font-bold tracking-wide self-start select-none">
            Event Tweak
          </p>
        </div>

        {/* Desktop Nav */}
        {
          authUser?.role === "user" &&
             <nav className="hidden md:flex gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/plan-event"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Plan a Event
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Services
          </NavLink>

        </nav>
        }
          {
          authUser?.role === "venue" &&
             <nav className="hidden md:flex gap-8 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/venue/schedule"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Schedule
          </NavLink>
          <NavLink
            to="/venue/booking-requests"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition select-none ${
                isActive ? "text-yellow-300" : ""
              }`
            }
          >
            Booking Requests
          </NavLink>
         

        </nav>
        }
       

        {authUser?.token && authUser?.token != "" > 0 ? (
          <ClickAwayListener onClickAway={()=>setOpenProfileMenu(false)}>
          <div className="relative  text-left  md:block">
            {/* <FaUserCircle/> */}

            <div className="flex align-middle gap-3">
              <p className="hidden sm:block text-xl font-bold text-white select-none ">
                Welcome {(authUser?.userDetails?.name && authUser?.userDetails?.name?.length > 0) ? (authUser?.userDetails?.name || '').split(' ')[0]:  (authUser?.role || "")}
              </p>

              <FaUserCircle className="size-6 md:size-7 cursor-pointer" onClick={toggleProfileMenu} />
            </div>

            {/* Dropdown */}
            
            <div className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl z-50 ${openProfileMenu ? 'block': 'hidden'}`}>
              <ul className="py-2 text-gray-700 text-center">
                <li
                  className={` md:hidden block px-4 py-2  cursor-none text-black font-bold select-none`}
                >
                  Welcome {authUser?.userDetails?.name !== '' ? (authUser?.userDetails?.name || '').split(' ')[0]:  (authUser?.role || "")}
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer select-none" onClick={()=>{navigateTo('/profile')}}>
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer select-none" onClick={()=>{navigateTo("settings")}}>
                  Settings
                </li>
                <li
                  className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer select-none"
                  onClick={()=>{
                    setOpenDialogForLogout(true)
                    toggleProfileMenu()
                  }
                  }
                >
                  Logout
                </li>
              </ul>
            </div>
           
          </div>
           </ClickAwayListener>
        ) : (
          <button
            className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        )}

        {/* Mobile Hamburger */}
      </div>

      {/* Mobile Menu */}

      <ClickAwayListener onClickAway={(e)=>{ 
        if(document.getElementById("hamburger")?.contains(e?.target)) return;
        setOpenMenu(false)
        }}
      >
      <div
       className={`w-1/2 md:w-1/5 h-auto fixed top-16 md:top-20 left-0  bg-slate-200 text-center text-black px-5 py-4
    space-y-4 shadow-xl rounded-r-2xl transform transition-transform duration-300 ease-in-out z-50
    ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <NavLink
          to="/"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Home
        </NavLink>


      {
        authUser?.role === "user" &&
        <>
          <NavLink
          to="/my-bookings"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          My Bookings
        </NavLink>
        <NavLink
          to="/plan-event"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Plan Event
        </NavLink>
        
          <NavLink
          to="/booking-requests"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Booking Requests
        </NavLink>

        <NavLink
          to="/services"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Book Service
        </NavLink>
         <NavLink
          to="/service-requests"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Service Requests
        </NavLink>
        </>
      }

       {
        authUser?.role === "venue" &&
        <>
       
        <NavLink
          to="/venue/schedule"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Schedule
        </NavLink>
         <NavLink
          to="/venue/booking-requests"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Booking Requests
        </NavLink>
        </>
      }
      {
        authUser?.role === "vendor" &&
        <>
        <NavLink
          to="/vendor/schedule"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Schedule
        </NavLink>
         <NavLink
          to="/vendor/booking-requests"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Booking Requests
        </NavLink>
          <NavLink
          to="/vendor/service-requests"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Service Requests
        </NavLink>
        </>
      }
         

         <NavLink
          to="/about"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          onClick={() => setOpenMenu(false)}
          className={({ isActive }) =>
            `block py-1 rounded-md transition-all duration-200 ${
              isActive
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "hover:text-indigo-600 hover:border-b-2 hover:border-indigo-400"
            }`
          }
        >
          Contact
        </NavLink>
      </div>
      </ClickAwayListener>
      {openDialogForLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpenDialogForLogout(false);
                }}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
