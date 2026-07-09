import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as apiRegister } from '../../api/auth.api';
import Card from '../../components/ui/Card';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      // 1. Trigger registration API call
      const regResponse = await apiRegister(data.name, data.email, data.password);
      
      if (regResponse.success) {
        // 2. Perform automatic login upon successful registration
        await login(data.email, data.password);
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData && errData.errors) {
        // Map backend validation errors back to fields
        errData.errors.forEach((validationErr) => {
          setError(validationErr.field, {
            type: 'server',
            message: validationErr.message,
          });
        });
      } else {
        setApiError(errData?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <Card>
      <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create a new account
      </h2>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Alert message={apiError} type="error" className="mb-4" />

          <FormField label="Full Name" error={errors.name?.message}>
            <Input
              type="text"
              placeholder="John Doe"
              error={!!errors.name}
              {...register('name', {
                required: 'Name is required.',
              })}
            />
          </FormField>

          <FormField label="Email address" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email.',
                },
              })}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', {
                required: 'Password is required.',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters.',
                },
              })}
            />
          </FormField>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default Register;
