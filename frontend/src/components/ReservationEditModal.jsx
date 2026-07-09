import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormField from './ui/FormField';
import Input from './ui/Input';
import Button from './ui/Button';

const ReservationEditModal = ({ isOpen, reservation, onConfirm, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when modal opens or reservation changes
  useEffect(() => {
    if (reservation) {
      const formattedDate = new Date(reservation.reservationDate).toISOString().split('T')[0];
      reset({
        reservationDate: formattedDate,
        timeSlot: reservation.timeSlot,
        guestCount: reservation.guestCount,
        status: reservation.status,
      });
    }
  }, [reservation, reset]);

  if (!isOpen || !reservation) return null;

  const handleFormSubmit = (data) => {
    onConfirm(data);
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={onCancel}></div>

      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-bold leading-6 text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Edit Reservation (ID: {reservation._id.slice(-6)})
              </h3>

              <div className="space-y-4">
                <FormField label="Reservation Date" error={errors.reservationDate?.message}>
                  <Input
                    type="date"
                    min={getTomorrowString()}
                    error={!!errors.reservationDate}
                    {...register('reservationDate', {
                      required: 'Please select a reservation date.',
                      validate: (val) => {
                        const selectedDate = new Date(val);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (selectedDate <= today) {
                          return 'Reservation date must be a future date.';
                        }
                        return true;
                      },
                    })}
                  />
                </FormField>

                <FormField label="Time Slot" error={errors.timeSlot?.message}>
                  <select
                    className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.timeSlot ? 'ring-red-300 focus:ring-red-500' : ''
                    }`}
                    {...register('timeSlot', {
                      required: 'Please select a time slot.',
                    })}
                  >
                    <option value="12:00-14:00">12:00 - 14:00</option>
                    <option value="14:00-16:00">14:00 - 16:00</option>
                    <option value="18:00-20:00">18:00 - 20:00</option>
                    <option value="20:00-22:00">20:00 - 22:00</option>
                  </select>
                </FormField>

                <FormField label="Guest Count" error={errors.guestCount?.message}>
                  <Input
                    type="number"
                    min={1}
                    max={8}
                    error={!!errors.guestCount}
                    {...register('guestCount', {
                      required: 'Please enter guest count.',
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: 'Guest count must be at least 1.',
                      },
                      max: {
                        value: 8,
                        message: 'Guest count cannot exceed largest table capacity of 8.',
                      },
                    })}
                  />
                </FormField>

                <FormField label="Reservation Status" error={errors.status?.message}>
                  <select
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('status', {
                      required: 'Please select a status.',
                    })}
                  >
                    <option value="BOOKED">BOOKED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </FormField>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto sm:ml-3"
              >
                {isSubmitting ? 'Saving changes...' : 'Save Changes'}
              </Button>
              <button
                type="button"
                onClick={onCancel}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationEditModal;
