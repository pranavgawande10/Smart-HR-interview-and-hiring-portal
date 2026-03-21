import React from "react";
import LoginCard from "../../components/LoginCard";

const HrLogin = () => {
  return (
    <LoginCard
      title="HR Login"
      ROLE = "HR"
      role="HR"
      buttonText="Login as HR"
      route="/login/hr/forgot"
    />
  );
};

export default HrLogin;
