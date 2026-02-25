// components/OptionsSection.jsx
import React from "react";

const OptionsSection = ({ options, handleLinkClick }) => {
  return (
    <div className="options-grid">
      {options.map((option, index) => (
        <div key={index} className="option-card" onClick={handleLinkClick(option.path)}>
          <img src={option.image} alt={option.title} className="option-image" />
          <div className="option-content">
            <h3 className="option-title">{option.title}</h3>
            <p className="option-description">{option.description}</p>
            <button className="option-button" onClick={handleLinkClick(option.path)}>
              Ver más
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionsSection;