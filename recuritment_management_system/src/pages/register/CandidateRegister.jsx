import React from "react";
import RegisterCard from "../../components/RegisterCard";

const CandidateRegister = () => {
  return (
    <RegisterCard
      title="Candidate Registration"
      role="Candidate"
      buttonText="Register as Candidate"
      login='/login/candidate'
      fields={[
        { type: "text", placeholder: "Full Name" },
        { type: "email", placeholder: "Email Address" },
        { type: "password", placeholder: "Password" },
      ]}
    />
  );
};

export default CandidateRegister;
