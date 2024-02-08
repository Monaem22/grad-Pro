const express = require("express");

const authService = require("../Services/authServices");

const { addprojectTofavouritelist,removeProjectFromfavouritelist,getLoggedUserfavouritelist } = require("../Services/favourtelistService.js");

const router = express.Router();

router.use(authService.protect, authService.allowedto("student"));

router.route('/').post(addprojectTofavouritelist).get(getLoggedUserfavouritelist);

router.delete('/:projectId', removeProjectFromfavouritelist);

module.exports = router;