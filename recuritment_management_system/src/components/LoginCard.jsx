import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const LoginCard = ({ title, role, buttonText, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); 
    
    try {

      let res;
      if (role === "Candidate") { 
        res = await axios.post(
          "http://localhost:3001/api/v1/candidates/login",
          { email, password, role }
        );
      } else if (role === "Interviewer" || role === "HR Manager") {
        res = await axios.post(
          "http://localhost:3000/login",
          { email, password }
        );
      }

      setMessage("Login successful ✅");

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
      }

      console.log("User Data:", res.data);


    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Login failed ❌");
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
          Login as {role}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : buttonText}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-600">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to={route} >Forgot password </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;

