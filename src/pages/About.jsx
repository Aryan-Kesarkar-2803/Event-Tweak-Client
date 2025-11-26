
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 px-6 md:px-16 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          About Event Tweak
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Plan, personalize, and perfect your events effortlessly.
        </p>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mb-12"
      >
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">
          Our Story
        </h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          Event Tweak was created with a simple idea — to make event planning easy,
          transparent, and fun. Whether you’re organizing a wedding, birthday,
          corporate event, or a small gathering, we help you find trusted vendors,
          compare services, and design your perfect celebration in just a few clicks.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {[
          {
            title: "Seamless Planning",
            desc: "Plan your event step-by-step with smart tools and an intuitive interface.",
          },
          {
            title: "Verified Vendors",
            desc: "Choose from top-rated venues, decorators, and service providers.",
          },
          {
            title: "Smart Budgeting",
            desc: "Stay within budget with transparent pricing and instant comparisons.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl p-6 border-t-4 border-blue-500"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Start Planning Your Dream Event Today!
        </h2>
        <button
        onClick={()=>{navigate('/plan-event')}}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg transition-all duration-300">
          Plan an Event
        </button>
      </motion.div>
    </div>
  );
};

export default About;
