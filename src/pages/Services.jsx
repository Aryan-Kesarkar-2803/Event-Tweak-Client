import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SelectBox from "../components/globalComponents/SelectBox";
import { BusinessServices } from "../utils/constants/vendorConstants";
import { getVendors } from "../utils/repository/vendor";
import { MdTune } from "react-icons/md";
import { getUserProfile } from "../utils/repository/user";
import SelectedVendorsPopup from "../components/globalComponents/SelectedVendorsPopup";
import { FaEye } from "react-icons/fa";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import { requestVendorService } from "../utils/repository/services";
import { successNotification } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/globalComponents/Loader";
import ImagePopup from "../components/globalComponents/ImagePopUp";

const Services = () => {
  const navigate = useNavigate()
  const [user, setUser] = useAtom(authUserAtom);
  const [selectedService, setSelectedService] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState({
    value:false,
    text:[],
  });
  const [vendors, setVendors] = useState([]);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [openDialogForFilter, setOpenDialogForFilter] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [openDialogForVendor, setOpenDialogForVendor] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorToAdd, setVendorToAdd] = useState(null);
  const [userData, setUserData] = useState({});
  const [openImagePopup, setOpenImagePopup] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [openDialogForBookVendor, setOpenDialogForBookVendor] = useState(false);
  const [openSelectedVendorsPopup, setOpenSelectedVendorsPopup] =
    useState(false);
  const [filter, setFilter] = useState({
    area: "",
  });

  const fetchVendors = async () => {
    setLoading({value:true, text:['...fetching vendors','...please wait']});
    const res = await getVendors(
      userData?.address?.state || "",
      userData?.address?.city || "",
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
    setLoading({value:false, text:[]});
  };

  const handleSelectVendor = (_vendor = null) => {
    setVendorToAdd(({
      ..._vendor,
      address: userData?.address || {},
    }));
  };

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const fetchUserProfile = async () => {
    const res = await getUserProfile();
    setUserData(res?.data || {});
  };

  const bookVendorService = async () => {
    if (vendorToAdd === null) return;

    let dataToSend = {
      clientName: userData?.fullName || "",
      clientId: user?.userDetails?.id || "",
      clientPhoneNo: userData?.phoneNo || "",
      date: vendorToAdd?.date || "",
      time: vendorToAdd?.time || "",
      address: vendorToAdd?.address || {},
      vendor: {
        amount: "0",
        id: vendorToAdd?.id || "",
        instructions: vendorToAdd?.instructions || "",
        businessType: vendorToAdd?.businessType,
        vendorName: vendorToAdd?.fullName,
        userRejected: false,
        vendorRejected: false,
        vendorAccepted: false,
      },
    };

    const res = await requestVendorService(dataToSend);
    if(res && res?.status == 200){
      successNotification({message:'Booking request send'});
      navigate("/service-requests") ;
    }
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


  useEffect(() => {
    if (selectedService !== "") {
      fetchVendors();
      setVendorToAdd(null);
      setStartIndex(0);
    }
  }, [selectedService]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
    {
      loading?.value ?
      <Loader texts={[...loading?.text]}/>:
    <>
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
                options={BusinessServices.map((obj) => Object.keys(obj)[0])}
                onChange={(e) => {
                  setSelectedService(e?.target?.value);
                }}
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
          {
          selectedService?.length > 0 ?
          ((vendors ?? [])?.length > 0 && (
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
                      checked={vendorToAdd?.id === vendor?.id}
                      onClick={() => {
                        if (
                          vendorToAdd !== null &&
                          vendorToAdd?.id == vendor?.id
                        ) {
                          handleSelectVendor(null);
                        } else {
                          handleSelectVendor(vendor);
                        }
                      }}
                    />
                  </div>
                </Card>
              ))
             )) : 
           <p className="text-gray-500 text-center col-span-full">
              Select a service to view available vendors.
            </p>
        }
        </div>
         {
          selectedService?.length > 0 && vendors?.length == 0 &&           
          <p className="text-center w-full align-middle mt-4 text-xl font-semibold">No Available Vendors</p>
        }

        {/* Pagination */}
        {
          vendors?.length > 0 &&
        <div className="flex flex-col  gap-4">
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

          {vendorToAdd !== null && (
            <div className="flex  w-full justify-center gap-4 md:justify-end">
              <Button
                sx={{ width: "auto" }}
                variant="contained"
                onClick={() => {
                  setOpenSelectedVendorsPopup(true);
                }}
                className="bg-blue-700 hover:bg-blue-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  <FaEye />
                  <h2>Vendor</h2>
                </div>
              </Button>

              <Button
                sx={{ width: "auto" }}
                variant="contained"
                onClick={() => {
                  setOpenDialogForBookVendor(true);
                }}
                className="bg-blue-700 hover:bg-blue-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  <h2>Next</h2>
                </div>
              </Button>
            </div>
          )}
        </div>
      }
      </Box>

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
              handleSelectVendor(
                selectedVendor?.id === vendorToAdd?.id ? null : selectedVendor
              );
            }}
          >
            {selectedVendor?.id === vendorToAdd?.id ? "UnSelect" : "Select"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogForBookVendor}
        onClose={() => {
          setOpenDialogForBookVendor(false);
        }}
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Date"
              type="date"

              InputLabelProps={{ 
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString()?.split("T")?.[0]
              }}    
              value={vendorToAdd?.date}
              onChange={(e) => {
                setVendorToAdd((prev) => ({
                  ...prev,
                  date: e?.target?.value,
                }));
              }}
            />
            <TextField
              label="Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={vendorToAdd?.time}
              onChange={(e) => {
                setVendorToAdd((prev) => ({
                  ...prev,
                  time: e?.target?.value,
                }));
              }}
            />
            <Divider />
            <h1 className="font-semibold text-xl">Address</h1>
            <TextField
              label="House No"
              value={vendorToAdd?.address?.houseNo || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    houseNo: e?.target?.value ||'',
                  },
                }))
              }
            />
              <TextField
              label="Locality"
              value={vendorToAdd?.address?.locality || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    locality: e?.target?.value ||'',
                  },
                }))
              }
            />
                <TextField
              label="Area"
              value={vendorToAdd?.address?.area || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    area: e?.target?.value ||'',
                  },
                }))
              }
            />
              <TextField
              label="City"
              value={vendorToAdd?.address?.city || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    city: e?.target?.value ||'',
                  },
                }))
              }
            />
             <TextField
              label="State"
              value={vendorToAdd?.address?.state || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    state: e?.target?.value ||'',
                  },
                }))
              }
            />
            <TextField
              label="Pincode"
              value={vendorToAdd?.address?.pinCode || ''}
              onChange={(e) =>
                setVendorToAdd((prev) => ({
                  ...prev,
                  address: {
                    ...prev?.address,
                    pinCode: e?.target?.value ||'',
                  },
                }))
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenDialogForBookVendor(false);
            }}
          >
            Back
          </Button>
          <Button variant="contained" onClick={bookVendorService}>
            Book
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

      <SelectedVendorsPopup
        key={vendorToAdd?.id || ""}
        open={openSelectedVendorsPopup}
        onClose={() => {
          setOpenSelectedVendorsPopup(false);
        }}
        selectedVendors={[vendorToAdd]}
        // setSelectedVendors={setVendorToAdd}
      />

      <ImagePopup
        open={openImagePopup}
        onClose={() => {
          setOpenImagePopup(false);
          setSelectedImageSrc(null);
        }}
        src={selectedImageSrc || null}
        alt="Image"
      />
      </>
    }
    </>
  );
};

export default Services;
