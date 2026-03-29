/**
 * FormTextArea Component
 * Reusable textarea with character counter
 */

import React, { useState } from 'react';
import './FormTextArea.css';

const FormTextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  maxLength = null,
  rows = 4
}) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    onChange(e);
    setCharCount(e.target.value.length);
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="textarea-wrapper">
        <textarea
          id={id || name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className={`form-textarea ${error ? 'error' : ''}`}
        />

        {maxLength && (
          <span className="char-count">
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormTextArea;
