import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import localImage from '../../Assets/images/register_left_side.png';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  let navigate = useNavigate();

  const [isloading, setisLoading] = useState(false);

  async function registerSubmit(values) {
    setisLoading(true);
    try {
      const response = await axios.post(`https://grad-project-3zvo.onrender.com/app/auth/signup`, values);
      setisLoading(false);
      if (response.data.message === 'signUp is accepted ,you can log in now') {
        toast.success('Account created successfully');
        navigate('/login');
      } else {
        toast.error('Unexpected response from the server');
      }
    } catch (err) {
      setisLoading(false);
      toast.error(err.response.data.error);
    }
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  let validationSchema = Yup.object({
    userName: Yup.string().min(3, 'Minimum length is 3').max(15, 'Maximum length is 15').required('Name is required!'),
    email: Yup.string().email('Email is invalid').required('Email is required!'),
    password: Yup.string()
      .matches(passwordRegex, 'Password must contain at least 8 characters including one uppercase letter, one lowercase letter, and one digit')
      .required('Password is required'),
    Gmail_Acc: Yup.string().email('Email is invalid').required('Email is required!'),
  });

  let formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      Gmail_Acc: '',
    },
    validationSchema,
    onSubmit: registerSubmit,
  });

  return (
    <>
      <br />
      <div className="w-100 h-screen d-flex justify-content-center align-items-center" style={{ fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif', fontWeight: 'bold' }}>
        <div className="position-relative w-50 h-100 d-flex flex-column">
          <img src={localImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
        </div>

        <div className="w-50 pe-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title" style={{ color: 'rgb(27 93 165)' }}>Register Now</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Username:</label>
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

                {isloading ? (
                  <button type='button' className='btn bg-main text-white mt-2'>
                    <i className='fas fa-spinner fa-spin'></i>
                  </button>
                ) : (
                  <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn bg-primary text-white mt-2'>
                    Register
                  </button>
                )}

                <p className="mt-2">Already a member? <a href="/login">Log in</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br />
    </>
  );

}






  // return (
  //   <>
  //     <br />
  //     <div className="register-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif', fontWeight: 'bold' }}>
  //       <img src={localImage} alt="Profile" style={{ width: '800px', height: '600px', marginRight: '50px' }} />
  //       <div style={{ width: '40%' }}>
  
  //         {error !== null ? <div className='alert alert-danger'>{error}</div> : ''}
  
  //         <h3 className='custom-font' style={{ color: 'rgb(27 93 165)' }}>Register Now</h3>
  //         <form onSubmit={formik.handleSubmit}>
  //           <label htmlFor='name'>Name :</label>
  //           <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name} name='name' className='form-control mb-2' type='text' id='name' style={{ width: '200px' }} />
  //           {formik.errors.name && formik.touched.name && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.name}</div>}
  
  //           <label htmlFor='email'>Email :</label>
  //           <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name='email' className='form-control mb-2' type='email' id='email' style={{ width: '200px' }} />
  //           {formik.errors.email && formik.touched.email && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.email}</div>}
  
  //           <label htmlFor='password'>Password :</label>
  //           <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name='password' className='form-control mb-2' type='password' id='password' style={{ width: '200px' }} />
  //           {formik.errors.password && formik.touched.password && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.password}</div>}
  
  //           <label htmlFor='passwordConfirm'>Confirm Password :</label>
  //           <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.passwordConfirm} name='passwordConfirm' className='form-control mb-2' type='password' id='passwordConfirm' style={{ width: '200px' }} />
  //           {formik.errors.passwordConfirm && formik.touched.passwordConfirm && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.passwordConfirm}</div>}
  
  //           <label htmlFor='role'>Role :</label>
  //           <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.role} name='role' className='form-control mb-2' type='text' id='role'  placeholder="student or admin" style={{ width: '200px' }} />
  //           {formik.errors.role && formik.touched.role && <div className='alert mt-2 p-2 alert-danger'>{formik.errors.role}</div>}
  
  //           {isloading ? (
  //             <button type='button' className='btn bg-main text-white mt-2'>
  //               <i className='fas fa-spinner fa-spin'></i>
  //             </button>
  //           ) : (
  //             <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn bg-primary text-white mt-2'>
  //               Register
  //             </button>
  //           )}
  
  //           <p className="mt-2">Already a member? <a href="/login">Log in</a></p>
  //         </form>
  //       </div>
  //     </div>
  //     <br />
  //   </>
  // );
    // const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
