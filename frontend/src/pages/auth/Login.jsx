import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const Login = () => {
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
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      const authData = await login(data.email, data.password);
      // Navigate based on user role
      if (authData.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData && errData.errors) {
        // Map backend validation errors back to React Hook Form
        errData.errors.forEach((validationErr) => {
          setError(validationErr.field, {
            type: 'server',
            message: validationErr.message,
          });
        });
      } else {
        setApiError(errData?.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <Card>
      <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Alert message={apiError} type="error" className="mb-4" />

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
              })}
            />
          </FormField>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create an account
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default Login;
