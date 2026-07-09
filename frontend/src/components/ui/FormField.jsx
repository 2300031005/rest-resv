import React from 'react';

const FormField = ({ label, error, children, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
