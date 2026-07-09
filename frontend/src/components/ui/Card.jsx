import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
