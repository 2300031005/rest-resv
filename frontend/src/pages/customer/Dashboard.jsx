import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReservations } from '../../hooks/useReservations';
import ReservationCard from '../../components/ReservationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

const Dashboard = () => {
  const { user } = useAuth();
  const { reservations, loading, fetchReservations } = useReservations();
  const navigate = useNavigate();
  const location = useLocation();

  const successMsg = location.state?.successMessage || '';

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Display only the 2 most recent bookings on the dashboard
  const recentReservations = reservations.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your dining bookings and explore table availabilities.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <button
            onClick={() => navigate('/customer/create')}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            Book Reservation
          </button>
          <button
            onClick={() => navigate('/customer/reservations')}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            View All Bookings
          </button>
        </div>
      </div>

      {successMsg && <Alert message={successMsg} type="success" />}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900">Your Stats</h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Bookings</p>
                <p className="text-2xl font-extrabold text-indigo-600">{reservations.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Bookings</p>
                <p className="text-2xl font-extrabold text-green-600">
                  {reservations.filter((r) => r.status === 'BOOKED').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Recent Reservations list */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
              {reservations.length > 2 && (
                <Link
                  to="/customer/reservations"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  View all ({reservations.length})
                </Link>
              )}
            </div>

            {loading ? (
              <LoadingSpinner message="Loading recent bookings..." />
            ) : recentReservations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">You don't have any bookings yet.</p>
                <Link
                  to="/customer/create"
                  className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Book your first table now &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReservations.map((res) => (
                  <ReservationCard key={res._id} reservation={res} />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
