import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  formatDateToDDMMYY,
  formatTimeTo12Hr,
  isNumber,
} from "../utils/others";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { getEventsForVendor } from "../utils/repository/event";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import Loader from "../components/globalComponents/Loader";
import {
  cancelServiceBooking,
  getAllServiceBookingsForClient,
  getAllServiceBookingsForVendor,
} from "../utils/repository/services";
import { successNotification } from "../utils/toast";

const VendorSchedule = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [activeEventsDate, setActiveEventsDate] = useState([]);
  const [user, setUser] = useAtom(authUserAtom);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openDialogForEventPopup, setOpenDialogForEventPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const getEventForDate = (date) => {
    return activeEvents.find(
      (event) => event.date === new Date(date).toLocaleDateString("en-CA")
    );
  };

  const getServiceForDate = (date) => {
    return activeServices.find(
      (event) => event.date === new Date(date).toLocaleDateString("en-CA")
    );
  };
  
  const handleCancelServiceBooking = async() => {
    setLoading(true);
    const res = await cancelServiceBooking(selectedService?.id || '');
    if(res && res?.status == 200){
      successNotification({message:'Service Booking cancelled'});
      setSelectedService(null);
      await fetchVendorSchedule();
    }
    setLoading(false);
  }

  useEffect(() => {
    if (activeEvents?.length > 0) {
      let eventDates = [...activeEvents].map((event) => event?.date || "");
      const ServicesDates = [...activeServices]?.map((srv) => srv?.date || "");
      setActiveEventsDate([...eventDates, ...ServicesDates]);
    }
  }, [activeEvents, activeServices]);

  const fetchVendorSchedule = async () => {
    setLoading(true);
    const res = await getEventsForVendor(user?.userDetails?.id || "");
    if (res) {
      setActiveEvents(res?.data || []);
    }
    const res1 = await getAllServiceBookingsForVendor(
      user?.userDetails?.id || ""
    );
    console.log("res2 - ", res1);

    if (res1 && res1?.status == 200) {
      setActiveServices(res1?.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendorSchedule();
  }, []);


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center gap-6 p-4 sm:p-6 w-full max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Vendor Schedule
          </h1>

          <div className="flex flex-col items-center w-full ">
            <div className="w-full sm:w-auto overflow-x-auto bg-white p-3 rounded-lg shadow-md">
              <Calendar
                minDate={new Date()}
                onClickDay={(date) => {
                  const event = getEventForDate(date);
                  if (event !== undefined) {
                    setSelectedEvent(event || null);
                    return;
                  }
                  const service = getServiceForDate(date);
                  if (service !== undefined) {
                    setSelectedService(service);
                    return;
                  }
                  setSelectedEvent(null);
                  setSelectedService(null);
                }}
                tileContent={({ date }) => {
                  const formatted = date.toLocaleDateString("en-CA");
                  if (activeEventsDate.includes(formatted)) {
                    return (
                      <div className=" border-b-4 border-green-500 mt-1 self-center"></div>
                    );
                  }
                  return null;
                }}
              />
            </div>

            {selectedEvent ? (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-lg w-full sm:max-w-md text-center border border-blue-200 transition-transform hover:scale-105">
                <h2 className="font-bold text-2xl text-blue-900 mb-5">
                  Event Details
                </h2>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">
                      Event Name:
                    </span>
                    <span className="text-gray-800">
                      {selectedEvent.eventName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">
                      Client Name:
                    </span>
                    <span className="text-gray-800">
                      {selectedEvent.clientName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">Date:</span>
                    <span className="text-gray-800">
                      {selectedEvent.date || "-"}
                    </span>
                  </div>
                  <div className="w-full  flex justify-end">
                    <button
                      onClick={() => {
                        setOpenDialogForEventPopup(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white font-bold text-sm  rounded-md hover:bg-blue-600 transition"
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedService ? (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-lg w-full sm:max-w-md text-center border border-blue-200 transition-transform hover:scale-105">
                <h2 className="font-bold text-2xl text-blue-900 mb-5">
                  Service Details
                </h2>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">
                      Client Name:
                    </span>
                    <span className="text-gray-800">
                      {selectedService?.clientName || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">
                      Phone No:
                    </span>
                    <span className="text-gray-800">
                      {selectedService?.clientPhoneNo || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">Date:</span>
                    <span className="text-gray-800">
                      {formatDateToDDMMYY(selectedService?.date) || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">Time:</span>
                    <span className="text-gray-800">
                      {formatTimeTo12Hr(selectedService?.time) || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700">
                      Quotation Amount:
                    </span>
                    <span className="text-gray-800">
                      {`Rs. ${selectedService?.vendor?.amount}` || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-14">
                    <span className="font-semibold text-blue-700">
                      Address:
                    </span>
                    <span className="text-gray-800  text-right">
                      {Object.values(selectedService?.address || {}).join(
                        ", "
                      ) || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-blue-700">Instructions:</p>
                    <TextareaAutosize
                      className="pointer-events-none w-full p-2  bg-slate-100"
                      value={selectedService?.vendor?.instructions || ""}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCancelServiceBooking}
                  variant="contained"
                  color="error"
                  sx={{ mt:'20px' }}
                >
                  Cancel Booking
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-sm sm:text-base">
                Tap a highlighted date to view details.
              </p>
            )}
          </div>

          <Dialog
            open={openDialogForEventPopup}
            onClose={() => setOpenDialogForEventPopup(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3, // rounded corners
                overflow: "hidden",
                boxShadow: 5, // deeper shadow
              },
            }}
          >
            {/* Colored header */}
            <DialogTitle
              sx={{
                backgroundColor: "#3B82F6", // Tailwind blue-500
                color: "white",
                fontWeight: "bold",
                fontSize: "1.25rem",
                textAlign: "center",
                py: 2,
              }}
            >
              Event Details
            </DialogTitle>

            <Divider />

            <DialogContent
              dividers
              sx={{ px: 4, py: 3, backgroundColor: "#F3F4F6" }}
            >
              <Typography variant="body1" gutterBottom>
                <strong>Event Name:</strong> {selectedEvent?.eventName || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Client Name:</strong> {selectedEvent?.clientName || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phone No:</strong> {selectedEvent?.clientPhoneNo || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong>{" "}
                {formatDateToDDMMYY(selectedEvent?.date) || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Time:</strong>{" "}
                {formatTimeTo12Hr(selectedEvent?.time || "") || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Event Type:</strong> {selectedEvent?.eventType || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Address: </strong>{" "}
                {Object?.values(selectedEvent?.address || {}).join(", ") || "-"}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>No. of Guests:</strong>{" "}
                {selectedEvent?.noOfGuests || "-"}
              </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, backgroundColor: "#F3F4F6" }}>
              <Button
                onClick={() => setOpenDialogForEventPopup(false)}
                variant="contained"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default VendorSchedule;
