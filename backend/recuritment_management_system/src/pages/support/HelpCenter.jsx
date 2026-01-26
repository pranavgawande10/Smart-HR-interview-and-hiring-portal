import React from "react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-700 mb-6 text-center">
          Help Center
        </h1>

        <p className="text-gray-600 text-center mb-12">
          Find answers to common questions and get support
        </p>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              How do I create an account?
            </h2>
            <p className="text-gray-600">
              Click on the Register button and choose your role (HR, Interviewer,
              or Candidate) to create an account.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              How can I apply for a job?
            </h2>
            <p className="text-gray-600">
              Candidates can browse job listings and apply directly after logging in.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              How do I schedule interviews?
            </h2>
            <p className="text-gray-600">
              HR users can assign interviewers and schedule interviews from the dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Need more help?
            </h2>
            <p className="text-gray-600">
              Contact our support team via the Contact page for further assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
