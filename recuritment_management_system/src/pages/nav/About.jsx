import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      
      {/* Heading */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-700 mb-4">
          About Us
        </h1>
        <p className="text-gray-600 text-lg">
          Building a smarter way to manage recruitment and hiring
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Text */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            What is Recruitment Management System?
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Our Recruitment Management System is designed to simplify the hiring
            process for companies, HR professionals, interviewers, and candidates.
            It provides a centralized platform to manage job postings, applications,
            interviews, and candidate evaluations efficiently.
          </p>

          <p className="text-gray-600 leading-relaxed">
            This system helps organizations save time, improve hiring decisions,
            and deliver a seamless experience to both recruiters and applicants.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-cyan-700">
            Key Features
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>✔ Role-based login (Admin, HR, Interviewer, Candidate)</li>
            <li>✔ Job posting and application tracking</li>
            <li>✔ Interview scheduling and feedback</li>
            <li>✔ Secure and scalable system</li>
            <li>✔ User-friendly and responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
