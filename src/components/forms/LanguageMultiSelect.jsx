import React, { useState, useEffect, useRef } from "react";
import API from "../../api/api";
import "./LanguageMultiSelect.css";

/**
 * Multi-select component for choosing Judge0 languages
 * @param {Array} selectedLanguages - Array of selected language IDs
 * @param {Function} onChange - Callback when selection changes
 * @param {string} role - User role (superadmin or manager)
 */
const LanguageMultiSelect = ({ selectedLanguages = [], onChange, role = "superadmin" }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * Fetch available languages from backend
   */
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const endpoint = role === "superadmin" 
          ? "/superadmin/languages/available"
          : "/manager/languages/available";
        
        const res = await API.get(endpoint);
        setLanguages(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching languages:", err);
        // Fallback languages
        setLanguages([
          { id: 54, name: "C++ (g++)" },
          { id: 50, name: "C (gcc)" },
          { id: 62, name: "Java" },
          { id: 63, name: "JavaScript (Node.js)" },
          { id: 71, name: "Python 3" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [role]);

  /**
   * Handle language selection/deselection
   */
  const handleToggleLanguage = (languageId) => {
    const newSelection = selectedLanguages.includes(languageId)
      ? selectedLanguages.filter(id => id !== languageId)
      : [...selectedLanguages, languageId];
    
    onChange(newSelection);
  };

  /**
   * Get selected language names
   */
  const getSelectedLanguageNames = () => {
    return selectedLanguages
      .map(id => languages.find(lang => lang.id === id)?.name)
      .filter(Boolean);
  };

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="language-multi-select loading">Loading languages...</div>;
  }

  const selectedNames = getSelectedLanguageNames();

  return (
    <div className="language-multi-select" ref={dropdownRef}>
      <div className="select-trigger" onClick={() => setShowDropdown(!showDropdown)}>
        <div className="selected-languages">
          {selectedNames.length > 0 ? (
            <>
              <span className="count-badge">{selectedNames.length}</span>
              <span className="selected-text">
                {selectedNames.slice(0, 2).join(", ")}
                {selectedNames.length > 2 && ` +${selectedNames.length - 2}`}
              </span>
            </>
          ) : (
            <span className="placeholder">Select languages...</span>
          )}
        </div>
        <span className={`dropdown-icon ${showDropdown ? "open" : ""}`}>▼</span>
      </div>

      {showDropdown && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <label>
              <input
                type="checkbox"
                checked={selectedLanguages.length === languages.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange(languages.map(lang => lang.id));
                  } else {
                    onChange([]);
                  }
                }}
              />
              Select All
            </label>
          </div>

          <div className="dropdown-options">
            {languages.map(language => (
              <label key={language.id} className="option">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language.id)}
                  onChange={() => handleToggleLanguage(language.id)}
                />
                <span className="option-name">{language.name}</span>
              </label>
            ))}
          </div>

          {selectedNames.length > 0 && (
            <div className="dropdown-footer">
              <span className="selected-count">
                {selectedNames.length} language{selectedNames.length !== 1 ? "s" : ""} selected
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageMultiSelect;
