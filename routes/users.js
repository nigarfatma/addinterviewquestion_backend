var express = require('express');
var router = express.Router();
const authController=require('../Controller/authController.js');
const questionAddController = require('../Controller/questionAddController.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// SIGNUP
router.post('/signUp',authController.signup)

// LOGIN
router.post("/login", authController.login);

// QUESTION
router.post('/question',questionAddController.questionAdd)
router.get('/getQuestion',questionAddController.questionGet)

// OTP
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
