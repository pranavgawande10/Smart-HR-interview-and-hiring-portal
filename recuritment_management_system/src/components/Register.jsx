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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-700/50">

        <h2 className="text-3xl font-extrabold text-white text-center mb-2 outfit-font">
          {title}
        </h2>

        <p className="text-center text-indigo-300 font-medium mb-8">
          Register as {ROLE}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          {/* HR FIELD */}
          {role === "HR" && (
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              <input
                type="number"
                placeholder="Experience (Years)"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none mt-2"
          >
            {loading ? "Registering..." : buttonText}
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-sm font-medium text-rose-400 bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
            {message}
          </p>
        )}

        <p className="text-sm text-center text-slate-400 mt-6">
          Already have an account?
          <Link to={login} className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors ml-1">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterInterviewer;