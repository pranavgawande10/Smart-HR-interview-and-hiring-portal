import React from "react";
import RegisterCard from "../../components/RegisterCard";

const InterviewerRegister = () => {
  return (
    <RegisterCard
      title="Interviewer Registration"
      role="INTERVIEWER"
      ROLE="Interviewer"
      buttonText="Register as Interviewer"
      login="/login/interviewer"
      fields={[
        { type: "text", placeholder: "Full Name" },
        { type: "email", placeholder: "Email Address" },
        { type: "password", placeholder: "Password" },
      ]}
    />
  );
};

export default InterviewerRegister;
