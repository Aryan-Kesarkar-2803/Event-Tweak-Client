import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import {Outlet, useNavigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import {firstRequest} from '../src/utils/repository/other'
import { authUserAtom } from './store/other'
import { useAtom } from 'jotai'
const Layout = () => {
  const navigate = useNavigate()
  const [authUser, setAuthUser] = useAtom(authUserAtom)
   useEffect(()=>{
    const getAuthenticationStatus = async() =>{
      const res = await firstRequest();
      if(res == false){
        
        setAuthUser({})
        navigate("/")
      }
    }
    getAuthenticationStatus();

  },[])
 
  return (
    <>
    <Header/>
    <Outlet/>
    <ToastContainer 
    style={{
      width:'100%'
    }}
    />
    </>
  )
}

export default Layout
