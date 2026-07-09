import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '../../hooks/useReservations';
import ReservationForm from '../../components/ReservationForm';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';

const CreateReservation = () => {
  const { createReservation } = useReservations();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await createReservation(data);
      if (response.success) {
        // Navigate back to customer dashboard
        navigate('/customer', { state: { successMessage: 'Reservation booked successfully!' } });
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to book reservation. Please check table availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Book a Table
        </h2>
        <button
          onClick={() => navigate('/customer')}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
        >
          Cancel & Back
        </button>
      </div>

      <Card>
        {formError && <Alert message={formError} type="error" className="mb-4" />}
        <ReservationForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </Card>
    </div>
  );
};

export default CreateReservation;
