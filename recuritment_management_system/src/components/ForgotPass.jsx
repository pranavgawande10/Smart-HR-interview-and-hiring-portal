import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPass = ({ role }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ for redirecting to login page

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let res;

      if (role === "Candidate") {
        res = await axios.post(
          "http://localhost:3000/api/v1/auth/forgotpassword",
          { email, newPassword }
        );
      } else {
        res = await axios.post("http://localhost:3000/api/v1/auth/forgotpassword", {
          email,
          newPassword,
          role,
        });
      }

      setMessage(res?.data?.message || "Password reset successful");

      // ✅ Redirect to login page after 2 seconds
      setTimeout(() => {
        if (role === "Candidate") navigate("/login/candidate");
        else if (role === "Hr") navigate("/login/hr");
        else if (role === "Interviewer") navigate("/login/interviewer");
        else navigate("/login/admin")
      }, 2000);

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-slate-900 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-700/50">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2 outfit-font">Reset Password</h2>
        <p className="text-center text-indigo-300 font-medium mb-8">
          Enter your email and new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none mt-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-6 text-sm font-medium text-indigo-400 bg-indigo-500/10 py-2 rounded-lg border border-indigo-500/20">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;