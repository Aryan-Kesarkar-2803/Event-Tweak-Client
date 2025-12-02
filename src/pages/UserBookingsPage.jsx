import React, { useEffect, useState } from "react";
import { cancelEventBooking, getAllEventBookingsForClient } from "../utils/repository/event";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Box,
  Switch,
  TextareaAutosize,
} from "@mui/material";
import { formatDateToDDMMYY, formatTimeTo12Hr } from "../utils/others";
import { getVendorsByIds } from "../utils/repository/vendor";
import { getVenueById, getVenues } from "../utils/repository/venue";
import { IoMdArrowRoundBack } from "react-icons/io";
import { cancelServiceBooking, getAllServiceBookingsForClient } from "../utils/repository/services";
import { successNotification } from "../utils/toast";
import Loader from "../components/globalComponents/Loader";

const UserBookingsPage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [fetchedVendors, setFetchedVendors] = useState([]);
  const [fetchedVendorForService, setFetchedVendorForService] = useState(null);
  const [fetchedVenue, setFetchedVenue] = useState({});
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loadingForButtonIndex, setLoadingForButtonIndex] = useState(null);
  const [loading, setLoading] = useState({
    value:false,
    labels :[],
  });
  const [viewMore, setViewMore] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  const fetchClientEventBookings = async () => {
    setLoading(prev => ({...prev,value:true,labels:["...Fetching Data","...Please wait"]}));
    
    const res = await getAllEventBookingsForClient(user?.userDetails?.id || "");
    if (res) {
      let temp = res?.data || [];
      setData(temp || []);
    }

     setLoading(prev => ({...prev,value:false,labels:[]}));
  };

  const fetchClientServiceBookings = async () => {
    setLoading(prev => ({...prev,value:true,labels:["...Fetching Data","...Please wait"]}));

    const res = await getAllServiceBookingsForClient(
      user?.userDetails?.id || ""
    );
    if (res) {
      let temp = res?.data || [];
      setData1(temp || []);
    }
    setLoading(prev => ({...prev,value:false,labels:[]}));
  };

  const handleSetSelectedEvent = async (event = {}) => {
    const vendorIds = [...event?.services]?.map((srv) => srv?.id);

    const res = await getVendorsByIds({
      vendorIds: vendorIds,
    });

    if (event?.venue && event?.venue?.length > 0) {
      const res2 = await getVenueById(event?.venue || "");
      if (res2) {
        setFetchedVenue(res2?.data || {});
      }
    }

    if (res) {
      setFetchedVendors(res?.data);
    }
    setSelectedEvent(event || {});

    setLoadingForButtonIndex(null);
  };

  const handleSetSelectedService = async (service = {}) => {
   
    const vendorIds = [service?.vendor?.id];

    const res = await getVendorsByIds({
      vendorIds: vendorIds,
    });

    if (res) {
      setSelectedService({ ...service });
      setFetchedVendorForService(res?.data?.[0] || {});
    }

    setLoadingForButtonIndex(null);
  };
  const handleCancelEventBooking = async() =>{
    setLoading(prev => ({...prev,value:true,labels:["...Processing","...Please wait"]}));

    const res = await cancelEventBooking(selectedEvent?.id || '');
    if(res && res?.status == 200){
      successNotification({message: 'Booking cancelled'});
      await fetchClientEventBookings();
      setSelectedEvent(null);
    }

    setLoading(prev => ({...prev,value:false,labels:[]}));
  }
  const handleCancelServiceBooking = async() => {
    setLoading(prev => ({...prev,value:true,labels:["...Processing","...Please wait"]}));

    const res = await cancelServiceBooking(selectedService?.id || '');
    if(res && res?.status == 200){
      successNotification({message: 'Booking cancelled'});
      await fetchClientServiceBookings();
      setSelectedService(null);
    }
    setLoading(prev => ({...prev,value:false,labels:[]}));
  }

  useEffect(() => {
    fetchClientEventBookings();
    fetchClientServiceBookings();
  }, []);

  useEffect(() => {
    if (selectedEvent == null) {
      setFetchedVendors([]);
      setFetchedVenue({});
    }
  }, [selectedEvent]);

  return (
    <>
    {
      loading?.value ?
      <Loader texts={[...loading?.labels]}/>
      :
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-5 px-6">
        <div className="w-full flex flex-col justify-center align-middle ">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 drop-shadow-md">
            My Bookings
          </h1>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              centered
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#6366F1", // indicator color
                  height: "4px",
                  borderRadius: "4px",
                },
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#6b7280",
                  transition: "0.25s",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#1f2937", // selected tab text color
                },
                "& .MuiTab-root:hover": {
                  color: "#374151",
                },
              }}
            >
              <Tab label="Event Bookings" value={1} />
              <Tab label="Service Bookings" value={2} />
            </Tabs>
          </Box>
        </div>
        {/* Event Bookings */}
        {activeTab === 1 ? (
          <>
            {data.length === 0 ? (
              <p className="text-center text-gray-600 text-lg mt-4">
                No Event bookings found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                {(data ?? []).map((event, index) => (
                  <Card
                    key={event?.id}
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    sx={{
                      background: "linear-gradient(145deg, #ffffff, #f9fafb)",
                      borderRadius: "1rem",
                      width: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: { xs: "1rem", sm: "1.25rem" },
                      }}
                    >
                      {/* Event Type */}
                      <Typography
                        variant="subtitle2"
                        className="text-blue-600 font-medium uppercase tracking-wider text-sm sm:text-base"
                      >
                        {event?.eventType}
                      </Typography>

                      {/* Event Name */}
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900 text-lg sm:text-xl leading-snug"
                      >
                        {event?.eventName}
                      </Typography>

                      <Divider className="my-2" />

                      {/* Date */}
                      <Typography className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Date:
                        </span>{" "}
                        {formatDateToDDMMYY(event?.date)}
                      </Typography>

                      {/* Time */}
                      <Typography className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Time:
                        </span>{" "}
                        {formatTimeTo12Hr(event?.time)}
                      </Typography>

                      {/* Guests */}
                      <Typography className="text-sm sm:text-base text-gray-700 mb-2">
                        <span className="font-semibold text-gray-800">
                          Guests:
                        </span>{" "}
                        {event?.noOfGuests}
                      </Typography>

                      {/* Button */}
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          alignSelf: { xs: "stretch", sm: "flex-end" },
                          textTransform: "none",
                          borderRadius: "0.5rem",
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          backgroundColor: "#2563eb",
                          fontWeight: 600,
                          minWidth: "160px",

                          letterSpacing: "0.02em",
                          "&:hover": { backgroundColor: "#1e40af" },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // setSelectedEvent(event);
                          setLoadingForButtonIndex(index)
                          handleSetSelectedEvent(event);
                        }}
                      >
                        {loadingForButtonIndex == index ? (
                          <CircularProgress size={26} color="white" />
                        ) : (
                          "View More Details"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Dialog for full details of Event*/}
            <Dialog
              open={!!selectedEvent}
              onClose={() => setSelectedEvent(null)}
              PaperProps={{
                sx: {
                  borderRadius: "1rem",
                  width: "100%",
                  maxWidth: 550,
                  background: "linear-gradient(145deg, #ffffff, #f9fafb)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              {viewMore === null ? (
                <>
                  <DialogTitle
                    className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2"
                    sx={{ letterSpacing: "-0.01em" }}
                  >
                    {selectedEvent?.eventName}
                  </DialogTitle>

                  <DialogContent dividers sx={{ backgroundColor: "#fdfdfd" }}>
                    <div className="space-y-3 flex flex-col text-gray-700 text-sm sm:text-base leading-relaxed">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Event Type:
                        </span>{" "}
                        {selectedEvent?.eventType}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Date:
                        </span>{" "}
                        {formatDateToDDMMYY(selectedEvent?.date)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Time:
                        </span>{" "}
                        {formatTimeTo12Hr(selectedEvent?.time)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Guests:
                        </span>{" "}
                        {selectedEvent?.noOfGuests}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Venue Address:
                        </span>{" "}
                        {selectedEvent?.address?.houseNo},{" "}
                        {selectedEvent?.address?.locality},{" "}
                        {selectedEvent?.address?.area},{" "}
                        {selectedEvent?.address?.city},{" "}
                        {selectedEvent?.address?.state} -{" "}
                        {selectedEvent?.address?.pinCode}
                      </p>

                      <Divider className="my-3" />
                      {selectedEvent?.venue?.length > 0 && (
                        <>
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex justify-between w-full items-center">
                              <p className="font-semibold text-gray-900">
                                Venue:{" "}
                                <span>{fetchedVenue?.venueName || ""}</span>
                              </p>
                              <Button
                                variant="outlined"
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "0.5rem",
                                  fontSize: { xs: "0.8em", sm: "0.9rem" },
                                }}
                                onClick={(e) => {
                                  setViewMore("venue");
                                }}
                              >
                                View More
                              </Button>
                            </div>
                          </div>
                          <Divider className="my-3" />
                        </>
                      )}

                      <p className="font-semibold text-gray-900">Services:</p>
                      {(selectedEvent?.services || [])?.map((srv, idx) => {
                        const currentVendor =
                          fetchedVendors.find((v) => v?.id === srv?.id) || {};
                        return (
                          <div
                            key={idx}
                            className="flex flex-col gap-6 align-middle border rounded-xl p-3 sm:p-4 mt-2 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div key={idx} className=" flex justify-between">
                              <div>
                                <p className="text-sm sm:text-base">
                                  <span className="font-medium text-gray-800">
                                    Vendor :
                                  </span>{" "}
                                  {currentVendor?.fullName || "-"}
                                </p>
                                <p className="text-sm sm:text-base">
                                  <span className="font-medium text-gray-800">
                                    Bussiness Type :
                                  </span>{" "}
                                  {currentVendor?.businessType || "-"}
                                </p>
                                <p className="text-sm sm:text-base">
                                  <span className="font-medium text-gray-800">
                                    Phone No:
                                  </span>{" "}
                                  {currentVendor?.phoneNo || "-"}
                                </p>
                                <p className="text-sm sm:text-base">
                                  <span className="font-medium text-gray-800">
                                    Quotation Amount:
                                  </span>
                                  {srv?.amount === "0"
                                    ? " - "
                                    : ` ₹ ${srv?.amount || "-"}`}
                                </p>
                              </div>
                            </div>

                            <div className="w-full flex justify-center gap-4">
                              <Button
                                variant="outlined"
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "0.5rem",
                                  fontSize: { xs: "0.8em", sm: "0.9rem" },
                                  alignSelf: "end",
                                }}
                                onClick={(e) => {
                                  setViewMore("vendor");
                                  setSelectedVendor(currentVendor);
                                }}
                              >
                                View More
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>

                  <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCancelEventBooking}
                      sx={{
                        // color: "#ef4444",
                        backgroundColor: "red",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "0.5rem",
                        px: 2,
                      }}
                    >
                      Cancel Booking
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setSelectedEvent(null)}
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "0.5rem",
                        px: 2,
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </>
              ) : (
                <>
                  {viewMore === "vendor" ? (
                    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-5 space-y-6 text-gray-800 relative">
                      {/* Back Arrow */}
                      <button
                        onClick={() => {
                          setViewMore(null);
                        }}
                        className="absolute top-6 left-4 text-gray-700 transition cursor-pointer"
                      >
                        <div className="flex gap-2 items-center">
                          <IoMdArrowRoundBack size={26} />
                          <p className="text-base">Back</p>
                        </div>
                      </button>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 pt-8">
                        <img
                          src={selectedVendor?.profileImageData?.url}
                          alt={selectedVendor?.fullName}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div className="text-center sm:text-left mt-3 sm:mt-0">
                          <h2 className="text-xl font-semibold">
                            {selectedVendor?.fullName}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {selectedVendor?.businessType}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {selectedVendor?.phoneNo}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Address
                        </h3>
                        <p className="text-sm">
                          {selectedVendor?.address?.houseNo},{" "}
                          {selectedVendor?.address?.locality},{" "}
                          {selectedVendor?.address?.area},{" "}
                          {selectedVendor?.address?.city},{" "}
                          {selectedVendor?.address?.state} -{" "}
                          {selectedVendor?.address?.pinCode}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Services
                        </h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {(selectedVendor?.services ?? []).map((srv, i) => (
                            <li key={i}>{srv}</li>
                          ))}
                        </ul>
                      </div>

                      {(selectedVendor?.sampleWorkData ?? []).length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Sample Work
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {(selectedVendor?.sampleWorkData ?? []).map(
                              (work, i) => (
                                <a
                                  href={work?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    key={i}
                                    src={work?.url}
                                    alt={`Sample ${i + 1}`}
                                    className="rounded-lg object-cover w-full h-28 sm:h-32 border hover:scale-105 transition-transform cursor-pointer"
                                  />
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-5 space-y-6 text-gray-800 relative">
                      {/* Back Arrow */}
                      <button
                        onClick={() => {
                          setViewMore(null);
                        }}
                        className="absolute top-6 left-4 text-gray-700 transition cursor-pointer"
                      >
                        <div className="flex gap-2 items-center">
                          <IoMdArrowRoundBack size={26} />
                          <p className="text-base">Back</p>
                        </div>
                      </button>

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 pt-8">
                        <img
                          src={fetchedVenue?.profileImageData?.url || ""}
                          alt={fetchedVenue?.venueName}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div className="text-center sm:text-left mt-3 sm:mt-0">
                          <h2 className="text-xl font-semibold">
                            {fetchedVenue?.venueName}
                          </h2>
                          <p className="text-sm text-gray-600">
                            📧 {fetchedVenue?.email}
                          </p>
                          {fetchedVenue?.phoneNo && (
                            <p className="text-sm text-gray-600">
                              📞 {fetchedVenue?.phoneNo}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            👤 {fetchedVenue?.coordinatorName}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Address
                        </h3>
                        <p className="text-sm">
                          {fetchedVenue?.address?.houseNo},{" "}
                          {fetchedVenue?.address?.locality},{" "}
                          {fetchedVenue?.address?.area},{" "}
                          {fetchedVenue?.address?.city},{" "}
                          {fetchedVenue?.address?.state} -{" "}
                          {fetchedVenue?.address?.pinCode}
                        </p>
                      </div>

                      {/* Services */}
                      {fetchedVenue?.services?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Services
                          </h3>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {fetchedVenue?.services.map((srv, i) => (
                              <li key={i}>{srv}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Amenities */}
                      {fetchedVenue?.amenities?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Amenities
                          </h3>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {fetchedVenue?.amenities.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Charges */}
                      {fetchedVenue?.chargesPerDay && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Charges Per Day
                          </h3>
                          <p className="text-sm font-medium text-indigo-600">
                            ₹ {fetchedVenue?.chargesPerDay}
                          </p>
                        </div>
                      )}

                      {/* Sample Work Gallery */}
                      {fetchedVenue?.sampleWorkData?.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Images
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {fetchedVenue.sampleWorkData.map((img, i) => (
                              <a
                                href={img.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  key={i}
                                  src={img.url}
                                  alt={`Sample ${i + 1}`}
                                  className="rounded-lg object-cover w-full h-28 sm:h-32 border hover:scale-105 transition-transform cursor-pointer"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </Dialog>
          </>
        ) : (
          //  Service Bookings
          <>
            {data1.length === 0 ? (
              <p className="text-center text-gray-600 text-lg mt-4">
                No Service bookings found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
                {(data1 ?? []).map((event, index) => (
                  <Card
                    key={event?.id}
                    className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    sx={{
                      background: "linear-gradient(145deg, #ffffff, #f9fafb)",
                      borderRadius: "1rem",
                      width: "100%",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: { xs: "1rem", sm: "1.25rem" },
                      }}
                    >
                      {/* Event Type */}
                      <Typography
                        variant="subtitle2"
                        className="text-blue-600 font-medium uppercase tracking-wider text-sm sm:text-base"
                      >
                        {event?.vendor?.businessType || ""}
                      </Typography>

                      <Typography className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Vendor:
                        </span>{" "}
                        {event?.vendor?.vendorName || ""}
                      </Typography>

                      <Divider className="my-2" />

                      {/* Date */}
                      <Typography className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Date:
                        </span>{" "}
                        {formatDateToDDMMYY(event?.date)}
                      </Typography>

                      {/* Time */}
                      <Typography className="text-sm sm:text-base text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Time:
                        </span>{" "}
                        {formatTimeTo12Hr(event?.time)}
                      </Typography>

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          alignSelf: { xs: "stretch", sm: "flex-end" },
                          textTransform: "none",
                          borderRadius: "0.5rem",
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          backgroundColor: "#2563eb",
                          fontWeight: 600,
                          minWidth: "160px",

                          letterSpacing: "0.02em",
                          "&:hover": { backgroundColor: "#1e40af" },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLoadingForButtonIndex(index)
                          handleSetSelectedService(event);

                        }}
                      >
                        {loadingForButtonIndex == index ? (
                          <CircularProgress size={26} color="white" />
                        ) : (
                          "View More Details"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Dialog for full details of Event*/}
            <Dialog
              open={!!selectedService}
              onClose={() => setSelectedEvent(null)}
              PaperProps={{
                sx: {
                  borderRadius: "1rem",
                  width: "100%",
                  maxWidth: 550,
                  background: "linear-gradient(145deg, #ffffff, #f9fafb)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
          
               
                  <DialogTitle
                    sx={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: "12px",
                    }}
                  >
                    Service Booking Details
                  </DialogTitle>

                  <DialogContent dividers sx={{ backgroundColor: "#fdfdfd" }}>
                    <div className="space-y-3 flex flex-col text-gray-700 text-sm sm:text-base leading-relaxed">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Vendor:
                        </span>{" "}
                        {selectedService?.vendor?.vendorName}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Date:
                        </span>{" "}
                        {formatDateToDDMMYY(selectedService?.date)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Time:
                        </span>{" "}
                        {formatTimeTo12Hr(selectedService?.time)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Address:
                        </span>{" "}
                        {selectedService?.address?.houseNo},{" "}
                        {selectedService?.address?.locality},{" "}
                        {selectedService?.address?.area},{" "}
                        {selectedService?.address?.city},{" "}
                        {selectedService?.address?.state} -{" "}
                        {selectedService?.address?.pinCode}
                      </p>

                      <p>
                        <span className="font-semibold text-gray-800">
                          Instructions:
                        </span>{" "}
                        <TextareaAutosize
                          value={
                            selectedService?.vendor?.instructions ||
                            "No Instructions"
                          }
                          className="w-full pointer-events-none p-2 bg-slate-100"
                        />
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Quotation Amount:
                        </span>{"  "}
                        Rs.{selectedService?.vendor?.amount || '0'}
                      </p>
                      <Divider />

                      <p className="text-xl font-semibold text-gray-900 ">
                        Vendor Details
                      </p>

                      <div 
                      className="flex flex-col align-middle justify-center gap-6">

                        <div className="w-full flex justify-center">
                         <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 pt-8">
                        <img
                          src={fetchedVendorForService?.profileImageData?.url}
                          alt={fetchedVendorForService?.fullName}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div className="text-center sm:text-left mt-3 sm:mt-0">
                          <h2 className="text-xl font-semibold">
                            {fetchedVendorForService?.fullName}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {fetchedVendorForService?.businessType}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {fetchedVendorForService?.phoneNo}
                          </p>
                        </div>
                      </div>
                      </div>

                        <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Address
                        </h3>
                        <p className="text-sm">
                          {fetchedVendorForService?.address?.houseNo},{" "}
                          {fetchedVendorForService?.address?.locality},{" "}
                          {fetchedVendorForService?.address?.area},{" "}
                          {fetchedVendorForService?.address?.city},{" "}
                          {fetchedVendorForService?.address?.state} -{" "}
                          {fetchedVendorForService?.address?.pinCode}
                        </p>
                      </div>

                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Services
                        </h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {(fetchedVendorForService?.services ?? []).map((srv, i) => (
                            <li key={i}>{srv}</li>
                          ))}
                        </ul>
                      </div>

                       {(fetchedVendorForService?.sampleWorkData ?? []).length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Sample Work
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {(fetchedVendorForService?.sampleWorkData ?? []).map(
                              (work, i) => (
                                <a
                                  href={work?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    key={i}
                                    src={work?.url}
                                    alt={`Sample ${i + 1}`}
                                    className="rounded-lg object-cover w-full h-28 sm:h-32 border hover:scale-105 transition-transform cursor-pointer"
                                  />
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      </div>

                    
                    </div>
                  </DialogContent>

                  <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCancelServiceBooking}
                      sx={{
                        backgroundColor: "red",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "0.5rem",
                        px: 2,
                      }}
                    >
                      Cancel Booking
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setSelectedService(null)}
                      sx={{
                        // backgroundColor: "red",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "0.5rem",
                        px: 2,
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    }
    </>
  );
};

export default UserBookingsPage;
