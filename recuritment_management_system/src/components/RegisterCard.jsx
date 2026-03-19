import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const RegisterCard = ({ title, role, buttonText ,login}) => {
  // Separate states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file change
  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation
    if (!name || !email || !password) {
      setMessage("All fields are required ❌");
      setLoading(false);
      return;
    }

    try {
      // Use FormData for file upload
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      data.append("role", role);

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }
      
      const res = await axios.post(
        "http://localhost:3000/api/v1/candidates/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Registration successful ✅");
      console.log("Registered User:", res.data);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setProfilePhoto(null);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        <p className="text-center text-gray-500 mb-6">
          Register as {role}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg bg-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : buttonText}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm text-red-600">
            {message}
          </p>
        )}
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?
          <span >
            Login
          </span>
          <Link className="text-blue-600 cursor-pointer ml-1" to={login}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterCard;


