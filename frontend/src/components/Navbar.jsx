import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getActiveLinkStyle = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to={user?.role === 'admin' ? '/admin' : '/customer'} className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 tracking-tight">
                Restaurant Resv
              </span>
            </Link>
            {user && user.role === 'customer' && (
              <div className="hidden sm:flex sm:space-x-4">
                <NavLink to="/customer" end className={getActiveLinkStyle}>
                  Dashboard
                </NavLink>
                <NavLink to="/customer/create" className={getActiveLinkStyle}>
                  Book Table
                </NavLink>
                <NavLink to="/customer/reservations" className={getActiveLinkStyle}>
                  My Bookings
                </NavLink>
              </div>
            )}
            {user && user.role === 'admin' && (
              <div className="hidden sm:flex sm:space-x-4">
                <NavLink to="/admin" end className={getActiveLinkStyle}>
                  Admin Panel
                </NavLink>
                <NavLink to="/admin/reservations" className={getActiveLinkStyle}>
                  Manage Bookings
                </NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {user && (
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none transition duration-150 ease-in-out cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
