import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const HomePage = () => {
    const navigate = useNavigate();


  return (
     <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Plan Your Events, Your Way 🎊
          </h2>
          <p className="mb-6 text-base md:text-lg">
            Event Tweak connects you with independent vendors — from caterers to decorators — so you can customize every detail of your event.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1"
          alt="Event Celebration"
          className="rounded-xl mt-8 md:mt-0 w-full md:w-1/2 shadow-lg object-cover"
        />
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Choose Event Tweak?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-center">
            <h4 className="text-lg md:text-xl font-semibold mb-3">All Vendors in One Place</h4>
            <p className="text-sm md:text-base text-gray-600">
              From caterers and decorators to DJs and photographers — find everything for your event under one roof.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-center">
            <h4 className="text-lg md:text-xl font-semibold mb-3">Customizable Packages</h4>
            <p className="text-sm md:text-base text-gray-600">
              Book multiple services together according to your unique needs and budget.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg text-center">
            <h4 className="text-lg md:text-xl font-semibold mb-3">Direct Vendor Access</h4>
            <p className="text-sm md:text-base text-gray-600">
              Connect directly with small & large independent vendors — no middlemen, no extra charges.
            </p>
          </div>
        </div>
      </section>

      {/* Example Use Case */}
      <section className="px-6 md:px-12 py-16 bg-gray-100">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <span className="text-3xl">🎂</span>
            <h4 className="text-lg font-semibold mt-3 mb-2">Choose Event</h4>
            <p className="text-sm text-gray-600">Birthday, wedding, or corporate — select the type of event you’re planning.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <span className="text-3xl">🤝</span>
            <h4 className="text-lg font-semibold mt-3 mb-2">Select Vendors</h4>
            <p className="text-sm text-gray-600">Pick caterers, decorators, photographers & more — all in one booking.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <span className="text-3xl">🎉</span>
            <h4 className="text-lg font-semibold mt-3 mb-2">Enjoy Event</h4>
            <p className="text-sm text-gray-600">Sit back and relax while trusted vendors make your event unforgettable.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Make Your Celebrations Memorable ✨</h3>
        <p className="mb-6 text-base md:text-lg">Register today and book trusted vendors for your next event.</p>
        <button onClick={()=>{navigate('/plan-event')}} className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-medium hover:bg-gray-100 w-full md:w-auto">
          Get Started
        </button>
      </section>
    </div>
  )
}

export default HomePage
