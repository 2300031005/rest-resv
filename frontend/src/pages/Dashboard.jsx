import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Restaurant Reservation</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'User'} ({user?.role || 'customer'})</span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 h-96 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Dashboard Content & Reservations List Coming Soon!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
