import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
  });

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      newPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.put('https://grad-project-3zvo.onrender.com/app/auth/resetPassword', {
          email: values.email,
          newPassword: values.newPassword,
        });
        console.log(response.data);
        navigate('/login');
        toast.success('Password reset successful!');
      } catch (error) {
        // Handle error response here
        console.error('Password reset failed:', error);
        toast.error('Password reset failed. Please try again.');
      }
      setIsLoading(false);
    },
    
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 rounded-lg" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '400px' }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password:</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className={`form-control ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="invalid-feedback">{formik.errors.newPassword}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-control ${confirmPassword !== formik.values.newPassword ? 'is-invalid' : ''}`}
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
            />
            {confirmPassword !== formik.values.newPassword && (
              <div className="invalid-feedback">Passwords do not match</div>
            )}
          </div>
          <div className="text-center">
            <button disabled={!formik.isValid || !formik.dirty || isLoading} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} >
              {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Submit'}
            </button>
          </div>
          {error && <div className='alert alert-danger'>{error}</div>}
        </form>
      </div>
    </div>
  );
}
