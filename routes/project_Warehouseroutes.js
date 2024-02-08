const express = require("express");
const {
  getallProject_warehouse,
  getProject_warehouse,
  createProject_warehouse,
  updateProject_warehouse,
  deleteProject_warehouse,
  uploadprojectpdf,
  processpdf,
  downloadpdf
} = require('../Services/ProjectMangementServices');

const authService = require('../Services/authServices');

const router = express.Router();


router
  .route('/')
  .get(getallProject_warehouse)
  .post(
    authService.protect,
    authService.allowedto('admin', 'student'),
    uploadprojectpdf,
    processpdf,
    createProject_warehouse
  );
router
  .route('/:id')
  .get( getProject_warehouse)
  .put(
    authService.protect,
    authService.allowedto('admin', 'student'),
    uploadprojectpdf,
    processpdf,
    updateProject_warehouse
  )
  .delete(
    authService.protect,
    authService.allowedto('student'),
    deleteProject_warehouse
  );

  router.route('/download/:filename').get(downloadpdf)

module.exports = router;