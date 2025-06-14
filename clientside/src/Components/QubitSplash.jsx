// QubitSplash.jsx
import React from "react";
import "./QubitSplash.css";

const QubitSplash = () => {
  return (
    <div className="splash-container">
      <h1 className="wavy-text">
        {"QUBIT...".split("").map((char, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>
            {char}
          </span>
        ))}
      </h1>

      {/* <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div> */}
    </div>
  );
};

export default QubitSplash;
