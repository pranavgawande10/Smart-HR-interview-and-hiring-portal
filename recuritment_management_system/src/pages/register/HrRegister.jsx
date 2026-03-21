<<<<<<< HEAD
import React from "react";
import RegisterCard from "../../components/RegisterCard";

const HrRegister = () => {
  return (
    <RegisterCard
      title="HR Registration"
      role="HR Manager"
=======
import Register from '../../components/Register'
const HrRegister = () => {
  return (
    <Register
     title="HR Registration"
      role="HR"
      ROLE="HR"
>>>>>>> 691fa71 (connect frontend to server)
      buttonText="Register as HR"
      login = '/login/hr'
      fields={[
        { type: "text", placeholder: "Full Name" },
        { type: "email", placeholder: "Email Address" },
        { type: "password", placeholder: "Password" },
      ]}
    />
  );
};

export default HrRegister;
