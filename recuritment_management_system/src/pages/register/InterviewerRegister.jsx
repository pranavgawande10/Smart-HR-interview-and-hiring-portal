<<<<<<< HEAD
import React from "react";
import RegisterCard from "../../components/RegisterCard";
=======
import { Link } from "react-router-dom";

import RegisterInterviewer from '../../components/Register'
>>>>>>> 691fa71 (connect frontend to server)

const InterviewerRegister = () => {
  return (
    <RegisterCard
      title="Interviewer Registration"
      ROLE = "Interviewer"
      role="INTERVIEWER"
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
