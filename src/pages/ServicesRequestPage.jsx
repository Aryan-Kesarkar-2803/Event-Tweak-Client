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
  TextareaAutosize,
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
import {
  deleteServiceRequest,
  getAllServiceRequestsForClient,
  saveServiceBooking,
  updateServiceRequestForClient,
} from "../utils/repository/services";

const ServicesRequestPage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [data, setData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialogForFilter, setOpenDialogForFilter] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [openDialogForVendor, setOpenDialogForVendor] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [viewSampleWork, setViewSampleWork] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    area: "",
  });
  const [bookAnother, setBookAnother] = useState(false);
  const [openSelectedVendorsPopup, setOpenSelectedVendorsPopup] = useState(false);

  const fetchClientServiceBookings = async () => {
    setLoading(true);
    const res = await getAllServiceRequestsForClient(
      user?.userDetails?.id || ""
    );

    if (res) {
      let temp = res?.data || [];
      setData(temp || []);
    }
    setLoading(false)
  };

  const handleSetSelectedService = async (service = {}) => {
    const res = await getVendorsByIds({
      vendorIds: [service?.vendor?.id],
    });
    setSelectedService(
      {
        ...res?.data?.[0],
        ...service,
      } || {}
    );
    return;
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
  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const fetchVendors = async () => {
    setLoading(true);
    const res1 = await getUserProfile();

    const res = await getVendors(
      res1?.data?.address?.state,
      res1?.data?.address?.city,
      selectedService?.businessType
    );
    if (res && res?.status === 200) {
      let temp = (res?.data ?? []).filter(
        (item) => item?.id !== selectedService?.vendor?.id
      );
      // let temp = res?.data || [];
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
  const addVendorsToExistingList = async () => {
    setLoading(true);
    const vendorObj = {
      instructions: selectedVendors?.[0]?.instructions || "",
      businessType: selectedVendors?.[0]?.businessType || "",
      id: selectedVendors?.[0]?.id || "",
      amount: "0",
      vendorName: selectedVendors?.[0]?.fullName || "",
      vendorRejected: false,
      vendorAccepted: false,
      userRejected: false,
    };

    const res = await updateServiceRequestForClient(
      selectedService?.id,
      vendorObj
    );
    if (res && res?.status == 200) {
      successNotification({ message: "Vendor updated successfully" });
      await fetchClientServiceBookings();
      setBookAnother(false);
      setSelectedService(null);
    }
    setLoading(false);
  };

  const handleExitAddVendorPage = () => {
    setBookAnother(false);
  };
  const handleConfirmService = async() =>{
    // console.log('sele - ',selectedService);return;
    setLoading(true);
    const dataToSend = {
        clientName: selectedService?.clientName || '',
        clientId: selectedService?.clientId || '',
        clientPhoneNo: selectedService?.clientPhoneNo || '',
        date: selectedService?.date || '',
        time: selectedService?.time || '',
        address: selectedService?.address || {},
        vendor: {
          id: selectedService?.vendor?.id || '',
          amount: selectedService?.vendor?.amount || '',
          instructions: selectedService?.vendor?.instructions || '',
          businessType: selectedService?.vendor?.businessType || '',
          vendorName: selectedService?.vendor?.vendorName || '',
        }
    }

    const res = await saveServiceBooking(dataToSend);
    if(res && res?.status == 200){
      await deleteServiceRequest(selectedService?.id);
      await fetchClientServiceBookings();
      setSelectedService(null);
      successNotification({message:'Service booked successfully'})
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchClientServiceBookings();
  }, []);

  useEffect(() => {
    if (bookAnother === true) {
      fetchVendors();
      setStartIndex(0);
    }
  }, [bookAnother]);

  useEffect(() => {
    setStartIndex((page - 1) * itemsPerPage);
  }, [page]);

  return (
    <>
    {
      loading ? 
      <Loader/> :
    <>
      {bookAnother ? (
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
                  disabled={true}
                  value={selectedService?.businessType}
                  options={BusinessServices?.map((obj) => Object.keys(obj)[0])}
                  onChange={() => {}}
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
                  className="bg-blue-700 hover:bg-blue-800 w-fit transition-all"
                  sx={{ textTransform: "none" }}
                >
                  <div className="flex items-center gap-2">
                    <FaEye />
                    <h2>Vendor</h2>
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
                    <h2>Add Vendor</h2>
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
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      Sample Work
                    </Typography>
                  </div>
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
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-10 px-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 drop-shadow-md">
            Service Requests
          </h1>

          {data.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No Service requests found.
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
                      {event?.vendor?.businessType || ""}
                    </Typography>

                    <Divider className="my-2" />

                    <Typography className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold text-gray-800">
                        Vendor:
                      </span>{" "}
                      {event?.vendor?.vendorName || ""}
                    </Typography>

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

                    <Typography
                      className={`text-sm sm:text-base  gap-2 ${
                        event?.vendor?.vendorAccepted
                          ? "text-green-500"
                          : event?.vendor?.vendorRejected
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      <span className="font-semibold text-gray-800">
                        Status:
                      </span>{" "}
                      {event?.vendor?.vendorAccepted
                        ? "Accepted"
                        : event?.vendor?.vendorRejected
                        ? "Rejected"
                        : "Pending"}
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
                        handleSetSelectedService(event);
                      }}
                    >
                      {loading ? (
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
            open={!!selectedService}
            onClose={() => setSelectedService(null)}
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
            <div className="max-w-md mx-auto flex flex-col bg-white shadow-lg rounded-xl p-5 space-y-6 text-gray-800 relative">
              {/* Back Arrow */}
              <button
                onClick={() => {
                  setSelectedService(null);
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
                  src={selectedService?.profileImageData?.url}
                  alt={selectedService?.fullName}
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <div className="text-center sm:text-left mt-3 sm:mt-0">
                  <h2 className="text-xl font-semibold">
                    {selectedService?.fullName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedService?.businessType}
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 {selectedService?.phoneNo}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-sm">
                  {selectedService?.address?.houseNo},{" "}
                  {selectedService?.address?.locality},{" "}
                  {selectedService?.address?.area},{" "}
                  {selectedService?.address?.city},{" "}
                  {selectedService?.address?.state} -{" "}
                  {selectedService?.address?.pinCode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Services</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {(selectedService?.services ?? []).map((srv, i) => (
                    <li key={i}>{srv}</li>
                  ))}
                </ul>
              </div>

              {(selectedService?.sampleWorkData ?? []).length > 0 && (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Sample Work
                    </h3>
                    <Button
                      variant="outlined"
                      sx={{ textTransform: "none" }}
                      size="small"
                      onClick={() => {
                        setViewSampleWork((prev) => !prev);
                      }}
                    >
                      {viewSampleWork ? "Hide" : "View"}
                    </Button>
                  </div>
                  {viewSampleWork && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(selectedService?.sampleWorkData ?? []).map(
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
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <h3 className="font-semibold text-gray-900 ">Status:</h3>
                  <h3
                    className={`font-semibold ${
                      selectedService?.vendor?.vendorAccepted
                        ? "text-green-500"
                        : selectedService?.vendor?.vendorRejected
                        ? "text-red-500"
                        : "text-amber-500"
                    }`}
                  >
                    {selectedService?.vendor?.vendorAccepted
                      ? "Accepted"
                      : selectedService?.vendor?.vendorRejected
                      ? "Rejected"
                      : "Pending"}
                  </h3>
                </div>
                {selectedService?.vendor?.vendorRejected && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                    }}
                    onClick={() => {
                      setBookAnother(true);
                    }}
                  >
                    Book Another
                  </Button>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Instructions:
                </h3>
                <TextareaAutosize
                  style={{
                    pointerEvents: "none",
                    width: "100%",
                    backgroundColor: "#F3F2F2",
                    padding: "2%",
                  }}
                  // className="bg-slate-100, p-2"
                  value={
                    selectedService?.vendor?.instructions || "No Instructions"
                  }
                />
              </div>

              <div className="flex gap-2 items-center">
                <h3 className="font-semibold text-gray-900 ">
                  Quotation Amount:
                </h3>
                <h3 className={` `}>
                  {`Rs. ${selectedService?.vendor?.amount}`}
                </h3>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="contained"
                  size="small"
                  disabled={!selectedService?.vendor?.vendorAccepted}
                  sx={{
                    textTransform: "none",
                  }}
                  onClick={()=>{
                    handleConfirmService()
                  }}
                >
                  Confirm Service
                </Button>
              </div>
            </div>
          </Dialog>
        </div>
      )}
      </>
}
    </>
  );
};

export default ServicesRequestPage;
