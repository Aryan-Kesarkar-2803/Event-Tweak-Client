import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {isNumber} from '../utils/others'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from "@mui/material";
import SelectBox from "../components/globalComponents/SelectBox";
import { eventTypes } from "../utils/constants/eventContants";
import { errorNotification, successNotification } from "../utils/toast";
import { getEventsForVenue, saveEventData } from "../utils/repository/event";
import { useAtom } from "jotai";
import { authUserAtom } from "../store/other";
import DatePicker from "react-datepicker";
import { getVenueProfile } from "../utils/repository/venue";
import { pre } from "framer-motion/client";
import Loader from "../components/globalComponents/Loader";

const VenueSchedule = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [activeEvents, setActiveEvents] = useState([])
  const [activeEventsDate, setActiveEventsDate] = useState([])
  const [user,setUser] = useAtom(authUserAtom)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialogForEventPopup, setOpenDialogForEventPopup] = useState(false)
  const [loading, setLoading] = useState({
    value:false,
    text: [],
  });

  const [newInfo, setNewInfo] = useState({
    eventName:'',
    clientName:'',
    clientPhoneNo:'',
    date:'',
    time:'',
    eventType:'',
  })

  const getEventForDate = (date) =>{
    return activeEvents.find(
      (event) => event.date === new Date(date).toLocaleDateString("en-CA")
    );
  }
   

  const handleAddEvent = async() => {

    if(
      newInfo.clientName === '' ||
      newInfo.clientPhoneNo === '' ||
      newInfo.date === '' ||
      newInfo.eventName === '' ||
      newInfo.eventType === '' ||
      newInfo.time === '' 
    ){
      errorNotification({message:'please enter all fields'})
      return;
    }

    setLoading(({value:true,text:['...saving data','...please wait']}));

    const res = await saveEventData(
      {
        eventBooking: {
        ...newInfo,
        venue: user?.userDetails?.id || '',
      }
      }
    );
    if(res){
      successNotification({message:'Data saved successfully'})
      setNewInfo(prev => ({
        clientName:'',
        clientPhoneNo:'',
        date:'',
        eventName:'',
        eventType:'',
        time:''
      }));
      await fetchEventsForVenue();
    }
    setLoading({value:false, text:[]});

  };
  const handleChangeEventNameForNewEvent = (e) =>{
    setNewInfo(prev => ({
      ...prev,
      eventName:e?.target?.value || '',
    }))
  }
   const handleChangeClientNameForNewEvent = (e) =>{
    setNewInfo(prev => ({
      ...prev,
      clientName:e?.target?.value || '',
    }))
  }
   const handleChangeClientPhoneNoForNewEvent = (e) =>{
    if(!isNumber(e.target.value || '')) return;
    if((e.target.value || '')?.length > 10) return;

    setNewInfo(prev => ({
      ...prev,
      clientPhoneNo:e?.target?.value || '',
    }))
  }
  const handleChangeDateForNewEvent = (e) => {
      setNewInfo(prev => ({
      ...prev,
      date :e?.target?.value || '',
    }))
  }
   const handleChangeTimeForNewEvent = (e) => {
      setNewInfo(prev => ({
      ...prev,
      time :e?.target?.value || '',
    }))
  }
  const handleChangeEventTypeForNewEvent = (e) => {
    setNewInfo(prev => ({
      ...prev,
      eventType: e?.target?.value || ''
    }))
  }

  const fetchEventsForVenue = async() =>{
    setLoading({value:true, text:['...fetching schedule','...please wait']})
    const res = await getEventsForVenue(user?.userDetails?.id);
    if(res){
      setActiveEvents(res?.data || [])
    }
    setLoading(({value:false, text:[]}))
  }

  useEffect(()=>{
    fetchEventsForVenue();
  },[])

  useEffect(()=>{

    if(activeEvents?.length > 0){
        let temp = [...activeEvents].map(event => event?.date || '');
        console.log('dates - ',temp)
        setActiveEventsDate(temp)
    }
  },[activeEvents])

  

  return (
    <>
    {
      loading?.value ?
      <Loader texts={loading?.text || []}/> :
    <div className="flex flex-col items-center gap-6 p-4 sm:p-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Venue Schedule
      </h1>

      {/* Responsive Menu Bar */}
      <div className="flex flex-wrap justify-center gap-3 bg-gray-100 rounded-lg p-2 w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "calendar"
              ? "bg-blue-500 text-white shadow"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          📅 Calendar View
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeTab === "manual"
              ? "bg-blue-500 text-white shadow"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          ✏️ Add Manually
        </button>
      </div>

      {/* Calendar View */}
      {activeTab === "calendar" && (
        <div className="flex flex-col items-center w-full ">
          <div className="w-full sm:w-auto overflow-x-auto bg-white p-3 rounded-lg shadow-md">
            <Calendar
            minDate={new Date()}
            onClickDay={(date) => {
              const event = getEventForDate(date);
              setSelectedEvent(event || null);
            }}
            tileContent={({ date }) => {
              const formatted = date.toLocaleDateString("en-CA");
              if (activeEventsDate.includes(formatted)) {
                console.log(formatted)
                return (
                       <div className=" border-b-4 border-green-500 mt-1 self-center"></div>
                )
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
                <span className="font-semibold text-blue-700">Event Name:</span>
                <span className="text-gray-800">{selectedEvent.eventName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-blue-700">Client Name:</span>
                <span className="text-gray-800">{selectedEvent.clientName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-blue-700">Date:</span>
                <span className="text-gray-800">{selectedEvent.date || "-"}</span>
              </div>
             <div className="w-full  flex justify-end">
              <button
              onClick={()=>{setOpenDialogForEventPopup(true)}}
                className="px-4 py-2 bg-blue-500 text-white font-bold text-sm  rounded-md hover:bg-blue-600 transition"
              >
                View More
              </button>
            </div>

            </div>
          </div>

          ) : (
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Tap a highlighted date to view details.
            </p>
          )}
        </div>
      )}

      {/* Manual Add View */}
     {activeTab === "manual" && (
  <div className="w-full sm:max-w-md mt-4 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold mb-4 text-gray-700 text-center">
      Add Event
    </h2>
    <div className="flex flex-col gap-4">
      

       <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Client Name
        </label>
        <input
          type="text"
          value={newInfo.clientName || ''}
          onChange={handleChangeClientNameForNewEvent}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
       <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Event Type
        </label>
        <SelectBox
          value={newInfo?.eventType || ''}
          onChange={handleChangeEventTypeForNewEvent}
          options={eventTypes}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Event Name
        </label>
        <input
          type="text"
          value={newInfo.eventName || ''}
          onChange={handleChangeEventNameForNewEvent}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Date
        </label>
        <input
          type="date"
          onClick={(e) => {e?.target?.showPicker?.()}}
          value={newInfo.date || ''}
          min={new Date().toISOString().split("T")[0] || ''}
          onChange={handleChangeDateForNewEvent}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
        <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Time
        </label>
        <input
          type="time"
          onClick={(e) => {e?.target?.showPicker?.()}}
          value={newInfo.time || ''}
          onChange={handleChangeTimeForNewEvent}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
       <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Client Phone No.
        </label>
        <input
          type="text"
          value={newInfo.clientPhoneNo || ''}
          onChange={handleChangeClientPhoneNoForNewEvent}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={handleAddEvent}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
      >
        Add Event
      </button>
    </div>
  </div>
)}

     {/* <Dialog
        open={openDialogForEventPopup}
        onClose={() => setOpenDialogForEventPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Event Details</DialogTitle>
        <Divider />
        <DialogContent dividers>
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
            <strong>Date:</strong> {selectedEvent?.date || "-"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Time:</strong> {selectedEvent?.time || "-"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Event Type:</strong> {selectedEvent?.eventType || "-"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>No. of Guests:</strong> {selectedEvent?.noOfGuests || "-"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogForEventPopup(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}

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

  <DialogContent dividers sx={{ px: 4, py: 3, backgroundColor: "#F3F4F6" }}>
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
      <strong>Date:</strong> {selectedEvent?.date || "-"}
    </Typography>
    <Typography variant="body1" gutterBottom>
      <strong>Time:</strong> {selectedEvent?.time || "-"}
    </Typography>
    <Typography variant="body1" gutterBottom>
      <strong>Event Type:</strong> {selectedEvent?.eventType || "-"}
    </Typography>
    <Typography variant="body1" gutterBottom>
      <strong>No. of Guests:</strong> {selectedEvent?.noOfGuests || "-"}
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
    }
    </>
  );
};

export default VenueSchedule;
