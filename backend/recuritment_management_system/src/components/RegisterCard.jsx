import React from "react";
import { Link } from "react-router-dom";

const RegisterCard = ({ title, role, fields, buttonText ,login}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register as {role}
        </p>

        <form className="space-y-4">
          {fields.map((field, index) => (
            <input
              key={index}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {buttonText}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <Link className="text-blue-600 cursor-pointer" to={login} >Login</Link>
        </p>
        
      </div>
    </div>
  );
};

export default RegisterCard;
