import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-gray-500 sm:px-6 lg:px-8">
          &copy; 2026 Restaurant Reservation System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
