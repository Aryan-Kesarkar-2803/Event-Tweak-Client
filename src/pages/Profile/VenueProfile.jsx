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
import { BusinessServices, listOfAmenitis, venueServices } from "../../utils/constants/vendorConstants";
import ImageUpload from "../../components/globalComponents/MultiImageUpload";
import { getVendorProfile, updateVendorProfile } from "../../utils/repository/vendor";
import { deleteImagesFromCloud } from "../../utils/repository/other";
import { statesAndCities } from "../../utils/constants/LocationData";
import ImagePopup from "../../components/globalComponents/ImagePopup";
import { authUserAtom } from "../../store/other";
import { getVenueProfile, updateVenueProfile } from "../../utils/repository/venue";

const VenueProfile = () => {
  const [user, setUser] = useAtom(userAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom)
  const [loading, setLoading] = useState(false);
  const [loadingForSave, setLoadingForSave] = useState(false);
  const [services, setServices] = useState([])
  const [resetFiles, setResetFiles] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [openImagePopup, setOpenImagePopup] = useState(false)
  const [activeImageSrc, setActiveImageSrc] = useState('')
  const [venueProfile, setVenueProfile] = useState({
        coordinatorName: "",
        phoneNo: "",
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
        guestCapacity: '',
        amenities:[],
        venueName:"",
        services:[],
        chargesPerDay:"",
        sampleWorkFiles :[],
        sampleWorkData:[]
  });


  const handleAddressChange = (e) => {
    if (e.target.name == "pinCode") {
      const value = e.target.value;
      if (!isNumber(value)) return;
    }
    setVenueProfile({
      ...venueProfile,
      address: { ...venueProfile.address, [e.target.name]: e.target.value },
    });
  };


  const handleImagesChange = (images) =>{
    setVenueProfile(prev => ({
      ...prev,
      sampleWorkFiles:images
    }))
  }

  const clearImage = () => {
    if (venueProfile?.file !== null) {
      setVenueProfile((prev) => ({
        ...prev,
        file: null,
      }));
    } else {
      setVenueProfile((prev) => ({
        ...prev,
        profileImageData: {
          ...prev.profileImageData,
          url: "",
        },
      }));
    }
  };
  const handleChangeProfileName = (e) => {
    setVenueProfile((prev) => ({
      ...prev,
      coordinatorName: e.target.value,
    }));
  };
  const handleChangePhoneNo = (e) => {
    const value = e.target.value;
    if (isNumber(value) && value?.length <= 10) {
      setVenueProfile((prev) => ({
        ...prev,
        phoneNo: value,
      }));
    }
  };
   const handleChangeGuestCapacity = (e) => {
  const value = e.target.value;
  if (isNumber(value)) {
    if(Number(value) > 100001) return;

      setVenueProfile((prev) => ({
        ...prev,
        guestCapacity: value ,
      }));
    }
};
     const handleChangeChargesPerDay = (e) => {
  const value = e.target.value;
  if (isNumber(value)) {
    if(Number(value) > 50000000) return;
      setVenueProfile((prev) => ({
        ...prev,
        chargesPerDay: value.trim() || '',
      }));
    }
};

  const handleChangeState = (e) =>{
    const value = e?.target?.value;
    setVenueProfile(prev => ({
      ...prev,
      address:{
        ...prev?.address,
        state:value || ''
      }
    }))
  }
  const handleChangeAmenities = (e) =>{
    setVenueProfile(prev => ({
      ...prev,
      amenities: e?.target?.value || []
    }))
  }
  const handleChangeVenueName = (e) =>{
    setVenueProfile(prev => ({
      ...prev,
      venueName: e?.target?.value || ""
    }))
  }

   const handleChangeCity = (e) =>{
    const value = e?.target?.value;
    setVenueProfile(prev => ({
      ...prev,
      address:{
        ...prev?.address,
        city:value || ''
      }
    }))
  }

  const handleChangeServices = (e) =>{
    const value = e.target.value;
    setVenueProfile(prev => ({
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
    setVenueProfile((prev) => ({
      ...prev,
      file: file,
    }));
  };
  const removeImage = (index) => {
    // setImages(images.filter((_, i) => i !== index));
    setImagesToDelete(prev => [...prev, venueProfile?.sampleWorkData?.[index]?.publicId])
    let temp = venueProfile?.sampleWorkData || [];
    temp = temp.filter((_, _index) => _index != index);

    setVenueProfile(prev => ({
      ...prev,
      sampleWorkData:temp 
    }))
  };

  const handleSubmit = async (e) => {
    setLoadingForSave(true);
    e.preventDefault();

    if(
      venueProfile?.coordinatorName === "" ||
      venueProfile?.phoneNo === "" ||
      venueProfile?.address?.area  === "" ||
      venueProfile?.address?.locality === "" ||
      venueProfile?.address?.area === "" ||
      venueProfile?.address?.state === "" ||
      venueProfile?.address?.city === "" ||
      venueProfile?.address?.pinCode === "" ||
      venueProfile?.services?.length === 0 ||
      venueProfile?.venueName === ""||
      venueProfile?.amenities?.length === 0 ||
      venueProfile?.guestCapacity === "" ||
      venueProfile?.chargesPerDay === ""
    ){
      errorNotification({message:"Please fill all fields."});
      setLoadingForSave(false);
      return;
    }

    if (
      venueProfile?.phoneNo !== "" &&
      venueProfile?.phoneNo?.length !== 10
    ) {
      errorNotification({ message: "please enter valid phone no" });
      setLoadingForSave(false);
      return;
    }

    let formData = new FormData();
    if (venueProfile?.file !== null) {
      formData.append("photoFile", venueProfile?.file || null);
    }

     if(venueProfile?.sampleWorkFiles?.length > 0) {
          venueProfile?.sampleWorkFiles?.forEach(file => {
          formData.append("sampleWorkFiles", file || {});
          })
    }


    let objToSend = {
        coordinatorName: venueProfile?.coordinatorName,
        phoneNo: venueProfile.phoneNo,
        address: venueProfile.address,
        profileImageData: venueProfile.profileImageData,
        services: venueProfile?.services,
        sampleWorkData: venueProfile?.sampleWorkData,
        venueName: venueProfile?.venueName || "",
        chargesPerDay: venueProfile?.chargesPerDay || "",
        guestCapacity: venueProfile?.guestCapacity || "",
        amenities: venueProfile?.amenities || [],
      }


    formData.append(
      "venueProfile",
      JSON.stringify(objToSend)
    );



    // sent request to delete the sample work too

    if(imagesToDelete?.length > 0){
      await deleteImagesFromCloud(imagesToDelete);
      setImagesToDelete([])
    }
    const res = await updateVenueProfile(formData);
    if (!res) {
      setLoadingForSave(false);
      return;
    }

    const data = res?.data || {};
    setVenueProfile((prev) => ({
      ...prev,
      coordinatorName: data?.coordinatorName || "",
      profileImageData: {
        ...prev.profileImageData,
        url: data?.profileImageData?.url || "",
        publicId: data?.profileImageData?.publicId || "",
      },
      phoneNo: data?.phoneNo || '',
      services: data?.services || [],
      sampleWorkData: data?.sampleWorkData || [],
      address: {
        ...prev.address,
        area: data?.address?.area || '',
        city: data?.address?.city || '',
        houseNo: data?.address?.houseNo || '',
        locality: data?.address?.locality || '',
        pinCode: data?.address?.pinCode || '',
        state: data?.address?.state || '',
      },
      file: null,
      sampleWorkFiles:[]
    }));
    setResetFiles(true)

    setTimeout(()=>{              // this helps to selet the images again
      setResetFiles(false);
    },600)
    successNotification({ message: res?.message || "" });
    setLoadingForSave(false);
  };

  useEffect(()=>{
    const fetchVenueProfile = async() =>{
      setLoading(true);
      const response = await getVenueProfile();
      if(!response){
        setLoading(false);
        return;
      }

      const data = response?.data || {};

      setVenueProfile(prev => ({
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
        coordinatorName: data?.coordinatorName || '',
        phoneNo: data?.phoneNo || '',
        profileImageData:{
          ...prev.profileImageData,
          publicId: data?.profileImageData?.publicId || '',
          url: data?.profileImageData?.url || ''
        },
        guestCapacity: data?.guestCapacity || '',
        services: data?.services || [],
        sampleWorkData: data?.sampleWorkData || [],
        amenities: data?.amenities || [],
        chargesPerDay: data?.chargesPerDay || '',
        venueName: data?.venueName || ''
      }))
      setLoading(false)
    }

    if(authUser?.token && authUser?.token !== '' && authUser?.role == 'venue'){
      fetchVenueProfile();
    }
    
  },[])
  // console.log(venueProfile)

 

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      {loading || loadingForSave ? (
        <Loader texts={ loadingForSave ? ["saving your profile...","saving your profile may take some time...",'please wait...']: ["Fetching User Profile...", "Loading..."]} />
      ) : (
        <form
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Venue Profile
          </h2>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            {venueProfile?.profileImageData?.url !== "" ||
            venueProfile?.file !== null ? (
              <div className="flex flex-col items-center">
                <img
                onClick={()=>{
                  setActiveImageSrc(venueProfile?.profileImageData?.url)
                  setOpenImagePopup(true);
                }}
                  src={
                    venueProfile?.file !== null
                      ? URL.createObjectURL(venueProfile?.file)
                      : venueProfile?.profileImageData?.url
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
              Coordinator Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Coordinator Name
                </label>
                <input
                  type="text"
                  name="coordinatorName"
                  value={venueProfile.coordinatorName}
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
                  value={venueProfile.phoneNo}
                  onChange={handleChangePhoneNo}
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  value={venueProfile.address.houseNo}
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
                  value={venueProfile.address.locality}
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
                  value={venueProfile.address.area}
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
                value={venueProfile?.address?.state || ''}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">City</label>
                <SelectBox
                options={(statesAndCities || {})[(venueProfile?.address?.state || '')] || []}
                value={venueProfile?.address?.city || ''}
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
                  value={venueProfile.address.pinCode}
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
              Venue Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Services
                </label>
                <SelectBox
                multiple={true}
                value={venueProfile.services}
                onChange={(e)=>{handleChangeServices(e)}}
                options={venueServices}
                />
              </div>

             
                
                <div className="flex flex-col">
               <label className="text-gray-600 font-medium mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venue_name"
                  value={venueProfile.venueName}
                  onChange={handleChangeVenueName}
                  placeholder="Venue Name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                </div>
               
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Amenities
                </label>
                <SelectBox options={listOfAmenitis} multiple={true} value={venueProfile?.amenities} onChange={handleChangeAmenities}/>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Guest Capacity
                </label>
                <input
                  type="text"
                  name="guestCapacity"
                  value={venueProfile.guestCapacity}
                  onChange={handleChangeGuestCapacity}
                  placeholder="Guest Capacity"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">
                  Rent Per Day (INR)
                </label>
                <input
                  type="text"
                  name="perDayCharges"
                  value={venueProfile.chargesPerDay}
                  onChange={handleChangeChargesPerDay}
                  placeholder="Per Day Charge"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              
            </div>
          </div>

          {/* Sample Work */}
           <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b-4 border-stone-500 ">
                Venue Images 
            </h3>
            <div className="grid grid-rows-1 gap-6">
               <div className="flex flex-col">
                <label className="text-gray-600 font-medium text-sm mb-1">
                   * Upload venue images (max 5 & each less than 2mb)":
                </label>
               <ImageUpload reset={resetFiles} disabled={venueProfile?.sampleWorkData?.length == 5} allowMultiple={true} maxImages={5-venueProfile?.sampleWorkData?.length || 0} onChange={handleImagesChange} />
              </div>
              {
                venueProfile?.sampleWorkData?.length > 0 && 
                <label className="text-gray-600 font-medium text-sm mb-1">
                  * You can upload at max 5 images. Remove existing to add new
                </label>
              }
                
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              {venueProfile?.sampleWorkData.map((imageData, idx) => (
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
              // onClick={(e)=>{console.log(venueProfile)}}
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

            {/* <button
              type="button"
              onClick={() =>
                setVenueProfile({
                  coordinatorName: "",
                  phoneNo: "",
                  file:null,
                  services:[],
                  profileImageData:{},
                  sampleWorkFiles:[],
                  sampleWorkData:[],
                  address: {
                    houseNo: "",
                    locality: "",
                    area: "",
                    city: "",
                    state: "",
                    pinCode: "",
                  },
                })
              }
              disabled={loadingForSave}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear
            </button> */}
          </div>
        </form>
      )}

      <ImagePopup open={openImagePopup} onClose={()=>{setOpenImagePopup(false)}} src={activeImageSrc}/>
    </div>
  );
};

export default VenueProfile;
