import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Box,
  Typography,
  Card,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Checkbox,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SelectBox from "../components/globalComponents/SelectBox";
import { statesAndCities } from "../utils/constants/LocationData";
import { eventTypes } from "../utils/constants/eventContants";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import { getVenues } from "../utils/repository/venue";
import VenueCard from "../components/VenueCard";
import { getUserAddress, getUserProfile } from "../utils/repository/user";
import VenuePopup from "../components/VenuePopup";
import { errorNotification, successNotification } from "../utils/toast";
import { BusinessServices } from "../utils/constants/vendorConstants";
import { getVendors } from "../utils/repository/vendor";
import { MdTune } from "react-icons/md";
// import ImagePopup from "../components/globalComponents/ImagePopup";
import Loader from "../components/globalComponents/Loader";
import { FaEye } from "react-icons/fa";
import SelectedVendorsPopup from "../components/globalComponents/SelectedVendorsPopup";
import { saveEventBookingRequest } from "../utils/repository/event";
import { useNavigate } from "react-router-dom";
import ImagePopup from "../components/globalComponents/ImagePopUp";

const steps = ["Details", "Venue", "Services"];

const PlanEventPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(authUserAtom);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [fetchedVenues, setFetchedVenues] = useState([]);
  const [openVenuePopup, setOpenVenuePopup] = useState(false);
  const [venueOption, setVenueOption] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDialogForFilter, setOpenDialogForFilter] = useState(false);
  const [openDialogForVendor, setOpenDialogForVendor] = useState(false);
  const [openSelectedVendorsPopup, setOpenSelectedVendorsPopup] =
    useState(false);
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    time: "",
    address: {
      houseNo: "",
      locality: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    type: "",
    noOfGuests: null,
    venue: "",
    selectedServices: [],
  });
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState({
    area: "",
  });
  const [uniqueAreas, setUniqueAreas] = useState([]);

  const handleNext = () => {
    if (
      activeStep === 0 &&
      (eventData?.name === "" ||
        eventData?.date === "" ||
        eventData?.time === "" ||
        eventData?.type === "" ||
        eventData?.noOfGuests === "")
    ) {
      errorNotification({ message: "Fill all fields" });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleChange = (e) =>
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  const handleChangeEventType = (e) => {
    const value = e.target.value;
    setEventData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleServiceSelect = (serviceId) => {
    setEventData((prev) => {
      const alreadySelected = prev.selectedServices.includes(serviceId);
      return {
        ...prev,
        selectedServices: alreadySelected
          ? prev.selectedServices.filter((id) => id !== serviceId)
          : [...prev.selectedServices, serviceId],
      };
    });
  };
  const handleChangeAddress = (type, value) => {
    setEventData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [type]: value,
      },
    }));
  };
  const handleSelectVenueForEvent = (venue) => {
    setEventData((prev) => ({
      ...prev,
      venue: venue?.id || "",
    }));
  };
  const handleDeselectVenueForEvent = () => {
    setEventData((prev) => ({
      ...prev,
      venue: "",
    }));
  };
  const handleSelectTypeOfService = (e) => {
    setSelectedService(e?.target?.value);
  };
  const handleChangePage = (e, value) => {
    setPage(value);
  };
  const handleSelectVendor = (_vendor = null) => {
    if (_vendor === null) {
      if (selectedVendor !== null) {
        let temp = [...selectedVendors];
        const doVendorExist = [...selectedVendors].some(
          (vendor) => vendor?.id === selectedVendor?.id
        );
        if (doVendorExist) {
          let temp = [...selectedVendors];
          temp = temp.filter((vendor) => vendor?.id !== selectedVendor?.id);
          setSelectedVendors(temp);
        } else {
          temp = temp.filter(
            (vendor) => vendor?.businessType !== selectedVendor?.businessType
          );
          temp.push(selectedVendor);
          setSelectedVendors(temp);
        }
      }
    } else {
      // for clicking on checkbox
      let isPresent = [...selectedVendors].find((v) => v?.id === _vendor?.id);
      if (isPresent) {
        let temp = [...selectedVendors];
        temp = temp.filter((v) => v?.id !== _vendor?.id);
        setSelectedVendors(temp);
      } else {
        let temp = [...selectedVendors];
        temp = temp.filter(
          (vendor) => vendor?.businessType !== _vendor?.businessType
        );
        temp.push(_vendor);
        setSelectedVendors(temp);
      }
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    const res = await getVendors(
      eventData?.address?.state,
      eventData?.address?.city,
      selectedService
    );
    if (res) {
      const temp = res?.data || [];
      setVendors(temp || []);
      if (temp?.length > 0) {
        const areas = [...new Set(temp.map((vendor) => vendor?.address?.area))];
        setUniqueAreas(areas);
      }
    }
    setLoading(false);
  };
  const handleChangeFilterArea = (e) => {
    setFilter((prev) => ({
      ...prev,
      area: e?.target?.value || "",
    }));
  };
  const handleClearFilter = () => {
    setFilter({
      area: "",
    });
  };

  const fetchVenues = async (state = "", city = "", date = "") => {
    setLoading(true);
    const res = await getVenues({ city: city, state: state, date: date });
    setFetchedVenues(res?.data || []);
    setLoading(false);
  };

  const handleCreateEvent = async () => {
    const res1 = await getUserProfile();
    let userProfile;
    if (res1) {
      userProfile = res1?.data || {};
    }

    // prepare data to send
    let dataToSend = {
      ...eventData,
    };
    if (eventData?.venue !== "") {
      const selectedVenue = fetchedVenues.find(
        (venue) => venue?.id === eventData?.venue
      );
      dataToSend = {
        ...dataToSend,
        venueAddress: selectedVenue?.address || {},
      };
      delete dataToSend?.address;
    } else {
      dataToSend = {
        ...dataToSend,
        venueAddress: dataToSend?.address,
      };
      delete dataToSend.address;
    }
    const selectedServicesData = selectedVendors.map((vendor) => ({
      id: vendor?.id || "",
      instructions: vendor?.instructions || "",
      userAccepted: false,
      vendorAccepted: null,
      amount: "0",
    }));

    dataToSend = {
      ...dataToSend,
      selectedServices: selectedServicesData || [],
      clientName: userProfile?.fullName || "",
      clientPhoneNo: userProfile?.phoneNo || "",
      clientEmail: userProfile?.email || "",
      clientId: userProfile?.id || "",
      eventName: dataToSend?.name,
      eventType: dataToSend?.type || "",
      venue: {
        id: dataToSend?.venue || "",
        isVenueAccepted: null,
      },
    };
    delete dataToSend?.name;
    delete dataToSend?.type;

    const res = await saveEventBookingRequest(dataToSend);
    if (res?.status === 200) {
      successNotification({ message: "Event Booking Successfull" });
      navigate("/booking-requests");
    }
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      setLoading(true);
      const res = await getUserAddress();
      if (res == false) {
        return;
      }

      setEventData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          area: res?.data?.area || "",
          city: res?.data?.city || "",
          houseNo: res?.data?.houseNo || "",
          locality: res?.data?.locality || "",
          pincode: res?.data?.pinCode || "",
          state: res?.data?.state || "",
        },
      }));

      setLoading(false);
    };
    if (activeStep === 1) {
      fetchUserAddress();
      fetchVenues(
        eventData?.address?.state,
        eventData?.address?.city,
        eventData?.date
      );
    }
  }, [activeStep]);

  useEffect(() => {
    if (selectedService !== "") {
      // call for vendors -> selectedService, state, city
      fetchVendors();
      setStartIndex(0);
    }
  }, [selectedService]);

  useEffect(() => {
    fetchVenues(eventData?.address?.state, eventData?.address?.city);
  }, [eventData?.address?.city]);

  useEffect(() => {
    setStartIndex((page - 1) * itemsPerPage);
  }, [page]);

  useEffect(() => {
    if (!user?.userDetails?.id) {
      navigate("/login");
    }
  }, []);

  return (
    <Box className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-4 sm:p-10 mb-10">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-10 sm:mt-0"
      >
        <Typography
          variant="h4"
          className="text-center mb-8 font-extrabold text-blue-800  tracking-wide"
        >
          🎉 Plan Your Event
        </Typography>
      </motion.div>

      <Box className=" w-11/12 bg-white shadow-2xl rounded-2xl p-6 mt-8 sm:p-10">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <span className="text-blue-800 font-semibold">{label}</span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2  gap-6"
            >
              <Box>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Event Name
                </label>
                <TextField
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

              <Box>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Date
                </label>
                <TextField
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  onKeyDown={(e) => e.preventDefault()}
                  fullWidth
                  onClick={(e) => e.target.showPicker?.()}
                />
              </Box>

              <Box>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Time
                </label>
                <TextField
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  onClick={(e) => e.target.showPicker?.()}
                />
              </Box>

              <Box>
                <label className="font-semibold text-gray-700 mb-1 block">
                  Event Type
                </label>
                <SelectBox
                  onChange={handleChangeEventType}
                  value={eventData.type}
                  options={eventTypes}
                />
              </Box>

              <Box>
                <label className="font-semibold text-gray-700 mb-1 block">
                  No. of Guests
                </label>

                <TextField
                  name="guests"
                  type="text"
                  value={eventData.noOfGuests}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // allow only digits
                    value = Number(value);
                    handleChange({ target: { name: "noOfGuests", value } });
                  }}
                  fullWidth
                />
              </Box>
            </motion.div>
          )}

          {activeStep === 1 && // for venue
            (loading ? (
              <Loader texts={["Fetching Venues...", "Please wait..."]} />
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="mt-8 space-y-8"
              >
                {" "}
                <Typography
                  variant="h5"
                  className="font-bold text-blue-700 text-center"
                >
                  {" "}
                  Choose Your Venue{" "}
                </Typography>{" "}
                {/* Option Selector */}{" "}
                <Box className="flex flex-col sm:flex-row gap-4 justify-center ">
                  {" "}
                  {[
                    {
                      key: "manual",
                      label: "Enter Venue Manually",
                      icon: "📍",
                    },
                    { key: "select", label: "Choose from List", icon: "🏛️" },
                  ].map((opt) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      key={opt.key}
                      onClick={() => setVenueOption(opt.key)}
                      className={`cursor-pointer border-2 rounded-xl px-6 py-4 flex items-center justify-center gap-3 text-lg font-medium transition-all ${
                        venueOption === opt.key
                          ? "bg-blue-600 text-white border-blue-700 shadow-lg"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {" "}
                      <span className="text-2xl">{opt.icon}</span> {opt.label}{" "}
                    </motion.div>
                  ))}{" "}
                </Box>{" "}
                {/* Manual Venue Entry */}{" "}
                {venueOption === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto"
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
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
                            value={eventData?.address?.houseNo}
                            onChange={(e) => {
                              handleChangeAddress("houseNo", e.target.value);
                            }}
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
                            value={eventData?.address?.locality}
                            onChange={(e) => {
                              handleChangeAddress("locality", e.target.value);
                            }}
                            placeholder="Locality"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-gray-600 font-medium mb-1">
                            Area
                          </label>
                          <input
                            type="text"
                            name="area"
                            value={eventData?.address?.area}
                            onChange={(e) => {
                              handleChangeAddress("area", e.target.value);
                            }}
                            placeholder="Area"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-gray-600 font-medium mb-1">
                            City
                          </label>
                          <SelectBox
                            value={eventData.address.city}
                            onChange={(e) => {
                              handleChangeAddress("city", e.target.value);
                            }}
                            options={
                              statesAndCities[eventData?.address?.state] || []
                            }
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-gray-600 font-medium mb-1">
                            State
                          </label>
                          <SelectBox
                            value={eventData.address.state}
                            onChange={(e) => {
                              handleChangeAddress("state", e.target.value);
                            }}
                            options={[...Object.keys(statesAndCities)]}
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-gray-600 font-medium mb-1">
                            Pin Code
                          </label>
                          <input
                            type="text"
                            name="pinCode"
                            value={eventData.address.pincode}
                            onChange={(e) => {
                              if (!isNumber(e.target.value)) {
                                return;
                              }
                              handleChangeAddress("pincode", e.target.value);
                            }}
                            placeholder="Pin Code"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}{" "}
                {/* Select from List */}{" "}
                {venueOption === "select" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full mx-auto "
                  >
                    <div className="flex justify-center gap-6 mb-12">
                      <div className="min-w-36 w-36 md:min-w-52 md:w-52 ">
                        <label htmlFor="">Select State</label>
                        <SelectBox
                          onChange={(e) => {
                            handleChangeAddress("state", e.target.value);
                          }}
                          options={Object.keys(statesAndCities || {}) || []}
                          value={eventData?.address?.state || ""}
                        />
                      </div>
                      <div className="min-w-36 w-36 md:min-w-52 md:w-52 ">
                        <label htmlFor="">Select City</label>
                        <SelectBox
                          options={
                            statesAndCities[eventData?.address?.state || ""]
                          }
                          value={eventData?.address?.city || ""}
                          onChange={(e) => {
                            handleChangeAddress("city", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    {fetchedVenues?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full ">
                        {fetchedVenues?.map((venue) => (
                          <VenueCard
                            venue={venue}
                            eventData={eventData}
                            key={venue?.email}
                            onClick={() => {
                              setSelectedVenue(venue);
                              setOpenVenuePopup(true);
                            }}
                            handlerSelectVenue={handleSelectVenueForEvent}
                            handlerDeselectVenue={handleDeselectVenueForEvent}
                          />
                        ))}
                      </div>
                    ) : (
                      <h1 className="text-center font-semibold text-2xl">
                        No Venues Present!
                      </h1>
                    )}
                  </motion.div>
                )}{" "}
              </motion.div>
            ))}
          {activeStep === 2 &&
            (loading ? (
              <Loader texts={["Fetching Vendors...", "Please wait..."]} />
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: "#F9FAFB",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Header & Dropdown */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
                      Explore Services
                    </h2>

                    <div className="flex gap-2 md:gap-5 items-center w-full justify-center">
                      <div className="md:w-2/5 w-10/12 ">
                        <SelectBox
                          value={selectedService}
                          options={BusinessServices.map(
                            (obj) => Object.keys(obj)[0]
                          )}
                          onChange={handleSelectTypeOfService}
                          className="w-full sm:w-60"
                        />
                      </div>
                      <MdTune
                        size={32}
                        cursor={"pointer"}
                        onClick={() => {
                          setOpenDialogForFilter((prev) => !prev);
                        }}
                      />
                    </div>
                  </div>

                  {/* Vendor Cards */}
                  <div className="grid grid-cols-1 max-h-screen overflow-y-auto md:h-auto first-letter: sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(vendors ?? [])?.length > 0 &&
                      [...vendors]
                        .filter((vendor) =>
                          filter?.area !== ""
                            ? filter?.area === vendor?.address?.area
                            : true
                        )
                        .slice(startIndex, startIndex + itemsPerPage)
                        .map((vendor) => (
                          <Card
                            key={vendor?.id}
                            className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                          >
                            {/* Top Image */}
                            <div className="w-full flex justify-center items-center mt-4 ">
                              <img
                                src={vendor?.profileImageData?.url}
                                alt={vendor?.fullName}
                                className="w-36 h-36 rounded-full object-cover"
                              />
                              {/* <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                {vendor?.businessType}
                              </span> */}
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                  {vendor?.fullName}
                                </h3>
                              </div>

                              <p className="text-sm text-gray-600 truncate">
                                📞 {vendor?.phoneNo}
                              </p>

                              <p className="text-sm text-gray-600 line-clamp-1">
                                📍 {vendor?.address?.area},{" "}
                                {vendor?.address?.city}
                              </p>

                              {/* Services */}
                              {vendor?.services?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {vendor?.services
                                    .slice(0, 2)
                                    .map((service, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                                      >
                                        {service}
                                      </span>
                                    ))}
                                  {vendor?.services?.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{vendor.services.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setSelectedVendor(vendor || {});
                                  setOpenDialogForVendor(true);
                                }}
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  borderColor: "#3B82F6",
                                  color: "#3B82F6",
                                  "&:hover": { backgroundColor: "#EFF6FF" },
                                }}
                              >
                                View Details
                              </Button>
                              <Checkbox
                                size="medium"
                                checked={selectedVendors.some(
                                  (_vendor) => _vendor?.id === vendor?.id
                                )}
                                onClick={() => {
                                  handleSelectVendor(vendor);
                                }}
                              />
                            </div>
                          </Card>
                        ))}
                    {selectedService?.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full">
                        Select a service to view available vendors.
                      </p>
                    )}

                    {selectedService?.length > 0 && vendors?.length === 0 && (
                      <p className="text-xl md:text-2xl font-semibold mt-8 text-center col-span-full">
                        No Available Vendors
                      </p>
                    )}
                  </div>

                  {/* Pagination */}
                  <Box className="flex justify-center mt-6">
                    <Pagination
                      count={Math.ceil(vendors?.length / itemsPerPage)}
                      page={page}
                      onChange={handleChangePage}
                      color="primary"
                      shape="rounded"
                      sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                    />
                  </Box>
                </Box>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Buttons */}
        <Box className="flex justify-between mt-10  sm:flex-row">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-all w-auto"
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            {activeStep === steps?.length - 1 &&
              selectedVendors?.length > 0 && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenSelectedVendorsPopup(true);
                  }}
                  className="bg-blue-700 hover:bg-blue-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <h2>Vendors</h2>
                  </div>
                </Button>
              )}

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                className="bg-blue-700 hover:bg-blue-800 transition-all"
                onClick={handleCreateEvent}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                className="bg-blue-700 hover:bg-blue-800 transition-all"
              >
                Next
              </Button>
            )}
          </div>
        </Box>
      </Box>
      <VenuePopup
        venue={selectedVenue}
        open={openVenuePopup}
        handleClose={() => {
          setSelectedVenue(null);
          setOpenVenuePopup(false);
        }}
        handlerSelectVenue={handleSelectVenueForEvent}
        key={selectedVenue?.venueName || ""}
        eventData={eventData}
        handlerDeselectVenue={handleDeselectVenueForEvent}
      />

      {/* Filter Dialog */}
      <Dialog
        open={openDialogForFilter}
        onClose={() => setOpenDialogForFilter(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle
          sx={{ display: "flex", alignSelf: "center", fontWeight: 500 }}
        >
          Filter
        </DialogTitle>

        <DialogContent dividers className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Select Area</label>
            <SelectBox
              options={uniqueAreas || []}
              value={filter?.area || ""}
              onChange={handleChangeFilterArea}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClearFilter}
            variant="contained"
            color="primary"
          >
            Clear
          </Button>
          <Button
            onClick={() => setOpenDialogForFilter(false)}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vendor Dialog */}
      <Dialog
        open={openDialogForVendor}
        onClose={() => {
          setOpenDialogForVendor(false);
          setSelectedVendor(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 6,
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            backgroundColor: "#3B82F6",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            py: 2,
          }}
        >
          Vendor Details
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            py: 3,
          }}
        >
          {/* Profile Image */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={selectedVendor?.profileImageData?.url || null}
              alt={selectedVendor?.fullName || ""}
              className="rounded-xl shadow-md"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
          </Box>

          {/* Name + Type */}
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
            align="center"
          >
            {selectedVendor?.fullName || "-"}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            {selectedVendor?.businessType || "-"}
          </Typography>

          <Divider />

          {/* Info Section */}
          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography variant="body2">
              <strong>Phone:</strong> {selectedVendor?.phoneNo || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Gender:</strong> {selectedVendor?.gender || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong>{" "}
              {`${selectedVendor?.address?.houseNo || ""}, ${
                selectedVendor?.address?.locality || ""
              }, ${selectedVendor?.address?.area || ""}, ${
                selectedVendor?.address?.city || ""
              }, ${selectedVendor?.address?.state || ""} - ${
                selectedVendor?.address?.pinCode || ""
              }`}
            </Typography>
            <Typography variant="body2">
              <strong>Services:</strong>{" "}
              {selectedVendor?.services?.length
                ? // selectedVendor.services.join(", ")
                <div className="flex align-middle gap-2">  
                {(selectedVendor?.services || [])?.map((srv,idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                    >
                      {srv}
                    </span>
                  ))}
                  </div>
                : "No services listed"}
            </Typography>
          </Box>

          {/* Sample Work */}
          {selectedVendor?.sampleWorkData?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Sample Work
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedVendor.sampleWorkData.map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.url || null}
                    alt="sample"
                    className="rounded-lg shadow-sm cursor-pointer"
                    style={{ width: "30%", height: 80, objectFit: "cover" }}
                    onClick={() => {
                      setSelectedImageSrc(img?.url || "");
                      setOpenImagePopup(true);
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "center", p: 2, background: "#F9FAFB" }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setOpenDialogForVendor(false);
              setSelectedVendor(null);
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSelectVendor();
              setOpenDialogForVendor(false);
              setSelectedVendor(null);
            }}
          >
            {selectedVendors.some(
              (_vendor) => _vendor?.id === selectedVendor?.id
            )
              ? "UnSelect"
              : "Select"}
          </Button>
        </DialogActions>
      </Dialog>

      <ImagePopup
        open={openImagePopup}
        onClose={() => {
          setOpenImagePopup(false);
          setSelectedImageSrc(null);
        }}
        src={selectedImageSrc || null}
        alt="Image"
      />

      <SelectedVendorsPopup
        key={JSON.stringify(selectedVendors)}
        open={openSelectedVendorsPopup}
        onClose={() => {
          setOpenSelectedVendorsPopup(false);
        }}
        selectedVendors={selectedVendors || []}
        setSelectedVendors={setSelectedVendors}
      />
    </Box>
  );
};

export default PlanEventPage;
