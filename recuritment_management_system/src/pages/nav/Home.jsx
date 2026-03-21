import React from "react";
import RoleCard from "../../components/RoleCard";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Recruitment Management System
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Manage hiring, interviews, and candidates efficiently in one platform
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}
    <h2 className="text-4xl font-bold text-center mb-14 text-gray-800">
      User Roles
    </h2>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {[
        {
          title: "Admin",
          desc: "Manage users, roles, and system settings",
          login: "/login/admin",
        },
        {
          title: "HR",
          desc: "Post jobs, shortlist candidates, schedule interviews",
          login: "/login/hr",
        },
        {
          title: "Interviewer",
          desc: "Evaluate candidates and Take Interview",
          login: "/login/interviewer",
        },
        {
          title: "Candidate",
          desc: "Apply for jobs and track application status",
          login: "/login/candidate",
        },
      ].map((role, i) => (

        <Link
          to={role.login}
          key={i}
          className="block bg-white rounded-2xl p-6 shadow-md border border-gray-200 
                     hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 
                     transition duration-300 group cursor-pointer"
        >

          {/* Icon */}
          <div className="text-4xl mb-4 group-hover:scale-110 transition">
            {role.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {role.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm">
            {role.desc}
          </p>

        </Link>

      ))}

    </div>
  </div>
</section>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-12 bg-gray-50">

        {[
          { num: "120+", label: "Jobs Posted" },
          { num: "500+", label: "Candidates" },
          { num: "80+", label: "Companies" },
          { num: "95%", label: "Hiring Success" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <h2 className="text-3xl font-bold text-blue-600">{item.num}</h2>
            <p className="text-gray-500 mt-2">{item.label}</p>
          </div>
        ))}

      </div>

      {/* Call To Action */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-16 text-center">

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Start Hiring Smarter Today
        </h1>

        <p className="text-lg text-blue-100 mb-8">
          Simplify your recruitment process with our system
        </p>

        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 hover:bg-gray-100 transition duration-300">
          Register Now
        </button>

      </div>
    </div>
  );
};

export default Home;
