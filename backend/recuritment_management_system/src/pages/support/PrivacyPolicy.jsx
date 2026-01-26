import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        
        <h1 className="text-4xl font-bold text-cyan-700 mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-6">
          We value your privacy and are committed to protecting your personal data.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
        <p className="text-gray-600 mb-4">
          We collect personal details such as name, email, resume information,
          and professional details for recruitment purposes.
        </p>

        <h2 className="text-2xl font-semibold mb-2">How We Use Information</h2>
        <p className="text-gray-600 mb-4">
          Information is used to manage recruitment processes, schedule interviews,
          and communicate updates.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
        <p className="text-gray-600 mb-4">
          We implement industry-standard security measures to protect your data.
        </p>

        <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, update, or delete your personal information.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

