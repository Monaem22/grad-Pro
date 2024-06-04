import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post('https://grad-project-3zvo.onrender.com/app/auth/forgetPassword', values);
        setIsLoading(false);
        if (response.data.status === 'Success') {
          // Pass the email to the VerifyEmail component using location state
          navigate('/verify-password', { state: { email: values.email } });
        } else {
          toast.error('Unexpected response from the server');
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 rounded-lg" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '400px' }}>
        <h2 className="text-center mb-4">Forgot your Password?</h2>
        <p className="text-center mb-4">Please enter your email address and we will email you with an OTP number to reset your password.</p>
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
          <div className="text-center">
            <button disabled={!(formik.isValid && formik.dirty)} type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }} >
              {isLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Submit'}
            </button>
          </div>
          <div className="mb-3 text-center">
            <Link to="/login">
              <span>{'<'} </span>
              <span>Back to login page</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
