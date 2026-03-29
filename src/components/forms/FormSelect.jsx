/**
 * FormSelect Component
 * Reusable select dropdown with validation
 */

import React from 'react';
import './FormSelect.css';

const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  hint,
  disabled = false,
  required = false,
  multiple = false
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        multiple={multiple}
        className={`form-select ${error ? 'error' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label || option.value}
          </option>
        ))}
      </select>

      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormSelect;
