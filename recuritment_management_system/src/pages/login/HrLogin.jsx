import React from "react";
import LoginCard from "../../components/LoginCard";

const HrLogin = () => {
  return (
    <LoginCard
      title="HR Login"
      role="HR Manager"
      buttonText="Login as HR"
      route="/login/hr/forgot"
    />
  );
};

export default HrLogin;
