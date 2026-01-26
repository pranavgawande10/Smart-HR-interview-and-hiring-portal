import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">MyApp</h2>
          <p className="mt-3 text-sm text-gray-400">
            Building modern web experiences with React & Tailwind CSS.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <Link className="hover:text-white cursor-pointer" to='/'>Home</Link>
            <Link className="hover:text-white cursor-pointer" to='/about'>About</Link>
            <Link className="hover:text-white cursor-pointer" to='/services'>Services</Link>
            <Link className="hover:text-white cursor-pointer" to='contact'>Contact</Link>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <Link className="hover:text-white cursor-pointer" to='/support/helpcenter'>Help Center</Link>
            <Link className="hover:text-white cursor-pointer" to='/support/privacypolicy'>Privacy PoLinkcy</Link>
            <Link className="hover:text-white cursor-pointer" to='/support/termscondition'>Terms & Conditions</Link>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl " >
            <span className="cursor-pointer hover:text-white">🌐</span>
            <span className="cursor-pointer hover:text-white">🐦</span>
            <span className="cursor-pointer hover:text-white">📸</span>
            <span className="cursor-pointer hover:text-white">💼</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
