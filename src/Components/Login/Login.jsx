import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import localImage from '../../Assets/images/Mobile login-rafiki.png';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/userContext';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export default function Login() {
  let { setUserToken } = useContext(userContext);
  let navigate = useNavigate();
  const [isloading, setisLoading] = useState(false);

  async function loginSubmit(values) {
    setisLoading(true);
    try {
      const { data } = await axios.post(`https://grad-project-3zvo.onrender.com/app/auth/login`, values);
      console.log(data.token);
      setisLoading(false);

      Cookies.set('access_token', `bearer ${data.token}`, { expires: 7 });
      setUserToken(data.token);
      navigate('/');

      // Display success message
      toast.success('Login successful!');
    } catch (error) {
      setisLoading(false);
      let errorMessage = error.response ? error.response.data.message : 'An error occurred';

      // Display error message
      toast.error(errorMessage);
    }
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  let validationSchema = Yup.object({
    email: Yup.string().email('email is invalid').required('email is required!'),
    password: Yup.string()
      .matches(
        passwordRegex,
        'Password must contain at least 8 characters including one uppercase letter, one lowercase letter, and one digit'
      )
      .required('Password is required'),
  });

  let formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: loginSubmit,
  });

  return (
    <div className="w-100 h-screen d-flex justify-content-center align-items-center" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif', fontWeight: 'bold' }}>
      <div className="position-relative w-50 h-100 d-flex flex-column">
        <img src={localImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
      </div>

      <div className="w-50 pe-5">
        <div className="card shadow  ">
          <div className="card-body">
            <h3 className="card-title" style={{ color: 'rgb(27 93 165)' }}>Login Now</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email :</label>
                <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name='email' className='form-control' type="email" id='email' />
                {formik.errors.email && formik.touched.email && (<div className='alert mt-2 p-2 alert-danger'>{formik.errors.email}</div>)}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password :</label>
                <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name='password' className='form-control' type="password" id='password' />
                {formik.errors.password && formik.touched.password && (<div className='alert mt-2 p-2 alert-danger'>{formik.errors.password}</div>)}
              </div>
              {isloading ? (
                <button type="button" className="btn bg-main text-white mt-2">
                  <i className="fas fa-spinner fa-spin"></i>
                </button>
              ) : (
                <div className="d-flex align-items-center">
                  <button disabled={!formik.isValid || !formik.dirty} type="submit" className="btn bg-main text-white mt-2 mx-2">
                    Login
                  </button>
                </div>
              )}
              <p className="mt-2 mb-0">Don't have an account? <Link to="/register">Register</Link></p>
              <p className="mt-2 mb-0"><Link to="/forget-password">Forget Password?</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}
