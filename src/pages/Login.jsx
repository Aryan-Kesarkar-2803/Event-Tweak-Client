import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { alertNotification, errorNotification, successNotification } from "../utils/toast";
import { loginUser } from "../utils/repository/user";
import { loginVendor } from "../utils/repository/vendor";
import { useAtom } from "jotai";
import { userAtom } from "../store/user";
import { authUserAtom } from "../store/other";
import { CircularProgress } from "@mui/material";
import { address } from "framer-motion/client";
import { loginVenue } from "../utils/repository/venue";


const Login = () => {
  const navigate = useNavigate()
  const [loadingForButton, setLoadingForButton] = useState(false)
  const [loginType, setLoginType] = useState("user"); // user | vendor
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForUser, setPasswordForUser] = useState("")
  const [passwordForVendor, setPasswordForVendor] = useState("")
  const [emailForUser, setEmailForUser] = useState("");
  const [emailForVendor, setEmailForVendor] = useState("");
  const [emailForVenue, setEmailForVenue] = useState("");
  const [passwordForVenue, setPasswordForVenue] = useState("");
  const[user, setUser] = useAtom(userAtom)
  const[authUser, setAuthUser] = useAtom(authUserAtom)

  const handleLoginUser = async(e) => {
    setLoadingForButton(true);
    e.preventDefault();

    if(emailForUser?.trim() == ""){
      alertNotification({message:'Please enter email'})
      setLoadingForButton(false)
      return;
    }
    if(passwordForUser?.trim() == ""){
      alertNotification({message: 'please enter password'})
      setLoadingForButton(false)
      return;
    }

    const response = await loginUser({
      email:emailForUser.trim() || "",
      password: passwordForUser.trim() || ""
    })
    if(response == false){
      setLoadingForButton(false)
      return;
    }

    if(response.status == 200){
      if(response?.data?.role && response?.data?.token){
        setAuthUser({
          ...user,
          role:response?.data?.role || "",
          token: response?.data?.token || '',
          userDetails:{
            name: response?.data?.name || '',
            id: response?.data?.id || '',
          }
        })
      }
      if(!response?.data?.name){
        successNotification({
          message: response?.message,
          duration:800,
        });
        alertNotification({
          message:'Please complete your profile!',
          duration:1500,
        });
        setLoadingForButton(false)
        navigate('/profile')
        return;
      }
      successNotification({message:response?.message});
      setLoadingForButton(false)
      navigate('/')
    }else{
      errorNotification({message:response?.message})
      setLoadingForButton(false)
    }
  }

  const handleLoginVendor = async(e) => {
    setLoadingForButton(true);
    e.preventDefault();

    if(emailForVendor?.trim() == ""){
      alertNotification({message:'Please enter email'})
      setLoadingForButton(false)
      return;
    }
    if(passwordForVendor?.trim() == ""){
      alertNotification({message: 'please enter password'})
      setLoadingForButton(false)
      return;
    }
    const response = await loginVendor({
      email:emailForVendor.trim() || "",
      password: passwordForVendor.trim() || ""
    })
    if(response == false){
      setLoadingForButton(false)
      return;
    }
    if(response.status == 200){
      if(response?.data?.role && response?.data?.token){
      setAuthUser({
        ...user,
        role:response?.data?.role || "",
        token: response?.data?.token || "",
        userDetails:{
          name:response?.data?.name || '',
          id: response?.data?.id || ''
        }
      })
      }
      if(!response?.data?.name){
        successNotification({
          message: response?.message,
          duration:800,
        });
        alertNotification({
          message:'Please complete your profile!',
          duration:1500,
        });
        setLoadingForButton(false)
        navigate('/profile')
        return;
      }
      successNotification({message:response?.message});
      setLoadingForButton(false)
      navigate("/")
    }else{
      errorNotification({message:response?.message})
      setLoadingForButton(false)
    }
  }
  const handleLoginVenue = async(e) => {
    setLoadingForButton(true);
    e.preventDefault();

    if(emailForVenue?.trim() == ""){
      alertNotification({message:'Please enter email'})
      setLoadingForButton(false)
      return;
    }
    if(passwordForVenue?.trim() == ""){
      alertNotification({message: 'please enter password'})
      setLoadingForButton(false)
      return;
    }
    const response = await loginVenue({
      email:emailForVenue.trim() || "",
      password: passwordForVenue.trim() || ""
    })
    if(response == false){
      setLoadingForButton(false)
      return;
    }
    if(response.status == 200){
      if(response?.data?.role && response?.data?.token){
      setAuthUser({
        ...user,
        role:response?.data?.role || "",
        token: response?.data?.token || "",
        userDetails:{
          name:response?.data?.name || '',
          id: response?.data?.id || '',
        }
      })
      }
      
       if(!response?.data?.name){
        successNotification({
          message: response?.message,
          duration:800,
        });
        alertNotification({
          message:'Please complete your profile!',
          duration:1500,
        });
        setLoadingForButton(false)
        navigate('/profile')
        return;
      }

      successNotification({message:response?.message});
      setLoadingForButton(false)
      navigate("/")
    }else{
      errorNotification({message:response?.message})
      setLoadingForButton(false)
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 font-semibold transition ${
              loginType === "user"
                ? "bg-teal-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setLoginType("user")}
          >
            User Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition ${
              loginType === "vendor"
                ? "bg-teal-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setLoginType("vendor")}
          >
            Vendor Login
          </button>
           <button
            className={`flex-1 py-2 font-semibold transition ${
              loginType === "venue"
                ? "bg-teal-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setLoginType("venue")}
          >
            Venue Login
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {loginType === "user" ? "Welcome Back, User!" : "Welcome Back, Vendor!"}
        </h2>

        {/* Form */}

        {
          loginType == "user" ?

          // for user
           <form className="space-y-5" onSubmit={handleLoginUser}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={emailForUser}
              onChange={e => {setEmailForUser(e.target.value)}}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={passwordForUser}
              onChange={(e)=> {setPasswordForUser(e.target.value)}}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition ${loadingForButton ? 'pointer-events-none': 'pointer-events-auto'}`}
          >
            {
              loadingForButton ?
              <CircularProgress size={22}  color="white"/> : "Login"

            }
          </button>
        </form>
        :

        loginType === 'vendor' ?
        // for vendor
           <form className="space-y-5" onSubmit={handleLoginVendor}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={emailForVendor}
              onChange={e => {setEmailForVendor(e.target.value)}}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={passwordForVendor}
              onChange={e => setPasswordForVendor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition ${loadingForButton? 'pointer-events-none':'pointer-events-auto'}`}
          >
            {
              loadingForButton ?
              <CircularProgress size={20} color="white"/> : "Login"
            }
          </button>
        </form>
        :
        // for Venue
         <form className="space-y-5" onSubmit={handleLoginVenue}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={emailForVenue}
              onChange={e => {setEmailForVenue(e.target.value)}}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={passwordForVenue}
              onChange={e => setPasswordForVenue(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition ${loadingForButton? 'pointer-events-none':'pointer-events-auto'}`}
          >
            {
              loadingForButton ?
              <CircularProgress size={20} color="white"/> : "Login"
            }
          </button>
        </form>
        }
       

        {/* Footer */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
