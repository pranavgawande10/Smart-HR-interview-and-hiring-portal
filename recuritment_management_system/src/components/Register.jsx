import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterInterviewer = ({ title, role, buttonText, login, ROLE }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // ✅ Basic validation
    if (!name || !email || !password) {
      setMessage("All fields are required ❌");
      setLoading(false);
      return;
    }

    // ✅ Role-based validation
    if (role === "HR" && !companyName) {
      setMessage("Company name is required ❌");
      setLoading(false);
      return;
    }

    if (role === "INTERVIEWER" && (!skills || !experienceYears)) {
      setMessage("Skills and experience are required ❌");
      setLoading(false);
      return;
    }

    try {
      // ✅ Prepare data based on role
      const data = {
        name,
        email,
        password,
        role,
      };

      if (role === "HR") {
        data.companyName = companyName;
      }

      if (role === "INTERVIEWER") {
        data.skills = skills.split(",");
        data.experienceYears = Number(experienceYears);
      }

      await axios.post("http://localhost:3000/signup", data);

      setMessage("Registration successful ✅");

      setName("");
      setEmail("");
      setPassword("");
      setSkills("");
      setExperienceYears("");
      setCompanyName("");

      // ✅ Redirect
      setTimeout(() => {
        navigate(login);
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">

        <h2 className="text-3xl font-bold text-center text-gray-800">
          {title}
        </h2>

        <p className="text-center text-gray-500 mt-1 mb-6">
          Register as <span className="font-semibold text-blue-600">{ROLE}</span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* HR FIELD */}
          {role === "HR" && (
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}

          {/* INTERVIEWER FIELDS */}
          {role === "INTERVIEWER" && (
            <>
              <input
                type="text"
                placeholder="Skills (React, Node, JS)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                placeholder="Experience (Years)"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            {loading ? "Registering..." : buttonText}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-500">
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-500 mt-5">
          Already have an account?
          <Link to={login} className="text-blue-600 ml-1">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterInterviewer;