import React, { useEffect, useState } from "react";
import {
  addVendorsToBookingRequest,
  getAllEventBookingRequestsForClient,
  rejectVendorByClient,
  saveEventData,
  updateVenueForBookingRequest,
} from "../utils/repository/event";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import { errorNotification, successNotification } from "../utils/toast";
import { IoMdAdd } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";

import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Box,
  Pagination,
  Checkbox,
} from "@mui/material";
import { formatDateToDDMMYY, formatTimeTo12Hr } from "../utils/others";
import { getVendors, getVendorsByIds } from "../utils/repository/vendor";
import { getVenueById, getVenues } from "../utils/repository/venue";
import Loader from "../components/globalComponents/Loader";
import { IoMdArrowRoundBack } from "react-icons/io";
import SelectBox from "../components/globalComponents/SelectBox";
import { BusinessServices } from "../utils/constants/vendorConstants";
import { MdTune } from "react-icons/md";
import { getUserProfile } from "../utils/repository/user";
import { FaEye } from "react-icons/fa";
import SelectedVendorsPopup from "../components/globalComponents/SelectedVendorsPopup";
import { eventTypes } from "../utils/constants/eventContants";
import { statesAndCities } from "../utils/constants/LocationData";
import VenueCard from "../components/VenueCard";
import VenuePopup from "../components/VenuePopup";

const UserBookingRequestsPage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fetchedVendors, setFetchedVendors] = useState([]);
  const [fetchedVenue, setFetchedVenue] = useState({});
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState({
    value:false,
    text:[],
  });
  const [viewMore, setViewMore] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [openDialogForFilter, setOpenDialogForFilter] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [openDialogForVendor, setOpenDialogForVendor] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [openVenuePopup, setOpenVenuePopup] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [tempVenueData, setTempVenueData] = useState({
    state: "",
    city: "",
  });
  const [eventData, setEventData] = useState({
    venue: "",
    venueAddress:''
  });

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    area: "",
  });
  const [confirmRejectVendor, setConfirmRejectVendor] = useState({
    value: false,
    vendorId: "",
    requestId: "",
  });
  const [addVendor, setAddVendor] = useState(false);
  const [addVenue, setAddVenue] = useState(false);
  const [fetchedVenues, setFetchedVenues] = useState([]);
  const [openSelectedVendorsPopup, setOpenSelectedVendorsPopup] =
    useState(false);

  const fetchClientEventBookings = async () => {
    setLoading({value:true, text:['...please wait','...fetching data']});
    const res = await getAllEventBookingRequestsForClient(
      user?.userDetails?.id || ""
    );
    setLoading({value:false, text:[]});
    if (res) {
      let temp = res?.data || [];
      // let temp = (res?.data ?? []).map((req) => ({
      //   ...req,
      //   selectedServices: (req?.selectedServices ?? []).filter(
      //     (s) => !s.userRejected
      //   ),
      // }));
      setData(temp || []);
      return temp;
    }

  };

  const handleSetSelectedEvent = async (event = {}) => {
    
    setLoading({value:true, text:['...please wait','...fetching data']});
    // return;

    const vendorIds = (event?.selectedServices ?? []).map(
      (item) => item?.id || ""
    );

    const res = await getVendorsByIds({
      vendorIds: vendorIds,
    });

    if (event?.venue?.id && event?.venue?.id?.length > 0) {
      const res2 = await getVenueById(event?.venue?.id);
      if (res2) {
        setFetchedVenue(res2?.data || {});
      }
    }

    if (res) {
      setFetchedVendors(res?.data);
    }
    setSelectedEvent(event || {});

    setLoading({value:false, text:[]});
  };

  const handleRejectVendor = async () => {
    setLoading({value:true, text:['...please wait','...processing']});
    const res = await rejectVendorByClient(
      confirmRejectVendor?.vendorId,
      confirmRejectVendor?.requestId
    );
    let temp = [];
    if (res) {
      successNotification({ message: "Vendor Rejected" });
      temp = await fetchClientEventBookings();
    }

    const currentEvent = [...temp]?.find(
      (item) => item.id === confirmRejectVendor?.requestId
    );
    setSelectedEvent(currentEvent ?? []);
    setConfirmRejectVendor({
      value: false,
      requestId: "",
      vendorId: "",
    });
    setLoading({value:false, text:[]});
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
  const handleSelectTypeOfService = (e) => {
    setSelectedService(e?.target?.value);
  };
  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const fetchVendors = async () => {
    setLoading({value:true, text:['...please wait','...fetching data']});
    const res1 = await getUserProfile();
    const res = await getVendors(
      res1?.data?.address?.state,
      res1?.data?.address?.city,
      selectedService
    );
    if (res) {
      let temp = (res?.data ?? []).filter((item) =>
        (selectedEvent?.selectedServices ?? []).every(
          (srv) => srv?.id !== item?.id
        )
      );
      setVendors(temp || []);
      if (temp?.length > 0) {
        const areas = [...new Set(temp.map((vendor) => vendor?.address?.area))];
        setUniqueAreas(areas);
      }
    }
    setLoading({value:false, text:[]});
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
  const addVendorsToExistingList = async () => {
    setLoading({value:true, text:['...please wait','...processing']});
    const vendorsList = selectedVendors.map((vendor) => ({
      id: vendor?.id,
      amount: "0",
      userRejected: false,
      vendorAccepted: false,
      vendorRejected: false,
      instructions: vendor?.instructions || "",
    }));

    const res = await addVendorsToBookingRequest({
      requestId: selectedEvent?.id,
      vendorsList,
    });

    if (res) {
      successNotification({ message: "Vendors added" });

      let res = await getVendorsByIds({
        vendorIds: vendorsList?.map((v) => v?.id),
      });
      if (res) {
        setFetchedVendors((prev) => [...prev, ...res?.data]);
      }

      let temp = await fetchClientEventBookings();
      const currentEvent = [...temp]?.find(
        (item) => item?.id === selectedEvent?.id
      );
      setSelectedEvent(currentEvent ?? {});
      handleExitAddVendorPage();
    }
    setLoading({value:false, text:[]});
  };

  const handleExitAddVendorPage = () => {
    setFilter({ area: "" });
    setPage(1);
    setUniqueAreas([]);
    setStartIndex(0);
    setSelectedVendors([]);
    setOpenDialogForVendor(false);
    setOpenDialogForFilter(false);
    setSelectedService("");
    setVendors([]);
    setAddVendor(false);
  };

  const allAccepted = () => {
    if (selectedEvent === null) {
      return false;
    }


    const isVenuePresent = selectedEvent?.venue?.id !== ''; 

    return (selectedEvent?.selectedServices ?? [])?.every(
      (srv) => srv?.vendorAccepted || srv?.vendorRejected
    ) && (isVenuePresent ? selectedEvent?.venue?.venueAccepted : true);
  };

  const handleConfirmEvent = async () => {
    setLoading({value:true, text:['...please wait','...processing','...this may take some time']});

    let eventBooking = {
      clientId: user?.userDetails?.id || '',
      clientName: selectedEvent?.clientName || "",
      clientPhoneNo: selectedEvent?.clientPhoneNo || "",
      eventName: selectedEvent?.eventName || "",
      date: selectedEvent?.date || "",
      time: selectedEvent?.time || "",
      eventType: selectedEvent?.eventType || "",
      noOfGuests: selectedEvent?.noOfGuests || "",
      address: selectedEvent?.venueAddress || {},
      venue: selectedEvent?.venue?.id || "",
      services: (selectedEvent?.selectedServices ?? [])
        ?.filter((srv) => !srv?.vendorRejected && !srv?.userRejected)
        ?.map((srv) => ({
          id :srv?.id,
          amount: srv?.amount || '0',
    })),
    };

    let bookingRequestId = selectedEvent?.id || '';

    const dataToSend = {
      eventBooking,
      bookingRequestId,
    }

    const res = await saveEventData(dataToSend);
    if (res) {
      successNotification({ message: "Event confirmed" });
      await fetchClientEventBookings();
      setSelectedEvent(null);
    }
    setLoading({value:false, text:[]});
  };

  const fetchVenues = async (state = "", city = "", date = "") => {
    setLoading({value:true, text:['...please wait','...fetching data']});
    const res = await getVenues({ city: city, state: state, date: date });
    setFetchedVenues(res?.data || []);
    setLoading({value:false, text:[]});
  };
  
  const addVenueToExistingEvent = async() => {
    setLoading({value:true, text:['...please wait','...processing','...this may take some time']});

      const dataToSend = {
        ...eventData,
        bookingRequestId: selectedEvent?.id,
      }
      
      const res = await updateVenueForBookingRequest(dataToSend);

      if(res){
        successNotification({message:'Request send'});
        setEventData({venue:'',venueAddress:''})
        setFetchedVenues([])
        setAddVenue(false);
        
        let temp = await fetchClientEventBookings();
        const currentEvent = [...temp]?.find(
          (item) => item?.id === selectedEvent?.id
        );
        setSelectedEvent(currentEvent ?? {});
      }
      setLoading({value:false, text:[]});
  }

  useEffect(() => {
    fetchClientEventBookings();
  }, []);

  useEffect(() => {
    if (selectedService !== "") {
      // call for vendors -> selectedService, state, city
      fetchVendors();
      setStartIndex(0);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedEvent == null) {
      setFetchedVendors([]);
      setFetchedVenue({});
    }
  }, [selectedEvent]);

  useEffect(() => {
    setStartIndex((page - 1) * itemsPerPage);
  }, [page]);

  useEffect(() => {
    if (tempVenueData?.city !== "") {
      fetchVenues(
        tempVenueData?.state,
        tempVenueData?.city,
        selectedEvent?.date
      );
    }
  }, [tempVenueData?.city]);


  return (
    <>
    {
      loading?.value ?
      <Loader texts={[...loading?.text]}/>
      :
    <>
      {addVendor ? (
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: "#F9FAFB",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex">
            <IoArrowBackOutline
              size={26}
              onClick={() => {
                handleExitAddVendorPage();
              }}
              cursor={"pointer"}
              style={{
                alignSelf: "start",
              }}
            />
          </div>
          {/* Header & Dropdown */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
              Explore Services
            </h2>

            <div className="flex gap-2 md:gap-5 items-center w-full justify-center">
              <div className="md:w-2/5 w-10/12 ">
                <SelectBox
                  value={selectedService}
                  options={BusinessServices.map((obj) => Object.keys(obj)[0])}
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
            {(vendors ?? [])?.length > 0 ? (
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
                    className="rounded-xl mx-6 md:mx-2 my-1 md:my-2  shadow-md flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {/* Top Image */}

                    {/* <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {vendor?.businessType}
                      </span> */}

                    <div className="w-full flex justify-center items-center mt-4 ">
                      <img
                        src={vendor?.profileImageData?.url}
                        alt={vendor?.fullName}
                        className="w-36 h-36 rounded-full object-cover"
                      />
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
                        📍 {vendor?.address?.area}, {vendor?.address?.city}
                      </p>

                      {/* Services */}
                      {vendor?.services?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {vendor?.services.slice(0, 2).map((service, idx) => (
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
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 ">
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
                ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Select a service to view available vendors.
              </p>
            )}
          </div>

          {/* Pagination */}
          <Box className="flex items-center justify-evenly md:justify-center md:gap-4 mt-6">
            <Pagination
              count={Math.ceil(vendors?.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              sx={{ display: "flex", justifyContent: "center" }}
            />
            {selectedVendors?.length > 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenSelectedVendorsPopup(true);
                  }}
                  color="secondary"
                  className="bg-blue-700 hover:bg-blue-800 w-fit   transition-all"
                  sx={{ textTransform: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <h2>Vendors</h2>
                  </div>
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    addVendorsToExistingList();
                  }}
                  className="bg-blue-700 hover:bg-blue-800 w-fit transition-all"
                  sx={{ textTransform: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <h2>Add Vendors</h2>
                  </div>
                </Button>
              </>
            )}
          </Box>

          <SelectedVendorsPopup
            key={JSON.stringify(selectedVendors)}
            open={openSelectedVendorsPopup}
            onClose={() => {
              setOpenSelectedVendorsPopup(false);
            }}
            selectedVendors={selectedVendors || []}
            setSelectedVendors={setSelectedVendors}
          />

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
              <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
              >
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
                    ? selectedVendor.services.join(", ")
                    : "No services listed"}
                </Typography>
                <Typography variant="body2" color="success.main">
                  <strong>Completed Bookings:</strong>{" "}
                  {selectedVendor?.completedBookings || 0}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  <strong>Current Bookings:</strong>{" "}
                  {selectedVendor?.currentBookings || 0}
                </Typography>
              </Box>

              {/* Sample Work */}
              {selectedVendor?.sampleWorkData?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
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
                        // onClick={() => {
                        //   setSelectedImageSrc(img?.url || "");
                        //   setOpenImagePopup(true);
                        // }}
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
        </Box>
      ) : addVenue ? (
        <div className="w-full flex flex-col gap-4 items-center p-6 ">
          <button
            onClick={() => {
              setAddVenue(false);
            }}
            className=" self-start text-gray-700 transition cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <IoMdArrowRoundBack size={26} />
              <p className="text-base">Back</p>
            </div>
          </button>
          <div className="flex justify-center gap-6 mt-6 md:mt-0 mb-12">
            <div className="min-w-36 w-36 md:min-w-52 md:w-52 ">
              <label htmlFor="">Select State</label>
              <SelectBox
                onChange={(e) => {
                  setTempVenueData((prev) => ({
                    ...prev,
                    state: e?.target?.value,
                  }));
                }}
                options={Object.keys(statesAndCities || {}) || []}
                value={tempVenueData?.state || ""}
              />
            </div>
            <div className="min-w-36 w-36 md:min-w-52 md:w-52 ">
              <label htmlFor="">Select City</label>
              <SelectBox
                options={statesAndCities[tempVenueData?.state || ""]}
                value={tempVenueData?.city || ""}
                onChange={(e) => {
                  setTempVenueData((prev) => ({
                    ...prev,
                    city: e?.target?.value,
                  }));
                }}
              />
            </div>
          </div>

          {fetchedVenues?.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 ">
                {fetchedVenues?.map((venue) => (
                  <VenueCard
                    venue={venue}
                    eventData={eventData}
                    key={venue?.email}
                    onClick={() => {
                      setSelectedVenue(venue);
                      setOpenVenuePopup(true);
                    }}
                    handlerSelectVenue={() => {
                      setEventData((prev) => ({
                        ...prev,
                        venue: venue?.id || "",
                        venueAddress: venue?.address || '',
                      }));
                    }}
                    handlerDeselectVenue={() => {
                      setEventData((prev) => ({
                        ...prev,
                        venue: "",
                        venueAddress:'',
                      }));
                    }}
                  />
                ))}
              </div>
                {
                  eventData?.venue !== '' &&
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  alignSelf: "end",
                  borderRadius: "0.5rem",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
                onClick={(e) => {
                  addVenueToExistingEvent()
                }}
              >
                Add Venue
              </Button>
              }
            </div>
          ) : (
            <h1 className="text-center font-semibold text-2xl">
              No Venues Present!
            </h1>
          )}

          <VenuePopup
            venue={selectedVenue}
            open={openVenuePopup}
            handleClose={() => {
              setSelectedVenue(null);
              setOpenVenuePopup(false);
            }}
            handlerSelectVenue={() => {
              setEventData((prev) => ({
                ...prev,
                venue: selectedVenue?.id || "",
                venueAddress: selectedVenue?.address || ''
              }));
            }}
            key={selectedVenue?.venueName || ""}
            eventData={eventData}
            handlerDeselectVenue={() => {
              setEventData((prev) => ({
                ...prev,
                venue: "",
                venueAddress: '',
              }));
            }}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-10 px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 drop-shadow-md">
            My Booking Requests
          </h1>

          {data.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No booking requests found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(data ?? []).map((event) => (
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
                      <span className="font-semibold text-gray-800">Date:</span>{" "}
                      {formatDateToDDMMYY(event?.date)}
                    </Typography>

                    {/* Time */}
                    <Typography className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold text-gray-800">Time:</span>{" "}
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
                        handleSetSelectedEvent(event);
                      }}
                    >
                      {loading?.value ? (
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

          {/* Dialog for full details */}
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
                      <span className="font-semibold text-gray-800">Date:</span>{" "}
                      {formatDateToDDMMYY(selectedEvent?.date)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Time:</span>{" "}
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
                      {selectedEvent?.venueAddress.houseNo},{" "}
                      {selectedEvent?.venueAddress.locality},{" "}
                      {selectedEvent?.venueAddress.area},{" "}
                      {selectedEvent?.venueAddress.city},{" "}
                      {selectedEvent?.venueAddress.state} -{" "}
                      {selectedEvent?.venueAddress.pinCode}
                    </p>

                    <Divider className="my-3" />
                    {selectedEvent?.venue?.id?.length > 0 && (
                      <>
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex justify-between w-full items-center">
                            <p className="font-semibold text-gray-900">
                              Venue Status:{" "}
                              <span
                                className={`text-sm md:text-base font-medium ${
                                  selectedEvent?.venue.venueAccepted
                                    ? "text-green-600"
                                    : selectedEvent?.venue?.venueRejected ===
                                      false
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {selectedEvent?.venue?.venueAccepted
                                  ? "Accepted"
                                  : selectedEvent?.venue?.venueRejected ===
                                    false
                                  ? "Pending"
                                  : "Rejected"}
                              </span>
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
                          {selectedEvent?.venue?.venueRejected && (
                            <Button
                              onClick={() => {
                                setAddVenue(true);
                              }}
                              variant="contained"
                              color="secondary"
                              sx={{
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: "0.5rem",
                                alignSelf: "center",
                                fontSize: "0.8rem",
                                px: 2,
                              }}
                            >
                              Book Another
                            </Button>
                          )}
                        </div>
                        <Divider className="my-3" />
                      </>
                    )}

                    <p className="font-semibold text-gray-900">Services:</p>
                    {selectedEvent?.selectedServices.map((srv, idx) => {
                      if (srv?.userRejected) return null;

                      const currentVendor =
                        fetchedVendors.find((v) => v?.id === srv?.id) || {};

                      return (
                        <div className="flex flex-col gap-6 align-middle border rounded-xl p-3 sm:p-4 mt-2 bg-white shadow-sm hover:shadow-md transition-all duration-200">
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
                                {currentVendor?.phoneNo || "demo"}
                              </p>
                              <p className="text-sm sm:text-base">
                                <span className="font-medium text-gray-800">
                                  Quotation Amount:
                                </span>
                                {srv?.amount === "0"
                                  ? " - "
                                  : ` ₹ ${srv?.amount}`}
                              </p>

                              <p className={`text-sm sm:text-base font-medium`}>
                                Status:{" "}
                                <span
                                  className={`${
                                    srv.vendorAccepted
                                      ? "text-green-600"
                                      : srv?.vendorRejected === false
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {srv.vendorAccepted
                                    ? "Accepted"
                                    : srv?.vendorRejected === false
                                    ? "Pending"
                                    : "Not Accepted"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="w-full flex justify-center gap-4">
                            {srv?.vendorAccepted && (
                              <Button
                                onClick={() => {
                                  setConfirmRejectVendor({
                                    value: true,
                                    vendorId: srv?.id || "",
                                    requestId: selectedEvent?.id || "",
                                  });
                                }}
                                variant="contained"
                                sx={{
                                  backgroundColor: "red",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  borderRadius: "0.5rem",
                                  alignSelf: "center",
                                  fontSize: "0.8rem",
                                  px: 2,
                                }}
                              >
                                Reject
                              </Button>
                            )}

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

                    <Button
                      startIcon={<IoMdAdd />}
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        alignSelf: "end",
                        borderRadius: "0.5rem",
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      }}
                      onClick={(e) => {
                        setAddVendor(true);
                      }}
                    >
                      Add Vendors
                    </Button>
                  </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!allAccepted()}
                    onClick={handleConfirmEvent}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "0.5rem",
                      px: 2,
                    }}
                  >
                    Confirm Event
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSelectedEvent(null)}
                    sx={{
                      // color: "#ef4444",
                      backgroundColor: "red",
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

          {/* Dialog for Reject Vendor */}
          <Dialog
            open={confirmRejectVendor?.value}
            onClose={() => {
              setConfirmRejectVendor({
                value: false,
                requestId: "",
                vendorId: "",
              });
            }}
          >
            {/* <DialogTitle className="text-lg font-semibold">Exit</DialogTitle> */}

            <DialogContent>
              <p className="text-gray-700">
                Do you really want to Reject Vendor?
              </p>
            </DialogContent>

            <DialogActions className="flex justify-end gap-3 px-4 py-2">
              <Button
                variant="outlined"
                sx={{ textTransform: "none", borderRadius: "0.5rem" }}
                onClick={() => {
                  setConfirmRejectVendor({
                    value: false,
                    requestId: "",
                    vendorId: "",
                  });
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "0.5rem",
                  backgroundColor: "red",
                }}
                onClick={handleRejectVendor}
              >
                Reject
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  }
    </>
  );
};

export default UserBookingRequestsPage;
