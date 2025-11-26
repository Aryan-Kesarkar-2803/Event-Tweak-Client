import React, { useEffect, useState } from "react";
import {
  successNotification,
  errorNotification,
} from "../../utils/toast";
import { isNumber } from "../../utils/others";
import { useAtom } from "jotai";
import { userAtom } from "../../store/user";
import Loader from "../../components/globalComponents/Loader";
import { CircularProgress } from "@mui/material";
import SelectBox from "../../components/globalComponents/SelectBox";
import { BusinessServices, listOfAmenitis } from "../../utils/constants/vendorConstants";
import ImageUpload from "../../components/globalComponents/MultiImageUpload";
import { getVendorProfile, updateVendorProfile } from "../../utils/repository/vendor";
import { deleteImagesFromCloud } from "../../utils/repository/other";
import { statesAndCities } from "../../utils/constants/LocationData";
import ImagePopup from "../../components/globalComponents/ImagePopup";
import { authUserAtom } from "../../store/other";

const VendorProfile = () => {
  const [user, setUser] = useAtom(userAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom)
  const [loading, setLoading] = useState(false);
  const [loadingForSave, setLoadingForSave] = useState(false);
  const [services, setServices] = useState([])
  const [resetFiles, setResetFiles] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [openImagePopup, setOpenImagePopup] = useState(false)
  const [activeImageSrc, setActiveImageSrc] = useState('')
  const [vendorProfile, setVendorProfile] = useState({
        fullName: "",
        phoneNo: "",
        gender: "",
        profileImageData: {
          url: "",
          publicId: "",
        },
        file: null,
        address: {
          houseNo: "",
          locality: "",
          area: "",
          city: "",
          state: "",
          pinCode: "",
        },
        businessType:"",
        services:[],
        sampleWorkFiles :[],
        sampleWorkData:[]

  });

  // when images are removed from frontend send a request to backend to delete them from cloud

  const handleAddressChange = (e) => {
    if (e.target.name == "pinCode") {
      const value = e.target.value;
      if (!isNumber(value)) return;
    }
    setVendorProfile({
      ...vendorProfile,
      address: { ...vendorProfile.address, [e.target.name]: e.target.value },
    });
  };


  const handleImagesChange = (images) =>{
    setVendorProfile(prev => ({
      ...prev,
      sampleWorkFiles:images
    }))
  }

  const clearImage = () => {
    if (vendorProfile?.file !== null) {
      setVendorProfile((prev) => ({
        ...prev,
        file: null,
      }));
    } else {
      setVendorProfile((prev) => ({
        ...prev,
        profileImageData: {
          ...prev.profileImageData,
          url: "",
        },
      }));
    }
  };
  const handleChangeProfileName = (e) => {
    setVendorProfile((prev) => ({
      ...prev,
      fullName: e.target.value,
    }));
  };
  const handleChangePhoneNo = (e) => {
    const value = e.target.value;
    if (isNumber(value) && value?.length <= 10) {
      setVendorProfile((prev) => ({
        ...prev,
        phoneNo: value,
      }));
    }
  };

  const handleChangeGender = (e) =>{
    const value = e.target.value;
    setVendorProfile(prev =>({
      ...prev,
      gender: value
    }))
  }
  const handleChangeState = (e) =>{
    const value = e?.target?.value;
    setVendorProfile(prev => ({
      ...prev,
      address:{
        ...prev?.address,
        state:value || ''
      }
    }))
  }
  const handleChangeCity = (e) =>{
    const value = e?.target?.value;
    setVendorProfile(prev => ({
      ...prev,
      address:{
        ...prev?.address,
        city:value || ''
      }
    }))
  }
  const handleChangeBusinessType  = (e) =>{
    const value = e.target.value;
    setVendorProfile(prev => ({
      ...prev,
      businessType: value,
      services:[]
    }))
  }
  const handleChangeServices = (e) =>{
    const value = e.target.value;
    setVendorProfile(prev => ({
      ...prev,
      services: value || [],
    }))
  }
  const handleChangeImageData = (e) => {
    const file = e.target.files[0];
    if (file?.size > 2 * 1024 * 1024) {
      errorNotification({ message: "file size must be less than 2 mb" });
      return;
    }
    setVendorProfile((prev) => ({
      ...prev,
      file: file,
    }));
  };
  const removeImage = (index) => {
    // setImages(images.filter((_, i) => i !== index));
    setImagesToDelete(prev => [...prev, vendorProfile?.sampleWorkData?.[index]?.publicId])
    let temp = vendorProfile?.sampleWorkData || [];
    temp = temp.filter((_, _index) => _index != index);

    setVendorProfile(prev => ({
      ...prev,
      sampleWorkData:temp 
    }))
  };

  const handleSubmit = async (e) => {
    setLoadingForSave(true);
    e.preventDefault();

    if(
      vendorProfile?.fullName === "" ||
      vendorProfile?.phoneNo === "" ||
      vendorProfile?.gender === "" ||
      vendorProfile?.address?.area  === "" ||
      vendorProfile?.address?.locality === "" ||
      vendorProfile?.address?.area === "" ||
      vendorProfile?.address?.state === "" ||
      vendorProfile?.address?.city === "" ||
      vendorProfile?.address?.pinCode === "" ||
      vendorProfile?.businessType === "" ||
      vendorProfile?.services?.length === 0
    ){
      errorNotification({message:"Please fill all fields."});
      setLoadingForSave(false);
      return;
    }
    
    if (
      vendorProfile?.phoneNo !== "" &&
      vendorProfile?.phoneNo?.length !== 10
    ) {
      errorNotification({ message: "please enter valid phone no" });
      setLoadingForSave(false);
      return;
    }

    let formData = new FormData();
    if (vendorProfile?.file !== null) {
      formData.append("photoFile", vendorProfile?.file || null);
    }

     if(vendorProfile?.sampleWorkFiles?.length > 0) {
          vendorProfile?.sampleWorkFiles?.forEach(file => {
          formData.append("sampleWorkFiles", file || {});
          })
    }


    let objToSend = {
        fullName: vendorProfile?.fullName,
        gender: vendorProfile.gender,
        phoneNo: vendorProfile.phoneNo,
        address: vendorProfile.address,
        profileImageData: vendorProfile.profileImageData,
        businessType: vendorProfile?.businessType,
        services: vendorProfile?.services,
        sampleWorkData: vendorProfile?.sampleWorkData,
      }

    formData.append(
      "vendorProfile",
      JSON.stringify(objToSend)
    );



    // sent request to delete the sample work too

    if(imagesToDelete?.length > 0){
      await deleteImagesFromCloud(imagesToDelete);
      setImagesToDelete([])
    }
    const res = await updateVendorProfile(formData);
    if (!res) {
      setLoadingForSave(false);
      return;
    }

    const data = res?.data || {};
    setVendorProfile((prev) => ({
      ...prev,
      fullName: data?.fullName || "",
      gender: data?.gender || "",
      profileImageData: {
        ...prev.profileImageData,
        url: data?.profileImageData?.url || "",
        publicId: data?.profileImageData?.publicId || "",
      },
      phoneNo: data?.phoneNo,
      businessType: data?.businessType,
      services: data?.services || [],
      sampleWorkData: data?.sampleWorkData || [],
      address: {
        ...prev.address,
        area: data?.address?.area,
        city: data?.address?.city,
        houseNo: data?.address?.houseNo,
        locality: data?.address?.locality,
        pinCode: data?.address?.pinCode,
        state: data?.address?.state,
      },
      file: null,
      sampleWorkFiles:[]
    }));

    setAuthUser(prev => ({
      ...prev,
      userDetails:{
        ...prev?.userDetails,
        name: data?.fullName || '',
      }
    }))

    setResetFiles(true)

    setTimeout(()=>{              // this helps to selet the images again
      setResetFiles(false);
    },600)
    successNotification({ message: res?.message || "" });
    setLoadingForSave(false);
  };

  useEffect(()=>{
    const fetchVendorProfile = async() =>{
      setLoading(true);
      const response = await getVendorProfile();
      if(!response){
        setLoading(false);
        return;
      }

      const data = response?.data || {};

      setVendorProfile(prev => ({
        ...prev,
        address:{
          ...prev.address,
          area: data?.address?.area || '',
          city: data?.address?.city || '',
          houseNo: data?.address?.houseNo || '',
          locality: data?.address?.locality || '',
          pinCode: data?.address?.pinCode || '',
          state: data?.address?.state || '',
        },
        file:null,
        fullName: data?.fullName || '',
        gender: data?.gender || '',
        phoneNo: data?.phoneNo || '',
        profileImageData:{
          ...prev.profileImageData,
          publicId: data?.profileImageData?.publicId || '',
          url: data?.profileImageData?.url || ''
        },
        businessType: data?.businessType || '',
        services: data?.services || [],
        sampleWorkData: data?.sampleWorkData || [],
      }))
      setLoading(false)
    }

    if(authUser?.token && authUser?.token !== '' && authUser?.role == 'vendor'){
      fetchVendorProfile();
    }
    
  },[])

  useEffect(()=>{
    let temp =   BusinessServices.find(item => Object.keys(item)[0] === vendorProfile?.businessType || '')?.[vendorProfile?.businessType || '']
    setServices(temp);
  },[vendorProfile?.businessType])

 

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      {loading || loadingForSave ? (
        <Loader texts={ loadingForSave ? ["saving your profile...","saving your profile may take some time...",'please wait...']: ["Fetching User Profile...", "Loading..."]} />
      ) : (
        <form
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Vendor Profile
          </h2>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            {vendorProfile?.profileImageData?.url !== "" ||
            vendorProfile?.file !== null ? (
              <div className="flex flex-col items-center">
                <img
                onClick={()=>{
                  setActiveImageSrc(vendorProfile?.profileImageData?.url)
                  setOpenImagePopup(true);
                }}
                  src={
                    vendorProfile?.file !== null
                      ? URL.createObjectURL(vendorProfile?.file)
                      : vendorProfile?.profileImageData?.url
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
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b-4 border-stone-500 ">
              Profile Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={vendorProfile.fullName}
                  onChange={handleChangeProfileName}
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNo"
                  value={vendorProfile.phoneNo}
                  onChange={handleChangePhoneNo}
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">Gender</label>

                <SelectBox
                onChange={handleChangeGender}
                value={vendorProfile?.gender}
                options={["Male","Female"]}
                />
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b-4 border-stone-500 ">
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  House No
                </label>
                <input
                  type="text"
                  name="houseNo"
                  value={vendorProfile.address.houseNo}
                  onChange={handleAddressChange}
                  placeholder="House No"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Locality
                </label>
                <input
                  type="text"
                  name="locality"
                  value={vendorProfile.address.locality}
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
                  value={vendorProfile.address.area}
                  onChange={handleAddressChange}
                  placeholder="Area"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">State</label>
                <SelectBox 
                options={[...Object.keys(statesAndCities || {})]}
                onChange={handleChangeState}
                value={vendorProfile?.address?.state || ''}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">City</label>
                <SelectBox
                options={(statesAndCities || {})[(vendorProfile?.address?.state || '')] || []}
                value={vendorProfile?.address?.city || ''}
                onChange={handleChangeCity}
                />
              </div>


              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={vendorProfile.address.pinCode}
                  onChange={handleAddressChange}
                  placeholder="Pin Code"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b-4 border-stone-500 ">
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Business Type
                </label>
                <SelectBox
                value={vendorProfile.businessType}
                onChange={(e)=>{handleChangeBusinessType(e)}}
                options={
                  BusinessServices.map(obj => Object.keys(obj)[0])
                }
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Services
                </label>
                <SelectBox
                multiple={true}
                value={vendorProfile.services}
                onChange={(e)=>{handleChangeServices(e)}}
                options={services}
                />
              </div>

              
            </div>
          </div>

          {/* Sample Work */}
           <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b-4 border-stone-500 ">
                 Sample Work
            </h3>
            <div className="grid grid-rows-1 gap-6">
               <div className="flex flex-col">
                <label className="text-gray-600 font-medium text-sm mb-1">
                      * Upload sample work images (max 5 & each less than 2mb)
                </label>
               <ImageUpload reset={resetFiles} disabled={vendorProfile?.sampleWorkData?.length == 5} allowMultiple={true} maxImages={5-vendorProfile?.sampleWorkData?.length || 0} onChange={handleImagesChange} />
              </div>
              {
                vendorProfile?.sampleWorkData?.length > 0 && 
                <label className="text-gray-600 font-medium text-sm mb-1">
                  * You can upload at max 5 images. Remove existing to add new
                </label>
              }
                
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {vendorProfile?.sampleWorkData.map((imageData, idx) => (
              <div
                key={idx}
                className="relative w-full h-40 overflow-hidden rounded-xl shadow-md bg-gray-100 flex items-center justify-center"
              >
                <img
                  onClick={()=>{
                    setActiveImageSrc(imageData?.url)
                    setOpenImagePopup(true)
                  }}
                  src={imageData?.url}
                  alt={`img-${idx}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                <button
                type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6">
            <button
            type="button"
              onClick={handleSubmit}
              // onClick={(e)=>{console.log(vendorProfile)}}
              className={`px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center justify-center ${
                loadingForSave ? "pointer-events-none" : "pointer-events-auto"
              }`}
            >
              {loadingForSave ? (
                <CircularProgress size={20} color="white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      )}

      <ImagePopup open={openImagePopup} onClose={()=>{setOpenImagePopup(false)}} src={activeImageSrc}/>
    </div>
  );
};

export default VendorProfile;
