// components/OptionLinks.jsx
import React from "react";

const OptionLinks = ({ options, handleLinkClick }) => {
  return (
    <nav className="options-nav">
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <a
              href={`/${option.path}`}
              onClick={handleLinkClick(option.path)}
              className="option-link"
            >
              <img src={option.image} alt={option.title} className="option-image" />
              <div className="option-content">
                <h3 className="option-title">{option.title}</h3>
                <p className="option-description">{option.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default OptionLinks;