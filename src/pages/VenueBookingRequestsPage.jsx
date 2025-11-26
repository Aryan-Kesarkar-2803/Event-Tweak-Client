import React, { useEffect, useInsertionEffect, useState } from "react";
import {
  getBookingRequestForVenue,
  updateBookingRequestStatusForVenue,
} from "../utils/repository/venue";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
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
} from "@mui/material";
import { formatDateToDDMMYY, formatTimeTo12Hr } from "../utils/others";

import { IoMdClose } from "react-icons/io";

const VenueBookingRequestsPage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleAcceptRequest = async () => {
    setLoading(true);

    const res = await updateBookingRequestStatusForVenue({
      id: selectedRequest?.id || "",
      venueAccepted: true,
      venueRejected: false,
    });

    if (res) {
      await fetchBookingRequests();
      successNotification({ message: "Request Accepted successfully" });
    }
    setLoading(false);
    setSelectedRequest(null);
  };
  const handleRejectRequest = async () => {
    setLoading(true);

    const res = await updateBookingRequestStatusForVenue({
      id: selectedRequest?.id || "",
      venueAccepted: false,
      venueRejected: true,
    });

    if (res) {
      await fetchBookingRequests();
      successNotification({message:'Request Rejected successfully'})
    }
    setLoading(false);
    setSelectedRequest(null);
  };

  const fetchBookingRequests = async () => {
    setLoading(true);
    const res = await getBookingRequestForVenue(user?.userDetails?.id || "");
    let temp = [...res?.data];
    temp = temp.filter(
      (req) =>
        req?.venue?.venueAccepted === false &&
        req?.venue?.venueRejected === false
    );
    setBookingRequests(temp);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-10 px-6">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 drop-shadow-md">
            Booking Requests
          </h1>

          {bookingRequests.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No booking requests found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookingRequests.map((booking) => (
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
                        Event Type:{" "}
                      </span>
                      {booking?.eventType || "-"}
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

                    <Typography className="text-sm sm:text-base text-gray-700 mb-2">
                      <span className="font-semibold text-gray-800">
                        Guests:
                      </span>{" "}
                      {booking?.noOfGuests || " - "}
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
                Booking Request Details
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
                  <span className="font-semibold text-gray-800">
                    Event Type:
                  </span>{" "}
                  {selectedRequest?.eventType || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Event Name:
                  </span>{" "}
                  {selectedRequest?.eventName || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  {formatDateToDDMMYY(selectedRequest?.date) || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Time:</span>{" "}
                  {formatTimeTo12Hr(selectedRequest?.time) || " - "}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Guests:</span>{" "}
                  {selectedRequest?.noOfGuests}
                </p>
              </div>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, gap: 1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
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

export default VenueBookingRequestsPage;
