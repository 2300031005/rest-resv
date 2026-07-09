import React from 'react';

const Loader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-sm font-medium text-gray-500">Loading details...</p>
      </div>
    </div>
  );
};

export default Loader;
