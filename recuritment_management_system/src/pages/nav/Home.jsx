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
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            User Roles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <RoleCard
              title="Admin"
              description="Manage users, roles, and system settings"
              login="/login/admin"
            />
            <RoleCard
              title="HR"
              description="Post jobs, shortlist candidates, schedule interviews"
              login="/login/hr"
            />
            <RoleCard
              title="Interviewer"
              description="Evaluate candidates and provide feedback"
              login="/login/interviewer"
            />
            <RoleCard
              title="Candidate"
              description="Apply for jobs and track application status"
              login="/login/candidate"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-blue-600">120+</h3>
            <p className="text-gray-600">Jobs Posted</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">500+</h3>
            <p className="text-gray-600">Candidates</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">80+</h3>
            <p className="text-gray-600">Companies</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-600">95%</h3>
            <p className="text-gray-600">Hiring Success</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Hiring Smarter Today
        </h2>
        <p className="mb-6">
          Simplify your recruitment process with our system
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Register Now
        </button>
      </section>

    </div>
  );
};

export default Home;
