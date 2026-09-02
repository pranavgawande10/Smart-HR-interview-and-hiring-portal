import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-700 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          We’d love to hear from you. Get in touch with us
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Contact Information
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li><strong>Email:</strong> support@recruitmentsystem.com</li>
            <li><strong>Phone:</strong> +91 98765 43210</li>
            <li><strong>Address:</strong> Pune, Maharashtra, India</li>
          </ul>

          <p className="mt-6 text-gray-600">
            Our support team is available Monday to Friday, 9 AM – 6 PM.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Send a Message
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
            ></textarea>

            <button
              type="submit"
              className="bg-cyan-700 text-white px-6 py-2 rounded-lg hover:bg-cyan-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
