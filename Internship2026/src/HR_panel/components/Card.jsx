import { useState } from "react";
import { Bookmark } from "lucide-react";

const Card = ({
  company,
  post,
  tag1,
  tag2,
  datePosted,
  pay,
  location,
  brandLogo,
}) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="card">
      {/* TOP */}
      <div className="top">
        <img src={brandLogo} alt={company} />

        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={14} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* CENTER */}
      <div className="center">
        <h3>
          {company} <span>{datePosted}</span>
        </h3>

        <h2>{post}</h2>

        <div className="tag">
          <span>{tag1}</span>
          <span>{tag2}</span>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom">
        <div>
          <h3>₹{pay}/hr</h3>
          <p>{location}</p>
        </div>

        <button className="apply-btn">Apply Now</button>
      </div>
    </div>
  );
};

export default Card;
