import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
            SMART-HR
          </h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Building modern web experiences with React & Tailwind CSS.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <Link className="hover:text-white hover:translate-x-1 transition" to="/">Home</Link>
            <Link className="hover:text-white hover:translate-x-1 transition" to="/about">About</Link>
            <Link className="hover:text-white hover:translate-x-1 transition" to="/services">Services</Link>
            <Link className="hover:text-white hover:translate-x-1 transition" to="/contact">Contact</Link>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <Link className="hover:text-white hover:translate-x-1 transition" to="/support/helpcenter">Help Center</Link>
            <Link className="hover:text-white hover:translate-x-1 transition" to="/support/privacypolicy">Privacy Policy</Link>
            <Link className="hover:text-white hover:translate-x-1 transition" to="/support/termscondition">Terms & Conditions</Link>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <span className="cursor-pointer hover:text-blue-400 hover:scale-110 transition">🌐</span>
            <span className="cursor-pointer hover:text-blue-400 hover:scale-110 transition">🐦</span>
            <span className="cursor-pointer hover:text-pink-400 hover:scale-110 transition">📸</span>
            <span className="cursor-pointer hover:text-blue-500 hover:scale-110 transition">💼</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-medium">SMART-HR</span>. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;