const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,

} = require('../Services/categoriesServices');

const authService = require('../Services/authServices');

const router = express.Router();


router
  .route('/')
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedto('student', 'admin'),
    createCategory
  );
router
  .route('/:id')
  .get(getCategory)
  .put(
    authService.protect,
    authService.allowedto('student', 'admin'),
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedto('admin'),
    deleteCategory
  );

module.exports = router;