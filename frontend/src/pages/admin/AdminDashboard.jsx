import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminReservations } from '../../hooks/useAdminReservations';
import StatisticsCards from '../../components/StatisticsCards';
import AdminReservationTable from '../../components/AdminReservationTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { reservations, loading, fetchReservations } = useAdminReservations();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Display only the 5 most recent bookings on the dashboard
  const recentReservations = reservations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Panel
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name}. You are logged in as an Administrator.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            onClick={() => navigate('/admin/reservations')}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            Manage Reservations
          </button>
        </div>
      </div>

      {/* Statistics Cards widgets */}
      {loading && reservations.length === 0 ? (
        <LoadingSpinner message="Calculating dashboard statistics..." />
      ) : (
        <StatisticsCards reservations={reservations} />
      )}

      {/* Recent Reservations Table list */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
          {reservations.length > 5 && (
            <Link
              to="/admin/reservations"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              View all bookings ({reservations.length}) &rarr;
            </Link>
          )}
        </div>

        {loading && reservations.length === 0 ? (
          <LoadingSpinner message="Loading recent bookings..." />
        ) : recentReservations.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">
            No bookings have been made yet in the system.
          </div>
        ) : (
          <AdminReservationTable
            reservations={recentReservations}
            onEditClick={(res) => navigate('/admin/reservations')}
            onCancelClick={(id) => navigate('/admin/reservations')}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
