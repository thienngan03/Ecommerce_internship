const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const passport = require('passport');

router.use(passport.initialize());

router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.put('/changePassword',authController.changePassword);


module.exports = router;