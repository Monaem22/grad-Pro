import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './AddProject.module.css';
import toast from 'react-hot-toast';
import backgroundImage from '../../Assets/images/grad2.jpg';

export default function AddProject() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  async function addProjectSubmit(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('application', values.pdf);
      formData.append('projectName', values.projectName);
      formData.append('category', values.category);
      formData.append('description', values.description);
  
      const response = await axios.post('https://grad-project-3zvo.onrender.com/app/project/createProject', formData, {
        withCredentials: true,
      });
  
      if (response.data.success) {

        setIsLoading(false);
        setError(null);

      } else {
        throw new Error(response.data.error); // Throw error if response indicates failure
      }
    } catch {
      setIsLoading(false);
      toast.success('Project has been added and pending for approval');

    }
  }
  
  
  const validationSchema = Yup.object({
    projectName: Yup.string().required('Project Name is required'),
    pdf: Yup.mixed().required('PDF file is required'),
    category: Yup.string().required('Category is required'),
    description: Yup.string().required('Description is required'),
    checkbox: Yup.boolean().oneOf([true], 'You must agree to the policy'), // Validation for checkbox

  });

  const formik = useFormik({
    initialValues: {
      projectName: '',
      pdf: null,
      category: '',
      description: '',
      checkbox: false, // Initial value for checkbox

    },
    validationSchema,
    onSubmit: addProjectSubmit,
  });

  return(
    <div 
      className={`${styles.container} w-100 h-100`}
      style={{ 
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
      }}
    >
      {/* Overlay for the background image */}
      <div className={styles.overlay}></div>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Add Your Project</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={formik.handleSubmit}>
          {/* Project Name */}
          <div className="mb-3">
            <label htmlFor="projectName" className="form-label">
              Project Name:
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.projectName}
              name="projectName"
              className="form-control"
              type="text"
              id="projectName"
              placeholder="Enter project name"
            />
            {formik.errors.projectName && formik.touched.projectName && (
              <div className="alert mt-2 p-2 alert-danger">{formik.errors.projectName}</div>
            )}
          </div>
          {/* PDF File */}
          <div className="mb-3">
            <label htmlFor="pdf" className="form-label">
              PDF File:
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={(event) => formik.setFieldValue('pdf', event.currentTarget.files[0])}
              name="pdf"
              className="form-control"
              type="file"
              id="pdf"
            />
            {formik.errors.pdf && formik.touched.pdf && (
              <div className="alert mt-2 p-2 alert-danger">{formik.errors.pdf}</div>
            )}
          </div>
          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category:
            </label>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.category}
              name="category"
              className="form-control"
              type="text"
              id="category"
              placeholder="Enter category"
            />
            {formik.errors.category && formik.touched.category && (
              <div className="alert mt-2 p-2 alert-danger">{formik.errors.category}</div>
            )}
          </div>
          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
              name="description"
              className="form-control"
              type="text"
              id="description"
              placeholder="Enter description"
            />
            {formik.errors.description && formik.touched.description && (
              <div className="alert mt-2 p-2 alert-danger">{formik.errors.description}</div>
            )}
          </div>
           <div>
           <div style={{ maxWidth: '600px' }}>
  <p>By uploading content, you agree to abide by our policy. This includes ensuring that your content is original and does not violate any copyright or intellectual property rights. We reserve the right to remove any content that violates our policy without notice.</p>
</div>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="checkbox"
              onChange={e => {
                formik.setFieldValue('checkbox', e.target.checked);
                setIsChecked(e.target.checked);
              }}
              checked={formik.values.checkbox}
            />
            <label className="form-check-label" htmlFor="checkbox">
              I agree to the policy
            </label>
            {formik.errors.checkbox && formik.touched.checkbox && (
              <div className="alert mt-2 p-2 alert-danger">{formik.errors.checkbox}</div>
            )}
          </div>
          {/* Submit Button */}
          {isLoading ? (
            <button type="button" className="btn bg-main text-white mt-2" disabled>
              <i className="fas fa-spinner fa-spin"></i> Adding Project
            </button>
          ) : (
            <button type="submit" className="btn  text-white mt-2" style={{ backgroundColor: '#1e4589', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease', textDecoration: 'none' }}>
              Add Project
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
