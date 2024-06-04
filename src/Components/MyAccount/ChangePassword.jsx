import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    if (name === 'oldPassword') {
      setOldPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(newPassword)) {
      setError(
        'New password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, and one digit.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password must match.');
      return;
    }

    try {
      const response = await axios.patch(
        'https://grad-project-3zvo.onrender.com/app/user/updatePassword',
        { oldPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      console.log(response.data); // Handle success response

      // Show success toast notification
      toast.success('Password changed successfully!');

      // Reset form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (error) {
      console.error(error.response.data); // Handle error response
      setError('Error updating password');

      // Show error toast notification
      toast.error('Error updating password!');
    }
  };

  return (
    <div className="container my-5 p-5 bg-light rounded shadow">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="oldPassword">Old Password:</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3 ">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="form-group  mb-3">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="button-6 btn btn-primary w-100">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
