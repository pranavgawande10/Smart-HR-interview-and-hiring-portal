import React from "react";
import RegisterCard from "../../components/RegisterCard";

const InterviewerRegister = () => {
  return (
    <RegisterCard
      title="Interviewer Registration"
      role="Interviewer"
      buttonText="Register as Interviewer"
      login='/login/interviewer'
      fields={[
        { type: "text", placeholder: "Full Name" },
        { type: "email", placeholder: "Email Address" },
        { type: "text", placeholder: "Expertise / Domain" },
        { type: "password", placeholder: "Password" },
      ]}
    />
  );
};

export default InterviewerRegister;
