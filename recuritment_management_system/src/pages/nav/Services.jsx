import React from "react";

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-700 mb-4">
          Our Services
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive recruitment solutions for modern organizations
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Job Posting & Management
          </h3>
          <p className="text-gray-600">
            HR professionals can post jobs, manage listings, and track applications
            in real-time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Candidate Tracking
          </h3>
          <p className="text-gray-600">
            Track candidate progress from application to final selection seamlessly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Interview Scheduling
          </h3>
          <p className="text-gray-600">
            Schedule interviews, assign interviewers, and manage feedback efficiently.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Role-Based Access
          </h3>
          <p className="text-gray-600">
            Secure access for HR, Interviewers, and Candidates based on roles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Analytics & Reports
          </h3>
          <p className="text-gray-600">
            Gain insights with recruitment analytics and performance reports.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Secure Data Management
          </h3>
          <p className="text-gray-600">
            Ensures secure handling of candidate and company data.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Services;
