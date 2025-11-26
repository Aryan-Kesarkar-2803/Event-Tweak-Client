
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Header from './components/Header.jsx'
import Services from './pages/Services.jsx'
import PlanEventPage from './pages/PlanEventPage.jsx'
import Contact from './pages/Contact.jsx'
import VenueSchedule from './pages/VenueSchedule.jsx'
import VendorSchedule from './pages/VendorSchedule.jsx'
import UserBookingRequestsPage from './pages/UserBookingRequestsPage.jsx'
import VenueBookingRequestsPage from './pages/VenueBookingRequestsPage.jsx'
import VendorBookingRequestsPage from './pages/VendorBookingRequestsPage.jsx'
import UserBookingsPage from './pages/UserBookingsPage.jsx'
import ServicesRequestPage from './pages/ServicesRequestPage.jsx'
import VendorServiceRequestsPage from './pages/VendorServiceRequestsPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<HomePage/>} />
      <Route path='about' element={<About/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='settings' element={<Settings/>}/>
      <Route path='services' element={<Services/>}/>
      <Route path='service-requests' element={<ServicesRequestPage/>}/>
      
      <Route path='plan-event' element={<PlanEventPage/>}/>
      <Route path='contact' element={<Contact/>}/>
      <Route path='venue'>
        <Route path='schedule' element={<VenueSchedule/>}/>
        <Route path='booking-requests' element={<VenueBookingRequestsPage/>}/>
      </Route>
       <Route path='vendor'>
        <Route path='schedule' element={<VendorSchedule/>}/>
         <Route path='booking-requests' element={<VendorBookingRequestsPage/>}/>
         <Route path='service-requests' element={<VendorServiceRequestsPage/>}/>
      </Route>
      <Route path='my-bookings' element={<UserBookingsPage/>}/>
      <Route path='booking-requests' element={<UserBookingRequestsPage/>}/>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <RouterProvider router={router}/>
  </>
  // </StrictMode>,
)
