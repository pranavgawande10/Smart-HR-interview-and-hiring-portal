import React, { useState } from "react";
import axios from "axios";

const RegisterCard = ({ title, role, fields, buttonText }) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e, name) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/candidates",
        {
          role,
          ...formData,
        }
      );
      

      setMessage("Registration successful ✅");
      console.log("Registered User:", res.data);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Registration failed ❌");
      } else {
        setMessage("Server not reachable ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register as {role}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <input
              key={index}
              type={field.type}
              placeholder={field.placeholder}
              required
              onChange={(e) => handleChange(e, field.name)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : buttonText}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-600">
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? 
          <span className="text-blue-600 cursor-pointer ml-1">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterCard;
