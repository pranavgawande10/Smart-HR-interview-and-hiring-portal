import React from "react";
import LoginCard from "../../components/LoginCard";

const InterviewerLogin = () => {
  return (
    <LoginCard
      title="Interviewer Login"
      role="Interviewer"
      buttonText="Login as Interviewer"
      route="/login/interviewer/forgot"
    />
  );
};

export default InterviewerLogin;
