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
          "http://localhost:3001/api/v1/candidates/forget-password",
          { email, newPassword }
        );
      } else if (role === "Hr" || role === "Interviewer") {
        res = await axios.post("http://localhost:3000/forgotpassword", {
          email,
          newPassword,
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
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email and new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            className="border w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;