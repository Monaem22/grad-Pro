import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AccountSettings() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState(null); // Add state for image
  const [OwnerImage, setOwnerImage] = useState('');



  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/showMyProfile', {
        withCredentials: true
      });
      setProfileData(response.data.my_Profile);
        const imageIdWithExtension =response.data.my_Profile.image
        setOwnerImage(`https://grad-project-3zvo.onrender.com${imageIdWithExtension}`);
      
    } catch (error) {
      toast.error('Error fetching profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async (values) => {
    setIsSaving(true);
    try {
      const changedValues = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== profileData[key]) {
          changedValues[key] = values[key];
        }
      });

      // Handle addresses separately if it has changed
      if (JSON.stringify(values.addresses) !== JSON.stringify(profileData.addresses)) {
        changedValues.addresses = values.addresses;
      }

      // Check for newly added addresses
      const newAddresses = values.addresses.filter((address) => !profileData.addresses.includes(address));
      if (newAddresses.length > 0) {
        changedValues.newAddresses = newAddresses;
      }

      const response = await axios.put(
        'https://grad-project-3zvo.onrender.com/app/user/updateProfile',
        changedValues,
        { withCredentials: true }
      );
      // Update profileData with new addresses
      const updatedProfileData = {
        ...profileData,
        addresses: values.addresses,
      };
      window.location.reload(); // Refresh the page
      setProfileData(updatedProfileData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };
  const handleSaveImage = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', image); // Append image to form data

      const response = await axios.patch(
        'https://grad-project-3zvo.onrender.com/app/user/updateImage',
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      fetchProfileData();
    } catch (error) {
      toast.error('Error updating profile image');
    } finally {
      setIsSaving(false);
    }
  };
  const handleImageChange = (event) => {
    setImage(event.target.files[0]); // Set selected image file
  };

  const formik = useFormik({
    initialValues: {
      userName: '',    
      bio: '',
      email: '',
      Gmail_Acc: '',
      age: '',
      addresses: ['']
    },
    onSubmit: handleSaveChanges
  });

  useEffect(() => {
    if (profileData) {
      formik.setValues({
        userName: profileData.userName,
        bio: profileData.bio,
        email: profileData.email,
        Gmail_Acc: profileData.Gmail_Acc,
        age: profileData.age,
        addresses: profileData.addresses
      });
    }
  }, [profileData]);

  const handleAddAddress = () => {
    const newAddresses = [...formik.values.addresses, '']; // Add a new address to the formik state
    formik.setValues({
      ...formik.values,
      addresses: newAddresses,
    });
  };

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...formik.values.addresses];
    updatedAddresses[index] = value;
    formik.setValues({
      ...formik.values,
      addresses: updatedAddresses
    });
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = [...formik.values.addresses];
    updatedAddresses.splice(index, 1);
    formik.setValues({
      ...formik.values,
      addresses: updatedAddresses
    });
  };
  
 
  return (
    <div className="container">
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="ms-2">Loading...</div>
        </div>
      )}
      {profileData && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Settings</h2>
          </div>
          <div className="card-body d-flex align-items-center flex-column">
  {/* Text indicating profile picture */}
  <p className="mb-3">Profile picture</p>

  {/* Display user's profile image */}
  {OwnerImage && (
    <div className="mb-3">
      <img src={OwnerImage} style={{ width: '200px', height: '200px', border: '2px solid black', objectFit: 'cover', marginRight: '10px' }} alt="Profile" className="img-fluid" />
    </div>
  )}

  {/* Image upload form */}
  <form onSubmit={(e) => { e.preventDefault(); handleSaveImage(); }} className="d-flex align-items-center">
    <div className="input-group mb-3">
      <label htmlFor="image" className="form-label">
      </label>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        className="form-control"
        onChange={handleImageChange}
      />
      <button className="btn btn-primary" type="submit" disabled={isSaving}>
        {isSaving ? 'Uploading...' : 'Save Image'}
      </button>
    </div>
  </form>
</div>


          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="userName"
                      className="form-control"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Bio" className="form-label">
                      Bio:
                    </label>
                    <input
                      type="text"
                      id="bio"
                      name="bio"
                      className="form-control"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gmailAccount" className="form-label">
                      Gmail Account:
                    </label>
                    <input
                      type="text"
                      id="gmailAccount"
                      name="Gmail_Acc"
                      className="form-control"
                      value={formik.values.Gmail_Acc}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Age:
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className="form-control"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="addresses" className="form-label">
                      Addresses:
                    </label>
                    {formik.values.addresses.map((address, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={address}
                          onChange={(e) => handleAddressChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleRemoveAddress(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" className="button-13" onClick={handleAddAddress}>
                      Add Address
                    </button>
                  </div>
                </div>
              </div>
             
              <div className="card-footer">
                <button className="btn btn-primary" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}