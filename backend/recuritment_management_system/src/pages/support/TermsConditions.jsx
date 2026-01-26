import React from "react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        
        <h1 className="text-4xl font-bold text-cyan-700 mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-6">
          By accessing and using this platform, you agree to the following terms.
        </p>

        <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
        <p className="text-gray-600 mb-4">
          Users must provide accurate information and maintain the confidentiality
          of their account credentials.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Platform Usage</h2>
        <p className="text-gray-600 mb-4">
          The platform should be used only for lawful recruitment-related activities.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Account Termination</h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to suspend or terminate accounts that violate policies.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
        <p className="text-gray-600">
          Terms may be updated periodically. Continued use implies acceptance of updates.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
