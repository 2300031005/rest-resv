import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <Card>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Welcome, Administrator {user?.name}!
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              This is the administrative control panel. Future phases will implement full reservation listings, date filtering, and status update tools.
            </p>
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Admin Email</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user?.email}</dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Role Authority</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">{user?.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
