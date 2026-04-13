import React, { useState } from "react";
import axios from "axios";
import { Link , useNavigate} from "react-router-dom";
const LoginCard = ({ title, role, buttonText, route , ROLE }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRedirectPath = () => {
    if (role === "HR" || ROLE === "HR") return "/hr";
    if (role === "INTERVIEWER" || ROLE === "Interviewer") return "/interviewer";
    if (role === "CANDIDATE" || ROLE === "Candidate") return "/candidate";
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); 
    
    try {

      let res;
      if (role === "Candidate") { 
        res = await axios.post(
          "http://localhost:3001/api/v1/candidates/login",
          { email, password }
        );
      } else if (role === "Interviewer" || role === "HR Manager") {
        res = await axios.post(
          "http://localhost:3000/login",
          { email, password ,role}
        );
      }

      setMessage("Login successful ✅");

      const token =
        res?.data?.token ??
        res?.data?.accessToken ??
        res?.data?.data?.token ??
        res?.data?.data?.accessToken ??
        "authenticated_dummy_token";

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || ROLE);
      }
      
      const userName = res?.data?.name ?? res?.data?.user?.name ?? res?.data?.data?.name ?? res?.data?.candidate?.name ?? (role || ROLE);
      localStorage.setItem("userName", userName);

      // Always redirect after a successful login response
      navigate(getRedirectPath());

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login as {role}
        </p>
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        <p className="text-center text-gray-500 mb-6">Login as {ROLE}</p>
      <div className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-700/50">

        <h2 className="text-3xl font-extrabold text-white text-center mb-2 outfit-font">{title}</h2>
        <p className="text-center text-indigo-300 font-medium mb-8">Login as {ROLE}</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:shadow-none mt-2"
          >
            {loading ? "Logging in..." : buttonText}
          </button>
        </form>

        {message && (
          // <p className="text-center mt-4 text-sm text-red-600">
          //   {message}
          // </p>
          // <p className="text-center mt-6 text-sm font-medium text-rose-400 bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{message}</p>
        )}

        <p className="text-center text-sm text-slate-400 mt-6">
          <Link to={route} className="hover:text-indigo-400 font-medium transition-colors">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;

