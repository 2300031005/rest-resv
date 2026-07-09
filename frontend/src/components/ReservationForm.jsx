import React from 'react';
import { useForm } from 'react-hook-form';
import FormField from './ui/FormField';
import Input from './ui/Input';
import Button from './ui/Button';

const ReservationForm = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reservationDate: '',
      timeSlot: '',
      guestCount: 1,
    },
  });

  // Get tomorrow's date string (YYYY-MM-DD) for min date validation in input
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <option value="">Select a time slot</option>
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Booking Reservation...' : 'Book Reservation'}
      </Button>
    </form>
  );
};

export default ReservationForm;
