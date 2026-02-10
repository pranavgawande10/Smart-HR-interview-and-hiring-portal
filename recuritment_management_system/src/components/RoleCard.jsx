import React from "react";
import { Link } from "react-router-dom";

const RoleCard = ({ title, description ,login}) => {
  return (

    <Link to={login} >
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div></Link>
  );
};

export default RoleCard;
