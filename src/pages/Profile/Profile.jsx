import React, { useState } from 'react'
import UserProfile from './UserProfile'
import VendorProfile from './VendorProfile'
import { authUserAtom } from '../../store/other'
import { useAtom } from 'jotai'
import VenueProfile from './VenueProfile'

const Profile = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  return (
    authUser?.role == 'user' ?
    <UserProfile/> 
    :
    (authUser?.role == 'vendor' ?
    <VendorProfile/>
    :
    <VenueProfile/>)
    
  )
}

export default Profile
