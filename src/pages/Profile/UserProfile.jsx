import React, { useEffect, useState } from "react";
import {successNotification,alertNotification,errorNotification} from '../../utils/toast'
import { uploadSingleImage } from "../../utils/cloudinary";
import { isNumber } from "../../utils/others";
import { getUserProfile, updateUserProfile } from "../../utils/repository/user";
import { useAtom } from "jotai";
import { userAtom } from "../../store/user";
import Loader from "../../components/globalComponents/Loader";
import { CircularProgress } from "@mui/material";
import SelectBox from "../../components/globalComponents/SelectBox";
import { statesAndCities } from "../../utils/constants/LocationData";
import ImagePopup from "../../components/globalComponents/ImagePopup";
import { authUserAtom } from "../../store/other";

const UserProfileForm = () => {
  const [authUser, setAuthUser] = useAtom(authUserAtom)
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [loadingForSave, setLoadingForSave] = useState(false)
  const [openImagePopup, setOpenImagePopup] = useState(false)
  const [activeImageSrc, setActiveImageSrc] = useState('')
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    phoneNo: "",
    gender: "",
    profileImageData: {
      url:"",
      publicId:"",
    },
    file:null,
    address: {
      houseNo: "",
      locality: "",
      area: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const handleChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    if(e.target.name == 'pinCode'){
      const value  = e.target.value;
      if(!isNumber(value)) return;
    }
    setUserProfile({
      ...userProfile,
      address: { ...userProfile.address, [e.target.name]: e.target.value },
    });
  };

  const handleImageUpload = async(e) => {
    
    // const res = await uploadSingleImage(e);

    // if(res == false) return;

    // if(res == null){
    //    setUserProfile( prev => ({
    //   ...prev,
    //   profileImageData:{}
    // }))
    //   return;
    // }

    // setUserProfile(prev => ({
    //   ...prev,
    //   profileImageData:{
    //     ...prev?.profileImageData,
    //     url: res?.secure_url || '',
    //     publicId: res?.public_id || ''
    //   }
    // }))

    const file = e.target.files[0];

    if(file?.size > 1 * 1024 * 1024){
      errorNotification({message:'file size must be less than 1mb'});
      return;
    }

    setUserProfile(prev => ({
      ...prev,
      profileImageData: file
    }))

    // successNotification({message:'Image uploaded successfully'});
  };

  // useEffect(()=>{
  //   console.log('userProfile - ',userProfile);
  // },[userProfile])

  const clearImage = () => {

    if(userProfile?.file !== null){
       setUserProfile(prev => ({
        ...prev,
        file:null
      }))
    }else{
           setUserProfile(prev => ({
        ...prev,
        profileImageData:{
          ...prev.profileImageData,
          url:'',
        }
      }))
    }
  };
  const handleChangeProfileName = (e) => {
    setUserProfile(prev => ({
      ...prev,
      fullName: e.target.value,
    }))
  }
 const handleChangePhoneNo = (e) => {
  const value = e.target.value
  if (isNumber(value) && value?.length <= 10) {
    setUserProfile(prev => ({
      ...prev,
      phoneNo: value,
    }))
  }
}
const handleChangeImageData = (e) =>{
  const file = e.target.files[0];
  if(file?.size > 1 * 1024 * 1024){
    errorNotification({message: 'file size must be less than 1 mb'});
    return;
  }
  setUserProfile(prev => ({
    ...prev,
    file:file
  }))
}
const handleChangeGender = (e) =>{
  const value = e.target.value;
  console.log(value)
  setUserProfile(prev => ({
    ...prev,
    gender:value
  }))
}
const handleChangeUserState = (e) =>{
  const value = e.target.value;
  setUserProfile(prev => ({
    ...prev,
    address:{
      ...prev.address,
      state: value
    }
  }))
}
const handleChangeUserCity = (e) =>{
  const value = e.target.value;
  setUserProfile(prev => ({
    ...prev,
    address:{
      ...prev.address,
      city: value
    }
  }))
}

useEffect(()=>{
  console.log(userProfile)
},[userProfile])

  const handleSubmit = async(e) => {
    setLoadingForSave(true)
    e.preventDefault();
    if(userProfile?.phoneNo !== "" && userProfile?.phoneNo?.length !== 10){
      errorNotification({message:"please enter valid phone no"})
      setLoadingForSave(false)
      return;
    }

    let formData = new FormData();
    if(userProfile?.file !== null){
      formData.append('file',userProfile?.file || null);
    }
    
    formData.append('userProfile',JSON.stringify({
      email: user.email || '',
      fullName: userProfile?.fullName,
      gender: userProfile.gender,
      phoneNo: userProfile.phoneNo,
      address: userProfile.address,
      profileImageData: userProfile.profileImageData
    }))
    const res = await updateUserProfile(formData);
    if(!res){
      setLoadingForSave(false)
      return;
    }

    const data = res?.data || {};
    setUserProfile(prev => ({
      ...prev,
      fullName: data?.fullName || '',
      gender: data?.gender || '',
      profileImageData: {
        ...prev.profileImageData,
        url: data?.profileImageData?.url || '',
        publicId: data?.profileImageData?.publicId || ''
      },
      phoneNo: data?.phoneNo,
      address:{
        ...prev.address,
        area: data?.address?.area,
        city: data?.address?.city,
        houseNo: data?.address?.houseNo,
        locality: data?.address?.locality,
        pinCode: data?.address?.pinCode,
        state: data?.address?.state,
      },
      file:null
    }))
    // setting name in authUser too

     setAuthUser(prev => ({
    ...prev,
    userDetails:{
      ...prev?.userDetails,
      name: data?.fullName || '',
    }
  }))

    successNotification({message: res?.message || ''})
    setLoadingForSave(false)
  };

  useEffect(()=>{
    
    // fetching the user' profile updated one normally
    
    const fetchUserProfile = async() =>{
      setLoading(true);
      const response = await getUserProfile();
      if(!response){
        setLoading(false);
        return;
      }

      const data = response?.data || {};

      setUserProfile(prev => ({
        ...prev,
        address:{
          ...prev.address,
          area: data?.address?.area,
          city: data?.address?.city,
          houseNo: data?.address?.houseNo,
          locality: data?.address?.locality,
          pinCode: data?.address?.pinCode,
          state: data?.address?.state,
        },
        file:null,
        fullName: data?.fullName,
        gender: data?.gender,
        phoneNo: data?.phoneNo,
        profileImageData:{
          ...prev.profileImageData,
          publicId: data?.profileImageData?.publicId,
          url: data?.profileImageData?.url
        },
      }))
      
      setLoading(false)
    }

    if(authUser?.token  && authUser?.token !== '' && authUser?.role == 'user'){
       fetchUserProfile();
    }
   
  },[])

  return (

    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
  {loading || loadingForSave? (
    <Loader texts={ loadingForSave ? ['saving profile...', 'please wait...'] :['Fetching User Profile...', "Loading..."]} />
  ) : (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        User Profile
      </h2>

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center mb-8">
        {(userProfile?.profileImageData?.url?.length > 0 || userProfile?.file !== null) ? (
          <div className="flex flex-col items-center">
            <img
            onClick={()=>{
              setActiveImageSrc(
                 userProfile?.file !== null
                  ? URL.createObjectURL(userProfile?.file)
                  : userProfile?.profileImageData?.url
              )
              setOpenImagePopup(true)
            }}
              src={
                userProfile?.file !== null
                  ? URL.createObjectURL(userProfile?.file)
                  : userProfile?.profileImageData?.url
              }
              alt="preview"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover cursor-pointer"
            />
            <button
              type="button"
              onClick={clearImage}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImageData}
          className="mt-3"
        />
      </div>

      {/* Profile Info */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={userProfile.fullName}
              onChange={handleChangeProfileName}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={userProfile.phoneNo}
              onChange={handleChangePhoneNo}
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Gender</label>

            <SelectBox
            value={userProfile.gender}
            onChange={handleChangeGender}
            options={['Male', 'Female']}
            />
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">House No</label>
            <input
              type="text"
              name="houseNo"
              value={userProfile.address.houseNo}
              onChange={handleAddressChange}
              placeholder="House No"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Locality</label>
            <input
              type="text"
              name="locality"
              value={userProfile.address.locality}
              onChange={handleAddressChange}
              placeholder="Locality"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Area</label>
            <input
              type="text"
              name="area"
              value={userProfile.address.area}
              onChange={handleAddressChange}
              placeholder="Area"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">City</label>
           <SelectBox 
            value={userProfile.address.city}
            onChange={handleChangeUserCity}
            options={statesAndCities[userProfile?.address?.state] || []}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">State</label>
            <SelectBox 
            value={userProfile.address.state}
            onChange={handleChangeUserState}
            options={[...Object.keys(statesAndCities)]}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={userProfile.address.pinCode}
              onChange={handleAddressChange}
              placeholder="Pin Code"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6">
        <button
          type="submit"
          className={`px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center justify-center ${
            loadingForSave ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {loadingForSave ? <CircularProgress size={20} color="white" /> : "Save"}
        </button>

      </div>
    </form>
  )}
  <ImagePopup
  open={openImagePopup}
  onClose={()=>{setOpenImagePopup(false)}}
  src={activeImageSrc}
  />
</div>

  );
};

export default UserProfileForm;
