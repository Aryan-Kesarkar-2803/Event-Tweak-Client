
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button } from "@mui/material";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 px-6 md:px-16 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          We’d love to hear from you! Get in touch for any queries or suggestions.
        </p>
      </motion.div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Whether you have a question, need assistance, or just want to say hi — 
            we’re here to help you make your event planning experience smoother and smarter.
          </p>

          <div className="space-y-4">
            <p>
              <span className="font-semibold text-blue-700">Email:</span>{" "}
              aryankesarkar03@gmail.com
            </p>
            <p>
              <span className="font-semibold text-blue-700">Phone:</span>{" "}
              +91 9767445521
            </p>
            <p>
              <span className="font-semibold text-blue-700">Address:</span>{" "}
              Pune, Maharashtra
            </p>
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-6">
            Send a Message
          </h3>

          <div className="space-y-5">
            <TextField
              label="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </div>

          <Button
            // type="submit"
            disabled={true}
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              bgcolor: "#2563EB",
              "&:hover": { bgcolor: "#1E40AF" },
              borderRadius: "9999px",
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Send Message
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;

