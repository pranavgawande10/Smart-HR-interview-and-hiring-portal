import React from "react";

const LoginCard = ({ title, role, buttonText }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login as {role}
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {buttonText}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Forgot password?
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
