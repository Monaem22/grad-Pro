const express = require("express");
const {
createnotification,
deletenotification,
getnotification,
updatenotification,
getnotifications

} = require('../Services/notificationServices');

const authService = require('../Services/authServices');

const router = express.Router();


router
  .route('/')
  .get(getnotifications)
  .post(
    authService.protect,
    authService.allowedto('student', 'admin'),
    createnotification
  );
router
  .route('/:id')
  .get(getnotification)
  .put(
    authService.protect,
    authService.allowedto('student', 'admin'),
    updatenotification
  )
  .delete(
    authService.protect,
    authService.allowedto('admin'),
    deletenotification
  );

module.exports = router;