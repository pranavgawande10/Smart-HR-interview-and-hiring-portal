import React from "react";
import LoginCard from "../../components/LoginCard";

const CandidateLogin = () => {
  return (
    <LoginCard
      title="Candidate Login"
      role="Student / Candidate"
      buttonText="Login as Candidate"
      route="/login/candidate/forgot"
    />
  );
};

export default CandidateLogin;
