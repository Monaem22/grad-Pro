import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddUser() {

  const [isLoading, setIsLoading] = useState(false);

  async function createUser(values) {
    setIsLoading(true);
    try {
      const response = await axios.post('https://grad-project-3zvo.onrender.com/app/user/createUser', values,{ withCredentials: true });
      setIsLoading(false);
      if (response.data.message === 'new user is created') {
        toast.success('User created successfully');
        // You can navigate to another page or perform any other action upon successful user creation
      } else {
        toast.error('Unexpected response from the server');
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response.data.error);
    }
  }
  
  const validationSchema = Yup.object({
    userName: Yup.string().min(3, 'Minimum length is 3').max(15, 'Maximum length is 15').required('Username is required!'),
    email: Yup.string().email('Invalid email').required('Email is required!'),
    password: Yup.string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must contain at least 8 characters including one uppercase letter, one lowercase letter, and one digit')
      .required('Password is required'),
    Gmail_Acc: Yup.string().email('Invalid email').required('Gmail account is required!'),
    role: Yup.string().required('Role is required!'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      Gmail_Acc: '',
      role: '', 
    },
    validationSchema,
    onSubmit: createUser,
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-1" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '500px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Add User</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">Username:</label>
              <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.userName} name='userName' className='form-control' type='text' id='userName' />
              {formik.errors.userName && formik.touched.userName && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.userName}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name='email' className='form-control' type='email' id='email' />
              {formik.errors.email && formik.touched.email && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name='password' className='form-control' type='password' id='password' />
              {formik.errors.password && formik.touched.password && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.password}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="Gmail_Acc" className="form-label">Gmail Account:</label>
              <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.Gmail_Acc} name='Gmail_Acc' className='form-control' type='email' id='Gmail_Acc' />
              {formik.errors.Gmail_Acc && formik.touched.Gmail_Acc && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.Gmail_Acc}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Role:</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="admin" value="admin" name="role" onChange={formik.handleChange} />
                <label className="form-check-label" htmlFor="admin">admin</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="student" value="student" name="role" onChange={formik.handleChange} />
                <label className="form-check-label" htmlFor="student">student</label>
              </div>
              {formik.errors.role && formik.touched.role && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.role}</div>}
            </div>
            <div className="text-center">
              {isLoading ? (
                <button type='button' className='btn bg-main text-white'>
                  <i className='fas fa-spinner fa-spin'></i>
                </button>
              ) : (
                <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn bg-primary text-white' style={{ width: '100%' }}>
                  Add User
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
