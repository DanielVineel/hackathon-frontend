/**
 * FormInput Component
 * Reusable form input with validation
 */

import React from 'react';
import './FormInput.css';

const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  icon = null
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'error' : ''}`}
        />
      </div>

      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormInput;
