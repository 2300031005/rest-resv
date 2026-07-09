import React, { forwardRef } from 'react';

const Input = forwardRef(({ type = 'text', name, placeholder, className = '', error, ...props }, ref) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      ref={ref}
      className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
        error ? 'ring-red-300 focus:ring-red-500' : ''
      } ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
