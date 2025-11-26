import React, { useEffect, useInsertionEffect, useState } from "react";
import {
  getBookingRequestForVenue,
  updateBookingRequestStatusForVenue,
} from "../utils/repository/venue";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import { getAllServiceRequestsForVendor } from "../utils/repository/services";
import { getAllEventBookingRequestsForClient } from "../utils/repository/event";
import { errorNotification, successNotification } from "../utils/toast";
import Loader from "../components/globalComponents/Loader";
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
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { formatDateToDDMMYY, formatTimeTo12Hr } from "../utils/others";

import { IoMdClose } from "react-icons/io";
import { updateServiceRequestStatusForVendor } from "../utils/repository/vendor";

const VendorServiceRequestsPage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [loading, setLoading] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [amount, setAmount] = useState('');

  const fetchServiceRequestsForVendor = async () => {
    setLoading(true);
    const res = await getAllServiceRequestsForVendor(
      user?.userDetails?.id || ""
    );
    console.log(res);
    let temp = [...res?.data]?.filter(obj => (!obj?.vendor?.vendorAccepted && !obj?.vendor?.vendorRejected));

    setServiceRequests(temp || []);
    setLoading(false);
  };
  const handleAcceptRequest = async() => {
    const dataToSend = {
        vendorId: selectedRequest?.vendor?.id || '',
        serviceRequestId: selectedRequest?.id || '',
        amount: (amount || '')?.toString(),
        vendorAccepted: true,
        vendorRejected: false,
    }
    const res = await updateServiceRequestStatusForVendor(dataToSend);
    if(res && res?.status == 200){
        successNotification({message:'Request Accepted'});
        setAmount('');
        await fetchServiceRequestsForVendor();
        setSelectedRequest(null);
    }
  };
  const handleRejectRequest = async() => {
     const dataToSend = {
        vendorId: selectedRequest?.vendor?.id || '',
        serviceRequestId: selectedRequest?.id || '',
        amount: '0',
        vendorAccepted: false,
        vendorRejected: true,
    }
    const res = await updateServiceRequestStatusForVendor(dataToSend);
    console.log('reject - ',res);
     if(res && res?.status == 200){
        successNotification({message:'Request Rejected'});
        setAmount('');
        await fetchServiceRequestsForVendor();
        setSelectedRequest(null);
    }
  };

  useEffect(() => {
    fetchServiceRequestsForVendor();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-10 px-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 drop-shadow-md">
            Service Requests
          </h1>

          {serviceRequests.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No booking requests found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceRequests.map((booking) => (
                <Card
                  key={booking.id}
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
                    <p className="mb-1">
                      <span className="font-semibold text-gray-900">
                        Client Name:{" "}
                      </span>
                      {booking?.clientName || "-"}
                    </p>

                    <p className="mb-1">
                      <span className="font-semibold text-gray-900">
                        Phone No:{" "}
                      </span>
                      {booking?.clientPhoneNo || "-"}
                    </p>

                    <Divider className="my-2" />

                    <Typography className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold text-gray-800">Date:</span>{" "}
                      {formatDateToDDMMYY(booking?.date) || " - "}
                    </Typography>

                    <Typography className="text-sm sm:text-base text-gray-700">
                      <span className="font-semibold text-gray-800">Time:</span>{" "}
                      {formatTimeTo12Hr(booking?.time) || " - "}
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
                      onClick={() => {
                        setSelectedRequest(booking);
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
            open={selectedRequest !== null}
            onClose={() => setSelectedRequest(null)}
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
                letterSpacing: "-0.01em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p className="text-lg sm:text-xl font-bold text-gray-900  ">
                Service Request Details
              </p>

              <IoMdClose
                size={28}
                cursor={"pointer"}
                onClick={() => {
                  setSelectedRequest(null);
                }}
              />
            </DialogTitle>

            <DialogContent dividers sx={{ backgroundColor: "#fdfdfd" }}>
              <div className="space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-800">
                    Client Name:
                  </span>{" "}
                  {selectedRequest?.clientName || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Phone No:</span>{" "}
                  {selectedRequest?.clientPhoneNo || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  {selectedRequest?.clientEmail || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  {formatDateToDDMMYY(selectedRequest?.date) || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Time:</span>{" "}
                  {formatTimeTo12Hr(selectedRequest?.time) || " - "}
                </p>
                <div>
                  <p className="font-semibold text-gray-800">Instructions:</p>
                  <TextareaAutosize
                    className="pointer-events-none w-full p-2 bg-slate-100"
                    value={
                      selectedRequest?.vendor?.instructions || "No Instructions"
                    }
                  />
                </div>

                <div className="h-auto">
                  <p className="font-semibold text-gray-800">
                    Quotation Amount:{" "}
                  </p>
                  <TextField
                    type="number"
                    size="small"
                    value={amount}
                    onChange={(e) => {
                      if (e?.target?.value < 0) return;
                      setAmount(e?.target?.value);
                    }}
                  />
                </div>
              </div>
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                py: 2,
                gap: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p className="text-sm text-gray-600">
                *please contact client for any query.
              </p>
              <div className="flex align-middle gap-4">
                <Button
                  variant="contained"
                  onClick={handleAcceptRequest}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "0.5rem",
                    px: 2,
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  onClick={handleRejectRequest}
                  sx={{
                    backgroundColor: "red",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "0.5rem",
                    px: 2,
                  }}
                >
                  Reject
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default VendorServiceRequestsPage;
