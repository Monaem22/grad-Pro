import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const validationSchema = Yup.object({
  otp1: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
  otp2: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
  otp3: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
  otp4: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
  otp5: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
  otp6: Yup.string().required('Required').length(1, 'Must be exactly 1 character'),
});

export default function VerifyEmail() {
  const location = useLocation();
  const [timerCount, setTimerCount] = useState(20);
  const [disableResend, setDisableResend] = useState(true);
  const [error, setError] = useState(null);
  const email = location.state.email || ''; // Get email from location state or set default value

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          setDisableResend(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerCount === 0) {
      setDisableResend(false);
    }
  }, [timerCount]);

  const otpRefs = useRef([]);

  const formik = useFormik({
    initialValues: {
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const enteredOTP = Object.values(values).join('');
        const response = await axios.post('https://grad-project-3zvo.onrender.com/app/auth/verifyRestCode', {
          resetCode: enteredOTP,
        });
    
        if (response.data.status === 'Success') {
          navigate('/ResetPassword');
        } else {
          if (response.data.message === 'Reset code invalid or expired') {
            setError('The reset code is invalid or expired.');
          } else {
            setError(response.data.message);
          }
        }
      } catch (error) {
        console.error(error);
        setError('Error verifying email.');
      }
    },
  });

  const focusNextInput = (index) => {
    if (otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const resendOTP = async () => {
    if (disableResend) return;
    try {
      await axios.post('https://grad-project-3zvo.onrender.com/app/auth/forgetPassword', {
        email: email,
      });
      setDisableResend(true);
      setTimerCount(20);
      setError(null);
      toast.success('A new OTP has been sent to your email.');
    } catch (error) {
      console.error(error);
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 rounded-lg" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '800px', height: '500px' }}>
        <h2 className="text-center mb-4 text-main" style={{ fontWeight: 'bold' }}>Email Verification</h2>
        <p className="text-center mb-4 font-sm">We have sent a verification code to your email</p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="row justify-content-center mb-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="col-auto mb-3">
                <input
                  className="form-control text-center"
                  type="text"
                  name={`otp${index}`}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value && e.target.value.length === 1) {
                      focusNextInput(index);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values[`otp${index}`]}
                  style={{ width: '60px', height: '60px', fontSize: '24px', margin: '0 10px' }}
                  ref={(input) => (otpRefs.current[index] = input)}
                />
                {formik.touched[`otp${index}`] && formik.errors[`otp${index}`] && (
                  <div className="invalid-feedback d-block">{formik.errors[`otp${index}`]}</div>
                )}
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                Submit
              </button>
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-link" onClick={resendOTP} disabled={disableResend}>
                Resend OTP {disableResend ? `in ${timerCount} seconds` : ''}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
