import React from 'react';

const Alert = ({ message, type = 'error', className = '' }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const selectedStyle = styles[type] || styles.error;

  return (
    <div className={`rounded-md border p-3 text-sm leading-5 font-medium ${selectedStyle} ${className}`}>
      {message}
    </div>
  );
};

export default Alert;
